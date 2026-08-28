<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreDonationRequest;
use App\Http\Resources\DonationResource;
use App\Models\Donation;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpFoundation\StreamedResponse;

class DonationController extends Controller
{
    public function index(Request $request): AnonymousResourceCollection
    {
        $this->authorize('viewAny', Donation::class);

        $query = Donation::query();

        if ($request->has('status')) {
            $query->where('status', $request->string('status'));
        }

        $perPage = $request->integer('per_page', 15);
        $donations = $query->orderBy('created_at', 'desc')->paginate($perPage);

        return DonationResource::collection($donations);
    }

    public function store(StoreDonationRequest $request): DonationResource
    {
        $validated = $request->validated();

        if ($request->hasFile('evidence')) {
            $path = $request->file('evidence')->store('donations/evidence', 'private');
            $validated['evidence_path'] = $path;
        }

        $validated['status'] = Donation::STATUS_PENDING;

        $donation = DB::transaction(function () use ($validated) {
            return Donation::create($validated);
        });

        return new DonationResource($donation);
    }

    public function show(Donation $donation): DonationResource
    {
        $this->authorize('view', $donation);

        return new DonationResource($donation);
    }

    public function updateStatus(Request $request, Donation $donation): DonationResource
    {
        $this->authorize('updateStatus', $donation);

        $validated = $request->validate([
            'status' => ['required', 'string', 'in:PENDING,UNDER_REVIEW,VERIFIED,REJECTED,REVERSED'],
            'notes' => ['nullable', 'string', 'max:1000'],
        ]);

        DB::transaction(function () use ($donation, $validated) {
            $donation->update([
                'status' => $validated['status'],
                'admin_notes' => $validated['notes'] ?? $donation->admin_notes,
            ]);
        });

        return new DonationResource($donation->fresh());
    }

    public function downloadEvidence(Donation $donation): JsonResponse|StreamedResponse
    {
        $this->authorize('viewEvidence', $donation);

        if (!$donation->evidence_path || !Storage::disk('private')->exists($donation->evidence_path)) {
            return response()->json(['message' => 'Evidence file not found.'], Response::HTTP_NOT_FOUND);
        }

        return Storage::disk('private')->download($donation->evidence_path);
    }
}
