<?php

namespace Tests\Feature;

use Tests\TestCase;
use App\Models\User;
use App\Models\Role;
use App\Models\Donation;
use App\Models\DonationMethod;

class DonationSystemTest extends TestCase
{
    public function test_donation_submission_and_workflow_transitions(): void
    {
        $admin = User::create([
            'email' => 'admin_donation@bff.org.bd',
            'password' => bcrypt('secret'),
            'status' => 'active',
        ]);
        $role = Role::firstOrCreate(['slug' => 'admin'], ['name' => 'Admin']);
        $admin->roles()->attach($role);

        // 1. Submit Donation
        $response = $this->postJson('/api/v1/donations', [
            'donor_name' => 'Jane Doe',
            'amount' => 5000.00,
            'currency' => 'BDT',
            'payment_gateway' => 'bkash',
            'transaction_id' => 'TXN-ABC-12345',
        ]);

        $response->assertStatus(201)
                 ->assertJsonPath('data.status', 'PENDING');

        $donationId = $response->json('data.id');

        // 2. Transition to UNDER_REVIEW
        $this->actingAs($admin, 'sanctum');

        $transitionResponse = $this->postJson("/api/v1/admin/donations/{$donationId}/transition", [
            'status' => 'UNDER_REVIEW',
            'notes' => 'Reviewing transaction ID',
        ]);

        $transitionResponse->assertStatus(200)
                           ->assertJsonPath('data.status', 'UNDER_REVIEW');

        // 3. Transition to VERIFIED
        $verifiedResponse = $this->postJson("/api/v1/admin/donations/{$donationId}/transition", [
            'status' => 'VERIFIED',
            'notes' => 'Funds confirmed in bank account',
        ]);

        $verifiedResponse->assertStatus(200)
                         ->assertJsonPath('data.status', 'VERIFIED');

        // 4. Test duplicate transaction ID prevention
        $duplicateResponse = $this->postJson('/api/v1/donations', [
            'amount' => 1000.00,
            'currency' => 'BDT',
            'payment_gateway' => 'bkash',
            'transaction_id' => 'TXN-ABC-12345',
        ]);

        $duplicateResponse->assertStatus(422);
    }
}
