<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\Cms\StoreProjectRequest;
use App\Http\Requests\Cms\UpdateProjectRequest;
use App\Http\Resources\ProjectResource;
use App\Jobs\SendUpdateNotificationJob;
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
        return ProjectResource::collection(
            Project::with('coverMedia')->latest()->paginate(15)
        );
    }

    public function update(
        UpdateProjectRequest $request,
        string $id
    ): JsonResponse {
        $this->authorize('manage', Project::class);

        $project = Project::findOrFail($id);
        $oldValues = $project->toArray();
        $wasActive = $project->status === 'ACTIVE';

        $project->update($request->validated());

        if (! $wasActive && $project->status === 'ACTIVE') {
            SendUpdateNotificationJob::dispatch(
                'project',
                (string) $project->id,
                $project->title_bn ?? '',
                $project->title_en ?? '',
                $project->description_bn ?? '',
                $project->description_en ?? '',
                url('/projects')
            );
        }

        $project->load('coverMedia');

        $this->cmsService->logAudit(
            $project,
            'PROJECT_UPDATED',
            $request->user()->id,
            $request->ip(),
            $request->userAgent(),
            $oldValues,
            $project->fresh()->toArray()
        );

        return response()->json([
            'message' => 'Project updated successfully',
            'data' => new ProjectResource($project->fresh('coverMedia')),
        ]);
    }

    public function destroy(
        Request $request,
        string $id
    ): JsonResponse {
        $this->authorize('manage', Project::class);

        $project = Project::findOrFail($id);
        $oldValues = $project->toArray();

        $project->delete();

        $this->cmsService->logAudit(
            $project,
            'PROJECT_DELETED',
            $request->user()->id,
            $request->ip(),
            $request->userAgent(),
            $oldValues,
            null
        );

        return response()->json([
            'message' => 'Project deleted successfully',
        ]);
    }

    public function store(StoreProjectRequest $request): JsonResponse
    {
        $this->authorize('manage', Project::class);

        $project = Project::create($request->validated());
        $project->load('coverMedia');

        if ($project->status === 'ACTIVE') {
            SendUpdateNotificationJob::dispatch(
                'project',
                (string) $project->id,
                $project->title_bn ?? '',
                $project->title_en ?? '',
                $project->description_bn ?? '',
                $project->description_en ?? '',
                url('/projects')
            );
        }

        $this->cmsService->logAudit(
            $project,
            'PROJECT_CREATED',
            $request->user()->id,
            $request->ip(),
            $request->userAgent(),
            null,
            $project->toArray()
        );

        return response()->json([
            'message' => 'Project created successfully',
            'data' => new ProjectResource($project),
        ], 201);
    }
}
