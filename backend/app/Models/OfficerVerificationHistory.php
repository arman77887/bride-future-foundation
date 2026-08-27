<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class OfficerVerificationHistory extends Model
{
    use HasFactory, HasUuids;

    protected $fillable = [
        'officer_profile_id',
        'verified_by',
        'action',
        'remarks',
    ];

    public function officerProfile()
    {
        return $this->belongsTo(OfficerProfile::class);
    }

    public function verifier()
    {
        return $this->belongsTo(User::class, 'verified_by');
    }
}
