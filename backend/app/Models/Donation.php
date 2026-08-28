<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Donation extends Model
{
    use HasFactory, HasUuids, SoftDeletes;

    protected $table = 'donations';

    protected $fillable = [
        'donor_name',
        'donor_email',
        'donor_phone',
        'amount',
        'currency',
        'payment_method',
        'transaction_id',
        'status',
        'evidence_path',
        'admin_notes',
        'metadata',
    ];

    protected $casts = [
        'amount' => 'decimal:2',
        'metadata' => 'array',
    ];

    public const STATUS_PENDING = 'PENDING';
    public const STATUS_UNDER_REVIEW = 'UNDER_REVIEW';
    public const STATUS_VERIFIED = 'VERIFIED';
    public const STATUS_REJECTED = 'REJECTED';
    public const STATUS_REVERSED = 'REVERSED';
}
