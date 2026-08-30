<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\Donation\StoreDonationMethodRequest;
use App\Http\Requests\Donation\UpdateDonationMethodRequest;
use App\Http\Resources\DonationMethodResource;
use App\Models\DonationMethod;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;

class DonationMethodController extends Controller
{
    public function index(): AnonymousResourceCollection
    {
        $methods = DonationMethod::orderBy('display_order')->get();
        return DonationMethodResource::collection($methods);
    }

    public function store(StoreDonationMethodRequest $request): JsonResponse
    {
        $method = DonationMethod::create($request->validated());
        return response()->json([
            'message' => 'Donation method created successfully',
            'data' => new DonationMethodResource($method),
        ], 201);
    }

    public function update(UpdateDonationMethodRequest $request, string $id): JsonResponse
    {
        $method = DonationMethod::findOrFail($id);
        $method->update($request->validated());
        return response()->json([
            'message' => 'Donation method updated successfully',
            'data' => new DonationMethodResource($method),
        ]);
    }

    public function destroy(string $id): JsonResponse
    {
        $method = DonationMethod::findOrFail($id);
        $method->forceDelete();
        return response()->json([
            'message' => 'Donation method deleted successfully',
        ]);
    }
}
