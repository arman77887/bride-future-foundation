<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\Cms\StoreMediaRequest;
use App\Models\Media;
use App\Services\CmsService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class MediaController extends Controller
{
    protected CmsService $cmsService;

    public function __construct(CmsService $cmsService)
    {
        $this->cmsService = $cmsService;
    }

    public function index(): JsonResponse
    {
        $media = Media::latest('created_at')
            ->paginate(20)
            ->through(function (Media $item) {
                return [
                    'id' => $item->id,
                    'filename' => $item->filename,
                    'storage_key' => $item->storage_key,
                    'url' => Storage::disk('public')->url($item->storage_key),
                    'mime_type' => $item->mime_type,
                    'file_size' => $item->file_size,
                    'uploader_id' => $item->uploader_id,
                    'created_at' => $item->created_at,
                ];
            });

        return response()->json([
            'success' => true,
            'data' => $media,
        ]);
    }

    public function store(StoreMediaRequest $request): JsonResponse
    {
        $this->authorize('manage', Media::class);

        $file = $request->file('file');

        $path = $file->store('cms-media', 'public');

        $media = Media::create([
            'filename' => $file->getClientOriginalName(),
            'storage_key' => $path,
            'mime_type' => $file->getMimeType(),
            'file_size' => $file->getSize(),
            'uploader_id' => $request->user()->id,
        ]);

        $this->cmsService->logAudit(
            $media,
            'MEDIA_UPLOADED',
            $request->user()->id,
            $request->ip(),
            $request->userAgent(),
            null,
            $media->toArray()
        );

        return response()->json([
            'message' => 'Media uploaded successfully',
            'data' => $this->mediaData($media),
        ], 201);
    }

    public function update(Request $request, string $id): JsonResponse
    {
        $this->authorize('manage', Media::class);

        $media = Media::findOrFail($id);

        $old = $media->toArray();
        $oldStorageKey = $media->storage_key;

        $validated = $request->validate([
            'file' => [
                'sometimes',
                'file',
                'mimes:jpg,jpeg,png,pdf,docx',
                'max:20480',
            ],
            'filename' => [
                'sometimes',
                'string',
                'max:255',
            ],
        ]);

        if ($request->hasFile('file')) {
            $file = $request->file('file');

            $newPath = $file->store('cms-media', 'public');

            $media->update([
                'filename' => $file->getClientOriginalName(),
                'storage_key' => $newPath,
                'mime_type' => $file->getMimeType(),
                'file_size' => $file->getSize(),
            ]);

            if (
                $oldStorageKey &&
                Storage::disk('public')->exists($oldStorageKey)
            ) {
                Storage::disk('public')->delete($oldStorageKey);
            }
        } elseif (isset($validated['filename'])) {
            $media->update([
                'filename' => $validated['filename'],
            ]);
        }

        $media->refresh();

        $this->cmsService->logAudit(
            $media,
            'MEDIA_UPDATED',
            $request->user()->id,
            $request->ip(),
            $request->userAgent(),
            $old,
            $media->toArray()
        );

        return response()->json([
            'message' => 'Media updated successfully',
            'data' => $this->mediaData($media),
        ]);
    }

    public function destroy(Request $request, string $id): JsonResponse
    {
        $this->authorize('manage', Media::class);

        $media = Media::findOrFail($id);

        $old = $media->toArray();
        $storageKey = $media->storage_key;

        $media->delete();

        if (
            $storageKey &&
            Storage::disk('public')->exists($storageKey)
        ) {
            Storage::disk('public')->delete($storageKey);
        }

        $this->cmsService->logAudit(
            $media,
            'MEDIA_DELETED',
            $request->user()->id,
            $request->ip(),
            $request->userAgent(),
            $old,
            null
        );

        return response()->json([
            'message' => 'Media deleted successfully',
        ]);
    }

    private function mediaData(Media $media): array
    {
        return [
            'id' => $media->id,
            'filename' => $media->filename,
            'storage_key' => $media->storage_key,
            'url' => Storage::disk('public')->url($media->storage_key),
            'mime_type' => $media->mime_type,
            'file_size' => $media->file_size,
            'uploader_id' => $media->uploader_id,
            'created_at' => $media->created_at,
        ];
    }
}
