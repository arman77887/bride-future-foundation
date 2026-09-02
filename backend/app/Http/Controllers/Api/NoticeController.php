<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Jobs\SendUpdateNotificationJob;
use App\Http\Requests\Cms\StoreNoticeRequest;
use App\Http\Requests\Cms\UpdateNoticeRequest;
use App\Http\Resources\NoticeResource;
use App\Models\Notice;
use App\Services\CmsService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;

class NoticeController extends Controller
{
    protected CmsService $cmsService;

    public function __construct(CmsService $cmsService)
    {
        $this->cmsService = $cmsService;
    }

    public function index(Request $request): AnonymousResourceCollection
    {
        $query = Notice::with('coverMedia');
        if (!$request->user() || !$request->user()->roles()->whereIn('slug', ['admin', 'president', 'content-manager'])->exists()) {
            $query->where('status', 'PUBLISHED');
        }
        return NoticeResource::collection($query->latest()->paginate(15));
    }

    public function update(
        UpdateNoticeRequest $request,
        string $id
    ): JsonResponse {
        $this->authorize('manage', Notice::class);

        $notice = Notice::findOrFail($id);

        $oldValues = $notice->toArray();

        $wasPublished = $notice->status === 'PUBLISHED';

        $notice->update($request->validated());
        $notice->load('coverMedia');

        if (! $wasPublished && $notice->status === 'PUBLISHED') {
            SendUpdateNotificationJob::dispatch(
                'notice',
                (string) $notice->id,
                $notice->title_bn ?? '',
                $notice->title_en ?? '',
                $notice->content_bn ?? '',
                $notice->content_en ?? '',
                url('/notices')
            );
        }

        $this->cmsService->logAudit(
            $notice,
            'NOTICE_UPDATED',
            $request->user()->id,
            $request->ip(),
            $request->userAgent(),
            $oldValues,
            $notice->fresh()->toArray()
        );

        return response()->json([
            'message' => 'Notice updated successfully',
            'data' => new NoticeResource($notice->fresh('coverMedia')),
        ]);
    }

    public function destroy(
        Request $request,
        string $id
    ): JsonResponse {
        $this->authorize('manage', Notice::class);

        $notice = Notice::findOrFail($id);

        $oldValues = $notice->toArray();

        $notice->delete();

        $this->cmsService->logAudit(
            $notice,
            'NOTICE_DELETED',
            $request->user()->id,
            $request->ip(),
            $request->userAgent(),
            $oldValues,
            null
        );

        return response()->json([
            'message' => 'Notice deleted successfully',
        ]);
    }

    public function store(StoreNoticeRequest $request): JsonResponse
    {
        $this->authorize('manage', Notice::class);
        $notice = Notice::create($request->validated());
        $notice->load('coverMedia');

        if ($notice->status === 'PUBLISHED') {
            SendUpdateNotificationJob::dispatch(
                'notice',
                (string) $notice->id,
                $notice->title_bn ?? '',
                $notice->title_en ?? '',
                $notice->content_bn ?? '',
                $notice->content_en ?? '',
                url('/notices')
            );
        }
        $this->cmsService->logAudit($notice, 'NOTICE_CREATED', $request->user()->id, $request->ip(), $request->userAgent(), null, $notice->toArray());
        return response()->json(['message' => 'Notice created successfully', 'data' => new NoticeResource($notice)], 201);
    }
}
