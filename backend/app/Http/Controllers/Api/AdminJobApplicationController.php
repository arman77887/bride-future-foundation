<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\JobApplication;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class AdminJobApplicationController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $query = JobApplication::with([
            'vacancy:id,title_bn,title_en',
        ])->latest();

        if ($request->filled('status')) {
            $query->where('status', strtoupper($request->string('status')));
        }

        if ($request->filled('search')) {
            $search = $request->string('search');

            $query->where(function ($q) use ($search) {
                $q->where('applicant_name', 'ILIKE', "%{$search}%")
                  ->orWhere('applicant_email', 'ILIKE', "%{$search}%")
                  ->orWhere('applicant_phone', 'ILIKE', "%{$search}%")
                  ->orWhere('application_reference', 'ILIKE', "%{$search}%");
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

    public function show(string $id): JsonResponse
    {
        $application = JobApplication::with([
            'vacancy',
        ])->findOrFail($id);

        return response()->json([
            'success' => true,
            'data' => $application,
        ]);
    }

    public function updateStatus(Request $request, string $id): JsonResponse
    {
        $validated = $request->validate([
            'status' => [
                'required',
                'string',
                'in:PENDING,UNDER_REVIEW,SHORTLISTED,INTERVIEW,SELECTED,REJECTED,WITHDRAWN',
            ],
        ]);

        $application = JobApplication::findOrFail($id);

        $application->update([
            'status' => $validated['status'],
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Application status updated successfully.',
            'data' => $application->fresh()->load('vacancy'),
        ]);
    }
}
