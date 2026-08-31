<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\ApplicationStatusHistory;
use App\Models\JobApplication;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class AdminJobApplicationController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $user = $request->user();

        abort_unless(
            $user && $user->hasPermission('applications.view'),
            403
        );

        $query = JobApplication::with([
            'vacancy:id,title_bn,title_en',
        ])->latest();

        if ($request->filled('status')) {
            $query->where(
                'status',
                strtoupper($request->string('status'))
            );
        }

        if ($request->filled('search')) {
            $search = $request->string('search');

            $query->where(function ($q) use ($search) {
                $q->where('applicant_name', 'ILIKE', "%{$search}%")
                    ->orWhere('applicant_email', 'ILIKE', "%{$search}%")
                    ->orWhere('applicant_phone', 'ILIKE', "%{$search}%")
                    ->orWhere(
                        'application_reference',
                        'ILIKE',
                        "%{$search}%"
                    );
            });
        }

        $applications = $query->paginate(
            min((int) $request->input('per_page', 15), 100)
        );

        return response()->json([
            'success' => true,
            'data' => $applications,
        ]);
    }

    public function show(Request $request, string $id): JsonResponse
    {
        $user = $request->user();

        abort_unless(
            $user && $user->hasPermission('applications.view'),
            403
        );

        $application = JobApplication::with([
            'vacancy',
            'statusHistory.changedBy:id,email',
        ])->findOrFail($id);

        return response()->json([
            'success' => true,
            'data' => $application,
        ]);
    }

    public function updateStatus(
        Request $request,
        string $id
    ): JsonResponse {
        $user = $request->user();

        abort_unless(
            $user && $user->hasPermission('applications.status'),
            403
        );

        $validated = $request->validate([
            'status' => [
                'required',
                'string',
                'in:PENDING,UNDER_REVIEW,SHORTLISTED,INTERVIEW,SELECTED,REJECTED,WITHDRAWN',
            ],
            'note' => [
                'nullable',
                'string',
                'max:5000',
            ],
        ]);

        $application = JobApplication::findOrFail($id);

        $previousStatus = $application->status;
        $newStatus = $validated['status'];

        if ($previousStatus === $newStatus) {
            return response()->json([
                'success' => true,
                'message' => 'Application status is already '.$newStatus.'.',
                'data' => $application->fresh()->load('vacancy'),
            ]);
        }

        DB::transaction(function () use (
            $application,
            $previousStatus,
            $newStatus,
            $validated,
            $user
        ) {
            $application->update([
                'status' => $newStatus,
            ]);

            ApplicationStatusHistory::create([
                'application_id' => $application->id,
                'changed_by' => $user->id,
                'previous_status' => $previousStatus,
                'new_status' => $newStatus,
                'note' => $validated['note'] ?? null,
                'created_at' => now(),
            ]);
        });

        return response()->json([
            'success' => true,
            'message' => 'Application status updated successfully.',
            'data' => $application
                ->fresh()
                ->load('vacancy', 'statusHistory.changedBy:id,email'),
        ]);
    }
}
