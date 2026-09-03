<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreDonationRequest;
use App\Http\Resources\DonationResource;
use App\Models\Donation;
use App\Services\DonationService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class DonationController extends Controller
{
    public function __construct(
        protected DonationService $donationService
    ) {
    }

    public function store(StoreDonationRequest $request): JsonResponse
    {
        $donation = $this->donationService->submitDonation(
            $request->validated(),
            $request->file('evidence'),
            $request->ip(),
            $request->userAgent()
        );

        return response()->json([
            'message' => 'Donation submitted successfully and is pending verification',
            'data' => new DonationResource($donation->load('donationMethod')),
        ], 201);
    }

    public function show(Donation $donation): JsonResponse
    {
        return response()->json([
            'data' => new DonationResource(
                $donation->load('donationMethod')
            ),
        ]);
    }

    public function transitionStatus(
        Request $request,
        Donation $donation
    ): JsonResponse {
        $validated = $request->validate([
            'status' => [
                'required',
                'string',
                'in:' . implode(',', [
                    Donation::STATUS_UNDER_REVIEW,
                    Donation::STATUS_VERIFIED,
                    Donation::STATUS_REJECTED,
                    Donation::STATUS_REVERSED,
                ]),
            ],
            'notes' => [
                'nullable',
                'string',
                'max:5000',
            ],
        ]);

        $updatedDonation = $this->donationService->transitionStatus(
            $donation,
            $validated['status'],
            (string) $request->user()->id,
            $validated['notes'] ?? null,
            $request->ip(),
            $request->userAgent()
        );

        return response()->json([
            'message' => 'Donation status updated successfully',
            'data' => new DonationResource(
                $updatedDonation->load('donationMethod')
            ),
        ]);
    }
}
