<?php

namespace Tests\Feature;

use Tests\TestCase;
use App\Models\User;
use App\Models\Department;
use App\Models\Position;
use App\Models\OfficerProfile;

class ApiEndpointsTest extends TestCase
{
    public function test_auth_and_public_endpoints(): void
    {
        $response = $this->postJson('/api/v1/auth/register', [
            'email' => 'testapi@bff.org.bd',
            'password' => 'password123',
        ]);

        $response->assertStatus(201)
                 ->assertJsonStructure(['message', 'data' => ['id', 'email']]);

        $loginResponse = $this->postJson('/api/v1/auth/login', [
            'email' => 'testapi@bff.org.bd',
            'password' => 'password123',
        ]);

        $loginResponse->assertStatus(200)
                      ->assertJsonStructure(['access_token']);

        $donationResponse = $this->postJson('/api/v1/donations', [
            'amount' => 1000.00,
            'currency' => 'BDT',
            'payment_gateway' => 'sslcommerz',
            'transaction_id' => 'SSL-TRX-999',
        ]);

        $donationResponse->assertStatus(201);
    }
}
