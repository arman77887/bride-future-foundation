<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\Vacancy\StoreVacancyRequest;
use App\Http\Requests\Vacancy\UpdateVacancyRequest;
use App\Http\Resources\VacancyResource;
use App\Models\Vacancy;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;

class VacancyController extends Controller
{
    public function index(): AnonymousResourceCollection
    {
        $vacancies = Vacancy::with(['department', 'position'])
            ->withCount([
                'applications' => function ($query) {
                    $query->where('status', '!=', 'WITHDRAWN');
                },
            ])
            ->where('status', 'PUBLISHED')
            ->whereRaw('is_active = TRUE')
            ->where('deadline', '>=', now())
            ->orderBy('deadline')
            ->paginate(15);

        return VacancyResource::collection($vacancies);
    }

    public function options(): JsonResponse
    {
        return response()->json([
            'departments' => \App\Models\Department::query()
                ->whereRaw('is_active = TRUE')
                ->orderBy('display_order')
                ->get(['id', 'name_bn', 'name_en']),

            'positions' => \App\Models\Position::query()
                ->whereRaw('is_active = TRUE')
                ->orderBy('display_order')
                ->get(['id', 'title_bn', 'title_en']),
        ]);
    }

    public function adminIndex(): AnonymousResourceCollection
    {
        $vacancies = Vacancy::with(['department', 'position'])
            ->withCount([
                'applications' => function ($query) {
                    $query->where('status', '!=', 'WITHDRAWN');
                },
            ])
            ->orderByDesc('created_at')
            ->paginate(20);

        return VacancyResource::collection($vacancies);
    }

    public function store(StoreVacancyRequest $request): JsonResponse
    {
        $data = $request->validated();

        $data['required_count'] = $data['required_count'] ?? 1;
        $data['status'] = $data['status'] ?? 'DRAFT';
        $data['is_active'] = $data['is_active'] ?? true;
        $data['application_limit'] = $data['application_limit'] ?? null;
        $data['created_by'] = $request->user()->id;

        $vacancy = Vacancy::create($data);

        return response()->json([
            'message' => 'Vacancy created successfully',
            'data' => new VacancyResource(
                $vacancy->load(['department', 'position'])
            ),
        ], 201);
    }

    public function update(
        UpdateVacancyRequest $request,
        string $id
    ): JsonResponse {
        $vacancy = Vacancy::findOrFail($id);

        $data = $request->validated();

        $vacancy->update($data);

        return response()->json([
            'message' => 'Vacancy updated successfully',
            'data' => new VacancyResource(
                $vacancy->fresh()->load(['department', 'position'])
            ),
        ]);
    }

    public function destroy(string $id): JsonResponse
    {
        $vacancy = Vacancy::findOrFail($id);

        if ($vacancy->applications()->exists()) {
            return response()->json([
                'message' => 'This vacancy cannot be deleted because applications already exist for it. Please deactivate or close the vacancy instead.',
            ], 422);
        }

        $vacancy->delete();

        return response()->json([
            'message' => 'Vacancy deleted successfully',
        ]);
    }
}
