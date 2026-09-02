<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\Officer\StoreOfficerRequest;
use App\Http\Requests\Officer\VerifyOfficerRequest;
use App\Http\Resources\OfficerProfileResource;
use App\Models\OfficerProfile;
use App\Models\OfficerVerificationHistory;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;

class OfficerController extends Controller
{
    /**
     * Public officers.
     */
    public function index(): AnonymousResourceCollection
    {
        $officers = OfficerProfile::with(['department', 'position'])
            ->where('is_public', true)
            ->paginate(15);

        return OfficerProfileResource::collection($officers);
    }

    /**
     * Admin officer list.
     */
    public function adminIndex(Request $request): AnonymousResourceCollection
    {
        $query = OfficerProfile::with(['department', 'position'])
            ->latest();

        if ($request->filled('search')) {
            $search = trim($request->string('search')->toString());

            $query->where(function ($q) use ($search) {
                $q->where('name', 'ilike', "%{$search}%")
                    ->orWhere('official_id', 'ilike', "%{$search}%")
                    ->orWhere('email_personal', 'ilike', "%{$search}%")
                    ->orWhere('phone', 'ilike', "%{$search}%");
            });
        }

        if ($request->filled('status')) {
            $status = strtoupper($request->string('status')->toString());

            if ($status !== 'ALL') {
                $query->where('status', $status);
            }
        }

        if ($request->filled('department_id')) {
            $query->where('department_id', $request->string('department_id'));
        }

        if ($request->filled('position_id')) {
            $query->where('position_id', $request->string('position_id'));
        }

        return OfficerProfileResource::collection(
            $query->paginate(15)->withQueryString()
        );
    }

    /**
     * Create officer profile.
     */
    public function store(StoreOfficerRequest $request): JsonResponse
    {
        $officer = OfficerProfile::create(array_merge(
            $request->validated(),
            [
                'status' => 'SUBMITTED',
                'is_public' => false,
            ]
        ));

        $officer->load(['department', 'position']);

        return response()->json([
            'message' => 'Officer profile submitted successfully',
            'data' => new OfficerProfileResource($officer),
        ], 201);
    }

    /**
     * Verify officer.
     */
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
