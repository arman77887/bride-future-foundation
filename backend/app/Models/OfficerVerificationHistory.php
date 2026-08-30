<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class OfficerVerificationHistory extends Model
{
    use HasFactory, HasUuids;

    protected $table = 'officer_verification_history';

    public $timestamps = false;

    protected $fillable = [
        'officer_profile_id',
        'reviewer_id',
        'previous_status',
        'new_status',
        'review_note',
    ];

    public function officerProfile()
    {
        return $this->belongsTo(OfficerProfile::class);
    }

    public function verifier()
    {
        return $this->belongsTo(User::class, 'reviewer_id');
    }
}
