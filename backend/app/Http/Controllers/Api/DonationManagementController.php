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
use App\Mail\AdminNotificationMail;
use Illuminate\Support\Facades\Mail;
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
            'project',
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
                  ->orWhere('sender_info', 'like', "%{$search}%");
            });
        }

        if ($request->input('fund') === 'general') {
            $query->whereNull('project_id');
        } elseif ($request->filled('project_id')) {
            $query->where('project_id', $request->input('project_id'));
        }

        $donations = $query->latest()->paginate(15)->withQueryString();
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

        $recipients = config('mail.notification_recipients', [
            'tha.crypticx.official@gmail.com',
            'dyppomahadi2000@gmail.com',
        ]);

        Mail::to($recipients)->send(
            new AdminNotificationMail(
                notificationType: 'DONATION',
                title: 'New Donation Submitted',
                data: [
                    'donor_name' => $donation->donor_name,
                    'amount' => $donation->amount,
                    'currency' => $donation->currency_code,
                    'transaction_id' => $donation->transaction_id,
                    'sender_info' => $donation->sender_info,
                    'status' => $donation->status,
                    'donation_id' => $donation->id,
                ],
            )
        );

        return response()->json([
            'message' => 'Donation submitted successfully and is pending verification',
            'data' => new DonationResource(
                $donation->load(['donationMethod', 'project'])
            ),
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

        $path = $donation->screenshot_path;
        if ($path === 'none') {
            $path = null;
        }

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

        $baseQuery = Donation::query();

        if ($request->input('fund') === 'general') {
            $baseQuery->whereNull('project_id');
        } elseif ($request->filled('project_id')) {
            $baseQuery->where('project_id', $request->input('project_id'));
        }

        return response()->json([
            'total_donations' => (clone $baseQuery)->count(),
            'pending' => (clone $baseQuery)->where('status', 'PENDING')->count(),
            'under_review' => (clone $baseQuery)->where('status', 'UNDER_REVIEW')->count(),
            'verified' => (clone $baseQuery)->where('status', 'VERIFIED')->count(),
            'rejected' => (clone $baseQuery)->where('status', 'REJECTED')->count(),
            'reversed' => (clone $baseQuery)->where('status', 'REVERSED')->count(),
            'verified_amounts' => [
                'BDT' => (clone $baseQuery)
                    ->where('status', 'VERIFIED')
                    ->where('currency_code', 'BDT')
                    ->sum('amount'),
                'USD' => (clone $baseQuery)
                    ->where('status', 'VERIFIED')
                    ->where('currency_code', 'USD')
                    ->sum('amount'),
            ],
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

        $fund = $request->input('fund');
        $projectId = $request->input('project_id');

        $callback = function () use ($fund, $projectId) {
            $file = fopen('php://output', 'w');

            fputcsv($file, [
                'ID',
                'Donor Name',
                'Fund / Project',
                'Amount',
                'Currency',
                'Donation Method',
                'Account Identifier',
                'Transaction ID',
                'Sender Info',
                'Status',
                'Created At',
            ]);

            $query = Donation::with([
                'donationMethod',
                'project',
            ]);

            if ($fund === 'general') {
                $query->whereNull('project_id');
            } elseif (!empty($projectId)) {
                $query->where('project_id', $projectId);
            }

            $query
                ->orderBy('created_at')
                ->chunk(200, function ($donations) use ($file) {
                    foreach ($donations as $donation) {
                        fputcsv($file, [
                            $donation->id,
                            $donation->donor_name,
                            $donation->project
                                ? ($donation->project->title_en
                                    ?: $donation->project->title_bn)
                                : 'General Donation',
                            $donation->amount,
                            $donation->currency_code,
                            $donation->donationMethod?->name_en
                                ?? $donation->donationMethod?->name_bn
                                ?? '-',
                            $donation->donationMethod?->account_identifier ?? '-',
                            $donation->transaction_id,
                            $donation->sender_info,
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
