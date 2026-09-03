<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\JobApplication\StoreJobApplicationRequest;
use App\Models\ApplicationStatusHistory;
use App\Models\JobApplication;
use App\Models\Vacancy;
use App\Mail\AdminNotificationMail;
use Illuminate\Support\Facades\Mail;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class JobApplicationController extends Controller
{
    public function store(StoreJobApplicationRequest $request): JsonResponse
    {
        $data = $request->validated();

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

            if ($vacancy->deadline->isPast()) {
                abort(422, 'The application deadline has passed.');
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

        $application->load('vacancy');

        $recipients = config('mail.notification_recipients', [
            'tha.crypticx.official@gmail.com',
            'dyppomahadi2000@gmail.com',
        ]);

        Mail::to($recipients)->send(
            new AdminNotificationMail(
                notificationType: 'JOB_APPLICATION',
                title: 'New Job Application Submitted',
                data: [
                    'application_reference' => $application->application_reference,
                    'applicant_name' => $application->applicant_name,
                    'applicant_email' => $application->applicant_email,
                    'applicant_phone' => $application->applicant_phone,
                    'vacancy' => $application->vacancy?->title_en
                        ?? $application->vacancy?->title_bn
                        ?? $application->vacancy_id,
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
