<?php

namespace Database\Factories;

use App\Models\Donation;
use Illuminate\Database\Eloquent\Factories\Factory;

class DonationFactory extends Factory
{
    protected $model = Donation::class;

    public function definition(): array
    {
        return [
            'donor_name' => $this->faker->name(),
            'donor_email' => $this->faker->safeEmail(),
            'donor_phone' => $this->faker->phoneNumber(),
            'amount' => $this->faker->randomFloat(2, 100, 50000),
            'currency' => 'BDT',
            'payment_method' => 'bkash',
            'transaction_id' => strtoupper($this->faker->unique()->bothify('TRX#########')),
            'status' => Donation::STATUS_PENDING,
            'evidence_path' => null,
            'admin_notes' => null,
            'metadata' => null,
        ];
    }
}
