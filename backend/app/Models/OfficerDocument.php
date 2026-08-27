<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class OfficerDocument extends Model
{
    use HasFactory, HasUuids;

    protected $fillable = [
        'officer_profile_id',
        'document_type',
        'file_path',
        'original_name',
        'status',
    ];

    public function officerProfile()
    {
        return $this->belongsTo(OfficerProfile::class);
    }
}
