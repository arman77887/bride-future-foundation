<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\Cms\StoreMediaRequest;
use App\Models\Media;
use App\Services\CmsService;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Storage;

class MediaController extends Controller
{
    protected CmsService $cmsService;

    public function __construct(CmsService $cmsService)
    {
        $this->cmsService = $cmsService;
    }

    public function store(StoreMediaRequest $request): JsonResponse
    {
        $this->authorize('manage', Media::class);
        $file = $request->file('file');
        $path = $file->store('public/cms-media', 'local');

        $media = Media::create([
            'filename' => $file->getClientOriginalName(),
            'storage_key' => $path,
            'mime_type' => $file->getMimeType(),
            'file_size' => $file->getSize(),
            'uploader_id' => $request->user()->id,
        ]);

        $this->cmsService->logAudit($media, 'MEDIA_UPLOADED', $request->user()->id, $request->ip(), $request->userAgent(), null, $media->toArray());

        return response()->json([
            'message' => 'Media uploaded successfully',
            'data' => $media,
        ], 201);
    }
}
