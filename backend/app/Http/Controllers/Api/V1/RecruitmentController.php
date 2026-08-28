<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Models\JobApplication;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class RecruitmentController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $query = JobApplication::with(['vacancy']);

        if ($request->has('status')) {
            $query->where('status', $request->string('status'));
        }

        $applications = $query->paginate($request->integer('per_page', 15));

        return response()->json($applications);
    }

    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'vacancy_id' => ['required', 'exists:vacancies,id'],
            'applicant_name' => ['required', 'string', 'max:255'],
            'applicant_email' => ['required', 'email', 'max:255'],
            'applicant_phone' => ['required', 'string', 'max:50'],
            'cover_letter' => ['nullable', 'string'],
        ]);

        $validated['status'] = 'PENDING';

        $application = DB::transaction(function () use ($validated) {
            return JobApplication::create($validated);
        });

        return response()->json([
            'message' => 'Application submitted successfully',
            'application' => $application,
        ], Response::HTTP_CREATED);
    }

    public function updateStatus(Request $request, JobApplication $application): JsonResponse
    {
        $validated = $request->validate([
            'status' => ['required', 'string', 'in:PENDING,SHORTLISTED,ACCEPTED,REJECTED'],
            'notes' => ['nullable', 'string', 'max:1000'],
        ]);

        DB::transaction(function () use ($application, $validated) {
            $application->update([
                'status' => $validated['status'],
                'admin_notes' => $validated['notes'] ?? $application->admin_notes,
            ]);
        });

        return response()->json([
            'message' => 'Application status updated successfully',
            'application' => $application->fresh(),
        ]);
    }
}
