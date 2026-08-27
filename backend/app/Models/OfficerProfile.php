<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class OfficerProfile extends Model
{
    use HasFactory, HasUuids;

    protected $fillable = [
        'user_id',
        'department_id',
        'position_id',
        'official_id',
        'status',
        'is_public',
        'name',
        'bio_bn',
        'bio_en',
        'avatar_url',
        'email_personal',
        'phone',
        'address',
        'dob',
        'nid',
        'passport',
        'emergency_contact',
    ];

    protected $casts = [
        'is_public' => 'boolean',
        'dob' => 'date',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function department()
    {
        return $this->belongsTo(Department::class);
    }

    public function position()
    {
        return $this->belongsTo(Position::class);
    }

    public function documents()
    {
        return $this->hasMany(OfficerDocument::class);
    }

    public function verificationHistory()
    {
        return $this->hasMany(OfficerVerificationHistory::class);
    }
}
