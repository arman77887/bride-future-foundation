<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\Officer\StoreOfficerRequest;
use App\Http\Requests\Officer\VerifyOfficerRequest;
use App\Http\Resources\OfficerProfileResource;
use App\Models\OfficerProfile;
use App\Models\OfficerVerificationHistory;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;

class OfficerController extends Controller
{
    public function index(): AnonymousResourceCollection
    {
        $officers = OfficerProfile::with(['department', 'position'])
            ->where('is_public', true)
            ->paginate(15);

        return OfficerProfileResource::collection($officers);
    }

    public function store(StoreOfficerRequest $request): JsonResponse
    {
        $officer = OfficerProfile::create(array_merge(
            $request->validated(),
            [
                'status' => 'SUBMITTED',
                'is_public' => false,
            ]
        ));

        return response()->json([
            'message' => 'Officer profile submitted successfully',
            'data' => new OfficerProfileResource($officer),
        ], 201);
    }

    public function verify(
        VerifyOfficerRequest $request,
        string $id
    ): JsonResponse {
        $officer = OfficerProfile::findOrFail($id);

        $previousStatus = $officer->status;

        $newStatus = strtoupper($request->validated('status'));

        $officer->update([
            'status' => $newStatus,
            'is_public' => $newStatus === 'APPROVED',
        ]);

        OfficerVerificationHistory::create([
            'officer_profile_id' => $officer->id,
            'reviewer_id' => $request->user()->id,
            'previous_status' => $previousStatus,
            'new_status' => $newStatus,
            'review_note' => $request->validated('remarks'),
        ]);

        $officer->load(['department', 'position']);

        return response()->json([
            'message' => 'Officer verification status updated',
            'data' => new OfficerProfileResource($officer),
        ]);
    }
}
