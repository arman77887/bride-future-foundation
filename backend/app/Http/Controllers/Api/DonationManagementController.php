<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\Donation\SubmitDonationRequest;
use App\Http\Requests\Donation\TransitionDonationRequest;
use App\Http\Resources\DonationResource;
use App\Http\Resources\DonationVerificationHistoryResource;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;
use App\Models\Donation;
use App\Services\DonationService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;
use Illuminate\Support\Facades\Storage;
use Symfony\Component\HttpFoundation\StreamedResponse;

class DonationManagementController extends Controller
{
    use AuthorizesRequests;
    protected DonationService $donationService;

    public function __construct(DonationService $donationService)
    {
        $this->donationService = $donationService;
    }

    public function index(Request $request): AnonymousResourceCollection
    {
        $this->authorize('viewAny', Donation::class);

        $query = Donation::with([
            'donationMethod',
            'verifier',
            'verificationHistories.reviewer',
        ]);

        if ($request->has('status')) {
            $query->where('status', $request->status);
        }

        if ($request->has('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('donor_name', 'like', "%{$search}%")
                  ->orWhere('transaction_id', 'like', "%{$search}%")
                  ->orWhere('donor_email', 'like', "%{$search}%");
            });
        }

        $donations = $query->latest()->paginate(15);
        return DonationResource::collection($donations);
    }

    public function store(SubmitDonationRequest $request): JsonResponse
    {
        $evidence = $request->file('evidence');
        $donation = $this->donationService->submitDonation(
            $request->validated(),
            $evidence,
            $request->ip(),
            $request->userAgent()
        );

        return response()->json([
            'message' => 'Donation submitted successfully and is pending verification',
            'data' => new DonationResource($donation),
        ], 201);
    }

    public function transition(TransitionDonationRequest $request, string $id): JsonResponse
    {
        $donation = Donation::findOrFail($id);
        $this->authorize('review', $donation);

        $updated = $this->donationService->transitionStatus(
            $donation,
            $request->status,
            $request->user()->id,
            $request->notes,
            $request->ip(),
            $request->userAgent()
        );

        return response()->json([
            'message' => 'Donation status updated successfully',
            'data' => new DonationResource($updated),
        ]);
    }

    public function evidenceUrl(Request $request, string $id): JsonResponse
    {
        $donation = Donation::findOrFail($id);
        $this->authorize('viewEvidence', $donation);

        $gatewayResponse = $donation->gateway_response ?? [];
        $path = $gatewayResponse['evidence_path'] ?? null;

        if (!$path || !Storage::disk('local')->exists($path)) {
            return response()->json(['message' => 'Evidence file not found'], 404);
        }

        $url = Storage::disk('local')->temporaryUrl($path, now()->addMinutes(10));

        return response()->json([
            'signed_url' => $url,
            'expires_in' => 600,
        ]);
    }

    public function stats(Request $request): JsonResponse
    {
        $this->authorize('viewAny', Donation::class);

        return response()->json([
            'total_donations' => Donation::count(),
            'pending' => Donation::where('status', 'PENDING')->count(),
            'under_review' => Donation::where('status', 'UNDER_REVIEW')->count(),
            'verified' => Donation::where('status', 'VERIFIED')->count(),
            'rejected' => Donation::where('status', 'REJECTED')->count(),
            'reversed' => Donation::where('status', 'REVERSED')->count(),
            'total_verified_amount' => Donation::where('status', 'VERIFIED')->sum('amount'),
        ]);
    }

    public function export(Request $request): StreamedResponse
    {
        $this->authorize('export', Donation::class);

        $headers = [
            "Content-type" => "text/csv",
            "Content-Disposition" => "attachment; filename=donations_export_" . date('Y-m-d') . ".csv",
            "Pragma" => "no-cache",
            "Cache-Control" => "must-revalidate, post-check=0, pre-check=0",
            "Expires" => "0",
        ];

        $callback = function () {
            $file = fopen('php://output', 'w');
            fputcsv($file, ['ID', 'Donor Name', 'Email', 'Amount', 'Currency', 'Payment Gateway', 'Transaction ID', 'Status', 'Created At']);

            Donation::chunk(200, function ($donations) use ($file) {
                foreach ($donations as $donation) {
                    fputcsv($file, [
                        $donation->id,
                        $donation->donor_name,
                        $donation->donor_email,
                        $donation->amount,
                        $donation->currency,
                        $donation->payment_gateway,
                        $donation->transaction_id,
                        $donation->status,
                        $donation->created_at,
                    ]);
                }
            });

            fclose($file);
        };

        return response()->stream($callback, 200, $headers);
    }
}
