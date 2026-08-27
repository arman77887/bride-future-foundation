<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\Donation\StoreDonationRequest;
use App\Http\Resources\DonationResource;
use App\Models\Donation;
use Illuminate\Http\JsonResponse;

class DonationController extends Controller
{
    public function store(StoreDonationRequest $request): JsonResponse
    {
        $donation = Donation::create(array_merge($request->validated(), [
            'status' => 'success',
        ]));

        return response()->json([
            'message' => 'Donation recorded successfully',
            'data' => new DonationResource($donation),
        ], 201);
    }
}
