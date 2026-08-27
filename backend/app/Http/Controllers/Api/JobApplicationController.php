<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\JobApplication\StoreJobApplicationRequest;
use App\Models\JobApplication;
use Illuminate\Http\JsonResponse;

class JobApplicationController extends Controller
{
    public function store(StoreJobApplicationRequest $request): JsonResponse
    {
        $application = JobApplication::create($request->validated());

        return response()->json([
            'message' => 'Job application submitted successfully',
            'data' => $application,
        ], 201);
    }
}
