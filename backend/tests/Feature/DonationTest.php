<?php

namespace Tests\Feature;

use App\Models\Donation;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Laravel\Sanctum\Sanctum;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;
use Tests\TestCase;

class DonationTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        Storage::fake('private');
        
        Permission::firstOrCreate(['name' => 'donations.view', 'guard_name' => 'web']);
        Permission::firstOrCreate(['name' => 'donations.manage', 'guard_name' => 'web']);
    }

    public function test_can_submit_donation(): void
    {
        $response = $this->postJson('/api/v1/donations', [
            'donor_name' => 'John Doe',
            'donor_email' => 'john@example.com',
            'donor_phone' => '+8801700000000',
            'amount' => 5000.00,
            'currency' => 'BDT',
            'payment_method' => 'bkash',
            'transaction_id' => 'TRX123456789',
            'evidence' => UploadedFile::fake()->image('receipt.jpg'),
        ]);

        $response->assertStatus(201)
            ->assertJsonPath('data.donor_name', 'John Doe')
            ->assertJsonPath('data.status', 'PENDING');

        $this->assertDatabaseHas('donations', [
            'transaction_id' => 'TRX123456789',
            'status' => 'PENDING',
        ]);
    }

    public function test_authorized_user_can_update_donation_status(): void
    {
        $admin = User::factory()->create();
        $role = Role::firstOrCreate(['name' => 'admin', 'guard_name' => 'web']);
        $admin->assignRole($role);

        Sanctum::actingAs($admin);

        $donation = Donation::factory()->create([
            'status' => Donation::STATUS_PENDING,
        ]);

        $response = $this->patchJson("/api/v1/donations/{$donation->id}/status", [
            'status' => Donation::STATUS_VERIFIED,
            'notes' => 'Verified via bank statement.',
        ]);

        $response->assertStatus(200)
            ->assertJsonPath('data.status', 'VERIFIED');

        $this->assertDatabaseHas('donations', [
            'id' => $donation->id,
            'status' => 'VERIFIED',
            'admin_notes' => 'Verified via bank statement.',
        ]);
    }
}
