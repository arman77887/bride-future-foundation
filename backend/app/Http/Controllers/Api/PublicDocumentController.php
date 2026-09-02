<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\Cms\StorePublicDocumentRequest;
use App\Http\Requests\Cms\UpdatePublicDocumentRequest;
use App\Http\Resources\PublicDocumentResource;
use App\Models\PublicDocument;
use App\Services\CmsService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;

class PublicDocumentController extends Controller
{
    protected CmsService $cmsService;

    public function __construct(CmsService $cmsService)
    {
        $this->cmsService = $cmsService;
    }

    public function index(): AnonymousResourceCollection
    {
        return PublicDocumentResource::collection(PublicDocument::latest()->paginate(15));
    }

    public function store(StorePublicDocumentRequest $request): JsonResponse
    {
        $this->authorize('manage', PublicDocument::class);

        $doc = PublicDocument::create($request->validated());

        $this->cmsService->logAudit(
            $doc,
            'DOCUMENT_CREATED',
            $request->user()->id,
            $request->ip(),
            $request->userAgent(),
            null,
            $doc->toArray()
        );

        return response()->json([
            'message' => 'Public document uploaded successfully',
            'data' => new PublicDocumentResource($doc),
        ], 201);
    }

    public function update(
        UpdatePublicDocumentRequest $request,
        string $id
    ): JsonResponse {
        $this->authorize('manage', PublicDocument::class);

        $doc = PublicDocument::findOrFail($id);
        $old = $doc->toArray();

        $doc->update($request->validated());

        $this->cmsService->logAudit(
            $doc,
            'DOCUMENT_UPDATED',
            $request->user()->id,
            $request->ip(),
            $request->userAgent(),
            $old,
            $doc->fresh()->toArray()
        );

        return response()->json([
            'message' => 'Public document updated successfully',
            'data' => new PublicDocumentResource($doc->fresh()),
        ]);
    }

    public function destroy(Request $request, string $id): JsonResponse
    {
        $this->authorize('manage', PublicDocument::class);

        $doc = PublicDocument::findOrFail($id);
        $old = $doc->toArray();

        $doc->delete();

        $this->cmsService->logAudit(
            $doc,
            'DOCUMENT_DELETED',
            $request->user()->id,
            $request->ip(),
            $request->userAgent(),
            $old,
            null
        );

        return response()->json([
            'message' => 'Public document deleted successfully',
        ]);
    }
}
