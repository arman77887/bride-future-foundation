<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Jobs\SendUpdateNotificationJob;
use App\Http\Requests\Cms\StoreNewsRequest;
use App\Http\Requests\Cms\UpdateNewsRequest;
use App\Http\Resources\NewsResource;
use App\Models\News;
use App\Services\CmsService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;

class NewsController extends Controller
{
    protected CmsService $cmsService;

    public function __construct(CmsService $cmsService)
    {
        $this->cmsService = $cmsService;
    }

    public function index(Request $request): AnonymousResourceCollection
    {
        $query = News::with('coverMedia');
        if (!$request->user() || !$request->user()->roles()->whereIn('slug', ['admin', 'president', 'content-manager'])->exists()) {
            $query->where('status', 'PUBLISHED');
        }
        return NewsResource::collection($query->latest()->paginate(15));
    }

    public function show(Request $request, string $slug): NewsResource
    {
        $query = News::with('coverMedia')->where('slug', $slug);
        if (!$request->user() || !$request->user()->roles()->whereIn('slug', ['admin', 'president', 'content-manager'])->exists()) {
            $query->where('status', 'PUBLISHED');
        }
        return new NewsResource($query->firstOrFail());
    }

    public function store(StoreNewsRequest $request): JsonResponse
    {
        $this->authorize('manage', News::class);
        $data = $request->validated();
        $data['created_by'] = $request->user()->id;
        if ($data['status'] === 'PUBLISHED') {
            $data['published_at'] = now();
        }
        $news = News::create($data);
        $news->load('coverMedia');

        if ($news->status === 'PUBLISHED') {
            SendUpdateNotificationJob::dispatch(
                'news',
                (string) $news->id,
                $news->title_bn ?? '',
                $news->title_en ?? '',
                $news->content_bn ?? '',
                $news->content_en ?? '',
                url('/news/' . $news->slug)
            );
        }
        $this->cmsService->logAudit($news, 'NEWS_CREATED', $request->user()->id, $request->ip(), $request->userAgent(), null, $news->toArray());
        return response()->json(['message' => 'News created successfully', 'data' => new NewsResource($news)], 201);
    }

    public function update(
        UpdateNewsRequest $request,
        string $id
    ): JsonResponse {
        $this->authorize('manage', News::class);

        $news = News::findOrFail($id);

        $oldValues = $news->toArray();
        $data = $request->validated();

        if (($data['status'] ?? $news->status) === 'PUBLISHED' && !$news->published_at) {
            $data['published_at'] = now();
        }

        $wasPublished = $news->status === 'PUBLISHED';

        $news->update($data);
        $news->load('coverMedia');

        if (! $wasPublished && $news->status === 'PUBLISHED') {
            SendUpdateNotificationJob::dispatch(
                'news',
                (string) $news->id,
                $news->title_bn ?? '',
                $news->title_en ?? '',
                $news->content_bn ?? '',
                $news->content_en ?? '',
                url('/news/' . $news->slug)
            );
        }

        $this->cmsService->logAudit(
            $news,
            'NEWS_UPDATED',
            $request->user()->id,
            $request->ip(),
            $request->userAgent(),
            $oldValues,
            $news->fresh()->toArray()
        );

        return response()->json([
            'message' => 'News updated successfully',
            'data' => new NewsResource($news->fresh()),
        ]);
    }

    public function destroy(Request $request, string $id): JsonResponse
    {
        $this->authorize('manage', News::class);
        $news = News::findOrFail($id);
        $news->delete();
        $this->cmsService->logAudit($news, 'NEWS_DELETED', $request->user()->id, $request->ip(), $request->userAgent(), $news->toArray(), null);
        return response()->json(['message' => 'News deleted successfully']);
    }
}
