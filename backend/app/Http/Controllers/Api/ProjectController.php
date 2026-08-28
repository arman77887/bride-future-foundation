<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\Cms\StoreProjectRequest;
use App\Http\Resources\ProjectResource;
use App\Models\Project;
use App\Services\CmsService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;

class ProjectController extends Controller
{
    protected CmsService $cmsService;

    public function __construct(CmsService $cmsService)
    {
        $this->cmsService = $cmsService;
    }

    public function index(Request $request): AnonymousResourceCollection
    {
        return ProjectResource::collection(Project::latest()->paginate(15));
    }

    public function store(StoreProjectRequest $request): JsonResponse
    {
        $this->authorize('manage', Project::class);
        $project = Project::create($request->validated());
        $this->cmsService->logAudit($project, 'PROJECT_CREATED', $request->user()->id, $request->ip(), $request->userAgent(), null, $project->toArray());
        return response()->json(['message' => 'Project created successfully', 'data' => new ProjectResource($project)], 201);
    }
}
