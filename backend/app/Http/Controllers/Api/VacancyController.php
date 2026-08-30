<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\Vacancy\StoreVacancyRequest;
use App\Http\Resources\VacancyResource;
use App\Models\Vacancy;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;

class VacancyController extends Controller
{
    public function index(): AnonymousResourceCollection
    {
        $vacancies = Vacancy::with(['department', 'position'])
            ->where('status', 'PUBLISHED')
            ->where('deadline', '>=', now())
            ->orderBy('deadline')
            ->paginate(15);

        return VacancyResource::collection($vacancies);
    }

    public function store(StoreVacancyRequest $request): JsonResponse
    {
        $data = $request->validated();

        $data['required_count'] = $data['required_count'] ?? 1;
        $data['status'] = $data['status'] ?? 'DRAFT';
        $data['created_by'] = $request->user()->id;

        $vacancy = Vacancy::create($data);

        return response()->json([
            'message' => 'Vacancy created successfully',
            'data' => new VacancyResource(
                $vacancy->load(['department', 'position'])
            ),
        ], 201);
    }
}
