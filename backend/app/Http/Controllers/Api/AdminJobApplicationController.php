<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Mail\ApplicationApprovedMail;
use App\Models\ApplicationStatusHistory;
use App\Models\JobApplication;
use App\Models\OfficerProfile;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Storage;

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
            'vacancy:id,department_id,position_id,title_bn,title_en',
            'vacancy.department:id,name_bn,name_en',
            'vacancy.position:id,title_bn,title_en',
            'user:id,uid,name,email',
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
                    ->orWhere('applicant_uid', 'ILIKE', "%{$search}%")
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
            'vacancy.department',
            'vacancy.position',
            'user:id,uid,name,email',
            'statusHistory.changedBy:id,email',
        ])->findOrFail($id);

        $application->photo_url = $application->photo_path
            ? Storage::disk('public')->url($application->photo_path)
            : null;

        return response()->json([
            'success' => true,
            'data' => $application,
        ]);
    }

    public function updateStatus(
        Request $request,
        string $id
    ): JsonResponse {
        $admin = $request->user();

        abort_unless(
            $admin && $admin->hasPermission('applications.status'),
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

        $newStatus = $validated['status'];

        $application = JobApplication::with([
            'vacancy.department',
            'vacancy.position',
            'user',
        ])->findOrFail($id);

        $previousStatus = $application->status;

        if ($previousStatus === $newStatus) {
            return response()->json([
                'success' => true,
                'message' => 'Application status is already '.$newStatus.'.',
                'data' => $application,
            ]);
        }

        DB::transaction(function () use (
            $application,
            $previousStatus,
            $newStatus,
            $validated,
            $admin
        ) {
            $application->update([
                'status' => $newStatus,
            ]);

            ApplicationStatusHistory::create([
                'application_id' => $application->id,
                'changed_by' => $admin->id,
                'previous_status' => $previousStatus,
                'new_status' => $newStatus,
                'note' => $validated['note'] ?? null,
                'created_at' => now(),
            ]);

            if ($newStatus === 'SELECTED') {
                $application->refresh()->load([
                    'vacancy.department',
                    'vacancy.position',
                    'user',
                ]);

                if (!$application->user_id || !$application->user) {
                    abort(422, 'The applicant UID is not linked to a registered user.');
                }

                if (!$application->vacancy?->department_id) {
                    abort(422, 'The vacancy does not have a department.');
                }

                if (!$application->vacancy?->position_id) {
                    abort(422, 'The vacancy does not have a position.');
                }

                $existingMember = OfficerProfile::query()
                    ->where('user_id', $application->user_id)
                    ->first();

                if ($existingMember) {
                    abort(
                        422,
                        'This registered user already has a Foundation Member profile.'
                    );
                }

                OfficerProfile::create([
                    'user_id' => $application->user_id,
                    'department_id' => $application->vacancy->department_id,
                    'position_id' => $application->vacancy->position_id,
                    'official_id' => $application->application_reference,
                    'status' => 'APPROVED',
                    'is_public' => true,
                    'name' => $application->applicant_name,
                    'email_personal' => $application->applicant_email,
                    'phone' => $application->applicant_phone,
                    'address' => $application->applicant_address,
                    'nid' => $application->applicant_nid,
                    'passport' => $application->applicant_passport,
                    'avatar_url' => $application->photo_path
                        ? Storage::disk('public')->url($application->photo_path)
                        : null,
                ]);
            }
        });

        $application = $application->fresh()->load([
            'vacancy.department',
            'vacancy.position',
            'user:id,uid,name,email',
            'statusHistory.changedBy:id,email',
        ]);

        if (
            $newStatus === 'SELECTED'
            && filled($application->applicant_email)
        ) {
            Mail::to($application->applicant_email)->send(
                new ApplicationApprovedMail($application)
            );
        }

        return response()->json([
            'success' => true,
            'message' => $newStatus === 'SELECTED'
                ? 'Application approved and Foundation Member profile created successfully.'
                : 'Application status updated successfully.',
            'data' => $application,
        ]);
    }
}
