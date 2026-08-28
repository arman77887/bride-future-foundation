<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\Cms\StoreCmsPageRequest;
use App\Http\Requests\Cms\UpdateCmsPageRequest;
use App\Http\Resources\CmsPageResource;
use App\Models\CmsPage;
use App\Services\CmsService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;

class CmsPageController extends Controller
{
    protected CmsService $cmsService;

    public function __construct(CmsService $cmsService)
    {
        $this->cmsService = $cmsService;
    }

    public function index(Request $request): AnonymousResourceCollection
    {
        $query = CmsPage::query();
        if (!$request->user() || !$request->user()->roles()->whereIn('slug', ['admin', 'president', 'content-manager'])->exists()) {
            $query->where('status', 'PUBLISHED');
        } elseif ($request->has('status')) {
            $query->where('status', $request->status);
        }

        return CmsPageResource::collection($query->latest()->paginate(15));
    }

    public function show(Request $request, string $slug): CmsPageResource
    {
        $query = CmsPage::where('slug', $slug);
        if (!$request->user() || !$request->user()->roles()->whereIn('slug', ['admin', 'president', 'content-manager'])->exists()) {
            $query->where('status', 'PUBLISHED');
        }

        $page = $query->firstOrFail();
        return new CmsPageResource($page);
    }

    public function store(StoreCmsPageRequest $request): JsonResponse
    {
        $this->authorize('manage', CmsPage::class);

        $data = $request->validated();
        $data['created_by'] = $request->user()->id;
        if ($data['status'] === 'PUBLISHED') {
            $data['published_at'] = now();
        }

        $page = CmsPage::create($data);

        $this->cmsService->logAudit($page, 'PAGE_CREATED', $request->user()->id, $request->ip(), $request->userAgent(), null, $page->toArray());

        return response()->json([
            'message' => 'CMS page created successfully',
            'data' => new CmsPageResource($page),
        ], 201);
    }

    public function update(UpdateCmsPageRequest $request, string $id): JsonResponse
    {
        $this->authorize('manage', CmsPage::class);

        $page = CmsPage::findOrFail($id);
        $oldValues = $page->toArray();
        $data = $request->validated();
        $data['updated_by'] = $request->user()->id;

        if (isset($data['status']) && $data['status'] === 'PUBLISHED' && $page->status !== 'PUBLISHED') {
            $data['published_at'] = now();
        }

        $page->update($data);

        $this->cmsService->logAudit($page, 'PAGE_UPDATED', $request->user()->id, $request->ip(), $request->userAgent(), $oldValues, $page->toArray());

        return response()->json([
            'message' => 'CMS page updated successfully',
            'data' => new CmsPageResource($page),
        ]);
    }

    public function destroy(Request $request, string $id): JsonResponse
    {
        $this->authorize('manage', CmsPage::class);

        $page = CmsPage::findOrFail($id);
        $oldValues = $page->toArray();
        $page->delete();

        $this->cmsService->logAudit($page, 'PAGE_DELETED', $request->user()->id, $request->ip(), $request->userAgent(), $oldValues, null);

        return response()->json(['message' => 'CMS page deleted successfully']);
    }
}
