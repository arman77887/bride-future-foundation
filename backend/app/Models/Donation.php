<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Donation extends Model
{
    use HasFactory, HasUuids;

    protected $table = 'donations';

    protected $fillable = [
        'donation_method_id',
        'donor_name',
        'amount',
        'currency_code',
        'transaction_id',
        'sender_info',
        'screenshot_path',
        'status',
        'verified_by',
        'verification_notes',
    ];

    protected $casts = [
        'amount' => 'decimal:2',
    ];

    public const STATUS_PENDING = 'PENDING';
    public const STATUS_UNDER_REVIEW = 'UNDER_REVIEW';
    public const STATUS_VERIFIED = 'VERIFIED';
    public const STATUS_REJECTED = 'REJECTED';
    public const STATUS_REVERSED = 'REVERSED';

    public function donationMethod()
    {
        return $this->belongsTo(
            DonationMethod::class,
            'donation_method_id'
        );
    }

    public function verifier()
    {
        return $this->belongsTo(
            User::class,
            'verified_by'
        );
    }

    public function verificationHistories()
    {
        return $this->hasMany(
            DonationVerificationHistory::class,
            'donation_id'
        )->latest('created_at');
    }
}
