<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class DonationVerificationHistory extends Model
{
    use HasFactory, HasUuids;

    public $timestamps = false; // Immutable append-only history

    protected $table = 'donation_verification_history';

    protected $fillable = [
        'donation_id',
        'reviewer_id',
        'previous_status',
        'new_status',
        'notes',
        'created_at',
    ];

    protected $casts = [
        'created_at' => 'datetime',
    ];

    public function donation()
    {
        return $this->belongsTo(Donation::class);
    }

    public function reviewer()
    {
        return $this->belongsTo(User::class, 'reviewer_id');
    }
}
