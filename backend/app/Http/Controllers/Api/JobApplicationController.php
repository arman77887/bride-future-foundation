<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\JobApplication\StoreJobApplicationRequest;
use App\Mail\AdminNotificationMail;
use App\Models\ApplicationStatusHistory;
use App\Models\JobApplication;
use App\Models\User;
use App\Models\Vacancy;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Throwable;

class JobApplicationController extends Controller
{
    public function store(StoreJobApplicationRequest $request): JsonResponse
    {
        $data = $request->validated();

        $user = User::query()
            ->where('uid', $data['applicant_uid'])
            ->firstOrFail();

        $photoPath = $request->file('photo')->store(
            'job-applications/photos',
            'public'
        );

        unset($data['photo']);

        $data['user_id'] = $user->id;
        $data['photo_path'] = $photoPath;

        try {
            $application = DB::transaction(function () use ($data) {
                $vacancy = Vacancy::query()
                    ->whereKey($data['vacancy_id'])
                    ->lockForUpdate()
                    ->first();

                if (!$vacancy) {
                    abort(404, 'Vacancy not found.');
                }

                if (!$vacancy->is_active) {
                    abort(422, 'This vacancy is currently inactive.');
                }

                if ($vacancy->status !== 'PUBLISHED') {
                    abort(422, 'Applications are not currently open for this vacancy.');
                }

                if (!$vacancy->deadline || $vacancy->deadline->isPast()) {
                    abort(422, 'The application deadline has passed.');
                }

                $alreadyApplied = JobApplication::query()
                    ->where('vacancy_id', $vacancy->id)
                    ->where('user_id', $data['user_id'])
                    ->where('status', '!=', 'WITHDRAWN')
                    ->exists();

                if ($alreadyApplied) {
                    abort(422, 'You have already applied for this vacancy.');
                }

                if ($vacancy->application_limit !== null) {
                    $applicationCount = JobApplication::query()
                        ->where('vacancy_id', $vacancy->id)
                        ->where('status', '!=', 'WITHDRAWN')
                        ->count();

                    if ($applicationCount >= $vacancy->application_limit) {
                        abort(422, 'The application limit for this vacancy has been reached.');
                    }
                }

                do {
                    $reference = 'BFF-' . now()->format('Y') . '-' . strtoupper(Str::random(8));
                } while (
                    JobApplication::where('application_reference', $reference)->exists()
                );

                $data['application_reference'] = $reference;
                $data['status'] = 'PENDING';

                $application = JobApplication::create($data);

                ApplicationStatusHistory::create([
                    'application_id' => $application->id,
                    'changed_by' => null,
                    'previous_status' => 'NEW',
                    'new_status' => 'PENDING',
                    'note' => 'Application submitted.',
                    'created_at' => now(),
                ]);

                return $application;
            });
        } catch (Throwable $e) {
            Storage::disk('public')->delete($photoPath);
            throw $e;
        }

        $application->load([
            'vacancy.department',
            'vacancy.position',
            'user:id,uid,name,email',
        ]);

        $recipients = config('mail.notification_recipients', [
            'tha.crypticx.official@gmail.com',
        ]);

        Mail::to($recipients)->send(
            new AdminNotificationMail(
                notificationType: 'JOB_APPLICATION',
                title: 'New Job Application Submitted',
                data: [
                    'application_reference' => $application->application_reference,
                    'applicant_uid' => $application->applicant_uid,
                    'applicant_name' => $application->applicant_name,
                    'applicant_email' => $application->applicant_email,
                    'applicant_phone' => $application->applicant_phone,
                    'vacancy' => $application->vacancy?->title_en
                        ?? $application->vacancy?->title_bn
                        ?? $application->vacancy_id,
                    'department' => $application->vacancy?->department?->name_en
                        ?? $application->vacancy?->department?->name_bn,
                    'position' => $application->vacancy?->position?->title_en
                        ?? $application->vacancy?->position?->title_bn,
                    'status' => $application->status,
                    'application_id' => $application->id,
                ],
            )
        );

        return response()->json([
            'success' => true,
            'message' => 'Job application submitted successfully',
            'data' => $application,
        ], 201);
    }
}
