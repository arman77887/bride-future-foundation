<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\JobApplication\StoreJobApplicationRequest;
use App\Models\JobApplication;
use App\Models\ApplicationStatusHistory;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Str;

class JobApplicationController extends Controller
{
    public function store(StoreJobApplicationRequest $request): JsonResponse
    {
        $data = $request->validated();

        do {
            $reference = 'BFF-' . now()->format('Y') . '-' . strtoupper(Str::random(8));
        } while (
            JobApplication::where('application_reference', $reference)->exists()
        );

        $data['application_reference'] = $reference;
        $data['status'] = 'PENDING';

        $application = JobApplication::create($data);

        ApplicationStatusHistory::create([
            'application_id' => $application->id,
            'changed_by' => null,
            'previous_status' => 'NEW',
            'new_status' => 'PENDING',
            'note' => 'Application submitted.',
            'created_at' => now(),
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Job application submitted successfully',
            'data' => $application,
        ], 201);
    }
}
