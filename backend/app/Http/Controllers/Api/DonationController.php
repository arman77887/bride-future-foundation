<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\Donation\StoreDonationRequest;
use App\Http\Resources\DonationResource;
use App\Models\Donation;
use App\Services\DonationService;
use Illuminate\Http\JsonResponse;

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
            'data' => new DonationResource($donation),
        ], 201);
    }
}
