<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\Cms\StoreCmsPageRequest;
use App\Http\Requests\Cms\UpdateCmsPageRequest;
use App\Http\Resources\CmsPageResource;
use App\Models\CmsPage;
use App\Models\CmsPageSection;
use App\Services\CmsService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;
use Illuminate\Support\Facades\DB;

class CmsPageController extends Controller
{
    protected CmsService $cmsService;

    public function __construct(CmsService $cmsService)
    {
        $this->cmsService = $cmsService;
    }

    public function index(Request $request): AnonymousResourceCollection
    {
        $query = CmsPage::with('sections');

        $isManager = $request->user()
            && $request->user()->roles()
                ->whereIn('slug', ['admin', 'president', 'content-manager'])
                ->exists();

        if (!$isManager) {
            $query->where('status', 'PUBLISHED');
        } elseif ($request->filled('status')) {
            $query->where('status', $request->status);
        }

        return CmsPageResource::collection(
            $query->latest()->paginate(50)
        );
    }

    public function show(Request $request, string $slug): CmsPageResource
    {
        $query = CmsPage::with([
            'sections' => function ($q) {
                $q->orderBy('display_order');
            }
        ])->where('slug', $slug);

        $isManager = $request->user()
            && $request->user()->roles()
                ->whereIn('slug', ['admin', 'president', 'content-manager'])
                ->exists();

        if (!$isManager) {
            $query->where('status', 'PUBLISHED');
        }

        return new CmsPageResource($query->firstOrFail());
    }

    public function store(StoreCmsPageRequest $request): JsonResponse
    {

        $data = $request->validated();

        $page = DB::transaction(function () use ($data, $request) {
            $data['created_by'] = $request->user()->id;

            if (($data['status'] ?? 'DRAFT') === 'PUBLISHED') {
                $data['published_at'] = now();
            }

            return CmsPage::create($data);
        });

        $this->cmsService->logAudit(
            $page,
            'PAGE_CREATED',
            $request->user()->id,
            $request->ip(),
            $request->userAgent(),
            null,
            $page->toArray()
        );

        return response()->json([
            'message' => 'CMS page created successfully',
            'data' => new CmsPageResource($page->load('sections')),
        ], 201);
    }

    public function update(
        UpdateCmsPageRequest $request,
        string $id
    ): JsonResponse {

        $page = CmsPage::findOrFail($id);

        $oldValues = $page->toArray();
        $data = $request->validated();

        $data['updated_by'] = $request->user()->id;

        if (
            isset($data['status']) &&
            $data['status'] === 'PUBLISHED' &&
            $page->status !== 'PUBLISHED'
        ) {
            $data['published_at'] = now();
        }

        $page->update($data);

        $this->cmsService->logAudit(
            $page,
            'PAGE_UPDATED',
            $request->user()->id,
            $request->ip(),
            $request->userAgent(),
            $oldValues,
            $page->fresh()->toArray()
        );

        return response()->json([
            'message' => 'CMS page updated successfully',
            'data' => new CmsPageResource($page->load('sections')),
        ]);
    }

    public function updateSections(
        Request $request,
        string $id
    ): JsonResponse {

        $validated = $request->validate([
            'sections' => ['required', 'array'],
            'sections.*.id' => ['nullable', 'uuid'],
            'sections.*.section_key' => ['required', 'string', 'max:100'],
            'sections.*.title_bn' => ['nullable', 'string', 'max:255'],
            'sections.*.title_en' => ['nullable', 'string', 'max:255'],
            'sections.*.content_bn' => ['nullable', 'string'],
            'sections.*.content_en' => ['nullable', 'string'],
            'sections.*.display_order' => ['nullable', 'integer'],
            'sections.*.is_active' => ['nullable', 'boolean'],
        ]);

        $page = CmsPage::findOrFail($id);

        DB::transaction(function () use ($validated, $page) {
            foreach ($validated['sections'] as $section) {
                $section['cms_page_id'] = $page->id;

                if (!empty($section['id'])) {
                    $existing = CmsPageSection::where('cms_page_id', $page->id)
                        ->findOrFail($section['id']);

                    $existing->update($section);
                } else {
                    CmsPageSection::create($section);
                }
            }
        });

        $page->load([
            'sections' => fn ($q) => $q->orderBy('display_order')
        ]);

        return response()->json([
            'message' => 'Homepage sections updated successfully',
            'data' => new CmsPageResource($page),
        ]);
    }

    public function destroy(Request $request, string $id): JsonResponse
    {

        $page = CmsPage::findOrFail($id);

        $oldValues = $page->toArray();

        $page->delete();

        $this->cmsService->logAudit(
            $page,
            'PAGE_DELETED',
            $request->user()->id,
            $request->ip(),
            $request->userAgent(),
            $oldValues,
            null
        );

        return response()->json([
            'message' => 'CMS page deleted successfully',
        ]);
    }
}
