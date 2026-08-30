<?php

namespace App\Services;

use App\Models\Donation;
use App\Models\DonationVerificationHistory;
use App\Models\AuditLog;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;

class DonationService
{
    public function submitDonation(
        array $data,
        $evidenceFile = null,
        ?string $ipAddress = null,
        ?string $userAgent = null
    ): Donation {
        return DB::transaction(function () use (
            $data,
            $evidenceFile,
            $ipAddress,
            $userAgent
        ) {
            /*
             * Current donations table:
             *
             * donation_method_id
             * donor_name
             * amount
             * currency_code
             * transaction_id
             * sender_info
             * screenshot_path
             * status
             */

            $screenshotPath = null;

            if ($evidenceFile) {
                $screenshotPath = $evidenceFile->store(
                    'private/donations',
                    'local'
                );
            }

            /*
             * screenshot_path is NOT NULL in the database.
             * Use an empty placeholder when no evidence file is supplied.
             */
            if (!$screenshotPath) {
                $screenshotPath = 'none';
            }

            $donation = Donation::create([
                'donation_method_id' => $data['donation_method_id'],
                'donor_name' => $data['donor_name'] ?? null,
                'amount' => $data['amount'],
                'currency_code' => $data['currency'] ?? 'BDT',
                'transaction_id' => $data['transaction_id'],
                'sender_info' => $data['sender_phone'] ?? null,
                'screenshot_path' => $screenshotPath,
                'status' => Donation::STATUS_PENDING,
            ]);

            AuditLog::create([
                'actor_id' => null,
                'action' => 'DONATION_SUBMITTED',
                'module' => 'donations',
                'entity_type' => Donation::class,
                'entity_id' => $donation->id,
                'new_values' => $donation->toArray(),
                'ip_address' => $ipAddress,
                'user_agent' => $userAgent,
            ]);

            return $donation;
        });
    }

    public function transitionStatus(
        Donation $donation,
        string $newStatus,
        string $userId,
        ?string $notes = null,
        ?string $ipAddress = null,
        ?string $userAgent = null
    ): Donation {
        $currentStatus = $donation->status;

        $allowedTransitions = [
            Donation::STATUS_PENDING => [
                Donation::STATUS_UNDER_REVIEW,
                Donation::STATUS_REJECTED,
            ],

            Donation::STATUS_UNDER_REVIEW => [
                Donation::STATUS_VERIFIED,
                Donation::STATUS_REJECTED,
            ],

            Donation::STATUS_VERIFIED => [
                Donation::STATUS_REVERSED,
            ],

            Donation::STATUS_REJECTED => [],

            Donation::STATUS_REVERSED => [],
        ];

        if (!in_array(
            $newStatus,
            $allowedTransitions[$currentStatus] ?? [],
            true
        )) {
            throw ValidationException::withMessages([
                'status' => [
                    "Invalid status transition from {$currentStatus} to {$newStatus}."
                ],
            ]);
        }

        return DB::transaction(function () use (
            $donation,
            $currentStatus,
            $newStatus,
            $userId,
            $notes,
            $ipAddress,
            $userAgent
        ) {
            $oldValues = $donation->toArray();

            $updateData = [
                'status' => $newStatus,
            ];

            if (in_array(
                $newStatus,
                [
                    Donation::STATUS_VERIFIED,
                    Donation::STATUS_REJECTED,
                ],
                true
            )) {
                $updateData['verified_by'] = $userId;
                $updateData['verification_notes'] = $notes;
            }

            $donation->update($updateData);

            DonationVerificationHistory::create([
                'donation_id' => $donation->id,
                'reviewer_id' => $userId,
                'previous_status' => $currentStatus,
                'new_status' => $newStatus,
                'notes' => $notes,
                'created_at' => now(),
            ]);

            AuditLog::create([
                'actor_id' => $userId,
                'action' => 'DONATION_STATUS_CHANGED_' . $newStatus,
                'module' => 'donations',
                'entity_type' => Donation::class,
                'entity_id' => $donation->id,
                'old_values' => $oldValues,
                'new_values' => $donation->toArray(),
                'ip_address' => $ipAddress,
                'user_agent' => $userAgent,
            ]);

            return $donation->fresh();
        });
    }
}
