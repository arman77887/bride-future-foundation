<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\Cms\StoreGalleryItemRequest;
use App\Http\Requests\Cms\UpdateGalleryItemRequest;
use App\Models\GalleryItem;
use App\Models\Media;
use App\Services\CmsService;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Storage;
use Illuminate\Http\Request;

class GalleryItemController extends Controller
{
    protected CmsService $cmsService;

    public function __construct(CmsService $cmsService)
    {
        $this->cmsService = $cmsService;
    }

    public function store(StoreGalleryItemRequest $request): JsonResponse
    {
        $this->authorize('manage', \App\Models\GalleryAlbum::class);

        $data = $request->validated();

        if (!empty($data['media_id'])) {
            $media = Media::findOrFail($data['media_id']);

            $data['file_url'] = Storage::disk('public')->url(
                $media->storage_key
            );
        }

        $item = GalleryItem::create($data);

        $this->cmsService->logAudit(
            $item,
            'gallery_item.created',
            auth()->id(),
            request()->ip(),
            request()->userAgent(),
            null,
            $item->toArray()
        );

        return response()->json([
            'message' => 'Gallery image added successfully',
            'data' => $item->fresh()->load('media'),
        ], 201);
    }

    public function update(
        UpdateGalleryItemRequest $request,
        string $id
    ): JsonResponse {
        $this->authorize('manage', \App\Models\GalleryAlbum::class);

        $item = GalleryItem::findOrFail($id);
        $before = $item->toArray();

        $data = $request->validated();

        if (array_key_exists('media_id', $data) && !empty($data['media_id'])) {
            $media = Media::findOrFail($data['media_id']);

            $data['file_url'] = Storage::disk('public')->url(
                $media->storage_key
            );
        }

        $item->update($data);

        $this->cmsService->logAudit(
            $item,
            'gallery_item.updated',
            auth()->id(),
            request()->ip(),
            request()->userAgent(),
            $before,
            $item->fresh()->toArray()
        );

        return response()->json([
            'message' => 'Gallery image updated successfully',
            'data' => $item->fresh()->load('media'),
        ]);
    }

    public function destroy(Request $request, string $id): JsonResponse
    {
        $this->authorize('manage', \App\Models\GalleryAlbum::class);

        $item = GalleryItem::findOrFail($id);

        $this->cmsService->logAudit(
            $item,
            'gallery_item.deleted',
            auth()->id(),
            request()->ip(),
            request()->userAgent(),
            $item->toArray(),
            null
        );

        $item->delete();

        return response()->json([
            'message' => 'Gallery image deleted successfully',
        ]);
    }
}
