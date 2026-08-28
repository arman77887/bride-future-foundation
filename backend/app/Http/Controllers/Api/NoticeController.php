<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\Cms\StoreNoticeRequest;
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
        $query = Notice::query();
        if (!$request->user() || !$request->user()->roles()->whereIn('slug', ['admin', 'president', 'content-manager'])->exists()) {
            $query->where('status', 'PUBLISHED');
        }
        return NoticeResource::collection($query->latest()->paginate(15));
    }

    public function store(StoreNoticeRequest $request): JsonResponse
    {
        $this->authorize('manage', Notice::class);
        $notice = Notice::create($request->validated());
        $this->cmsService->logAudit($notice, 'NOTICE_CREATED', $request->user()->id, $request->ip(), $request->userAgent(), null, $notice->toArray());
        return response()->json(['message' => 'Notice created successfully', 'data' => new NoticeResource($notice)], 201);
    }
}
