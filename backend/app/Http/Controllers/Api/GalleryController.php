<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\Cms\StoreGalleryAlbumRequest;
use App\Http\Resources\GalleryAlbumResource;
use App\Models\GalleryAlbum;
use App\Services\CmsService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;

class GalleryController extends Controller
{
    protected CmsService $cmsService;

    public function __construct(CmsService $cmsService)
    {
        $this->cmsService = $cmsService;
    }

    public function index(): AnonymousResourceCollection
    {
        return GalleryAlbumResource::collection(GalleryAlbum::with('items')->latest()->paginate(15));
    }

    public function store(StoreGalleryAlbumRequest $request): JsonResponse
    {
        $this->authorize('manage', GalleryAlbum::class);
        $album = GalleryAlbum::create($request->validated());
        $this->cmsService->logAudit($album, 'GALLERY_CREATED', $request->user()->id, $request->ip(), $request->userAgent(), null, $album->toArray());
        return response()->json(['message' => 'Gallery album created successfully', 'data' => new GalleryAlbumResource($album)], 201);
    }
}
