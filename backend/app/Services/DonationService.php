<?php

namespace App\Services;

array;
use App\Models\Donation;
use App\Models\DonationVerificationHistory;
use App\Models\AuditLog;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use Illuminate\Validation\ValidationException;

class DonationService
{
    public function submitDonation(array $data, $evidenceFile = null, string $ipAddress = null, string $userAgent = null): Donation
    {
        return DB::transaction(function () use ($data, $evidenceFile, $ipAddress, $userAgent) {
            $evidencePath = null;
            if ($evidenceFile) {
                $evidencePath = $evidenceFile->store('private/donations', 'local');
            }

            $donation = Donation::create([
                'donor_name' => $data['donor_name'] ?? null,
                'donor_email' => $data['donor_email'] ?? null,
                'donor_phone' => $data['donor_phone'] ?? null,
                'amount' => $data['amount'],
                'currency' => $data['currency'] ?? 'BDT',
                'payment_gateway' => $data['payment_gateway'],
                'transaction_id' => $data['transaction_id'],
                'status' => 'PENDING',
                'gateway_response' => [
                    'sender_phone' => $data['sender_phone'] ?? null,
                    'evidence_path' => $evidencePath,
                ],
            ]);

            AuditLog::create([
                'user_id' => null,
                'action' => 'DONATION_SUBMITTED',
                'auditable_type' => Donation::class,
                'auditable_id' => $donation->id,
                'new_values' => $donation->toArray(),
                'ip_address' => $ipAddress,
                'user_agent' => $userAgent,
            ]);

            return $donation;
        });
    }

    public function transitionStatus(Donation $donation, string $newStatus, int $userId, ?string $notes = null, string $ipAddress = null, string $userAgent = null): Donation
    {
        $currentStatus = $donation->status;

        $allowedTransitions = [
            'PENDING' => ['UNDER_REVIEW', 'REJECTED'],
            'UNDER_REVIEW' => ['VERIFIED', 'REJECTED'],
            'VERIFIED' => ['REVERSED'],
            'REJECTED' => [],
            'REVERSED' => [],
        ];

        if (!in_array($newStatus, $allowedTransitions[$currentStatus] ?? [])) {
            throw ValidationException::withMessages([
                'status' => ["Invalid status transition from {$currentStatus} to {$newStatus}."]
            ]);
        }

        return DB::transaction(function () use ($donation, $currentStatus, $newStatus, $userId, $notes, $ipAddress, $userAgent) {
            $oldValues = $donation->toArray();

            $donation->update([
                'status' => $newStatus,
                'verified_by' => in_array($newStatus, ['VERIFIED', 'REJECTED']) ? $userId : $donation->verified_by,
            ]);

            DonationVerificationHistory::create([
                'donation_id' => $donation->id,
                'reviewer_id' => $userId,
                'previous_status' => $currentStatus,
                'new_status' => $newStatus,
                'notes' => $notes,
                'created_at' => now(),
            ]);

            AuditLog::create([
                'user_id' => $userId,
                'action' => 'DONATION_STATUS_CHANGED_' . $newStatus,
                'auditable_type' => Donation::class,
                'auditable_id' => $donation->id,
                'old_values' => $oldValues,
                'new_values' => $donation->toArray(),
                'ip_address' => $ipAddress,
                'user_agent' => $userAgent,
            ]);

            return $donation;
        });
    }
}
