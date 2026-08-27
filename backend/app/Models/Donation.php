<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Donation extends Model
{
    use HasFactory, HasUuids;

    protected $fillable = [
        'donor_name',
        'donor_email',
        'donor_phone',
        'amount',
        'currency',
        'payment_gateway',
        'transaction_id',
        'status',
        'gateway_response',
    ];

    protected $casts = [
        'amount' => 'decimal:2',
        'gateway_response' => 'array',
    ];
}
