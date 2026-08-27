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
        $vacancies = Vacancy::with('department')->where('is_active', true)->paginate(15);
        return VacancyResource::collection($vacancies);
    }

    public function store(StoreVacancyRequest $request): JsonResponse
    {
        $vacancy = Vacancy::create($request->validated());

        return response()->json([
            'message' => 'Vacancy created successfully',
            'data' => new VacancyResource($vacancy),
        ], 201);
    }
}
