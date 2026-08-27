<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Department extends Model
{
    use HasFactory, HasUuids, SoftDeletes;

    protected $fillable = [
        'name_bn',
        'name_en',
        'slug',
        'description_bn',
        'description_en',
        'display_order',
        'is_active',
    ];

    protected $casts = [
        'is_active' => 'boolean',
        'display_order' => 'integer',
    ];

    public function officerProfiles()
    {
        return $this->hasMany(OfficerProfile::class);
    }

    public function vacancies()
    {
        return $this->hasMany(Vacancy::class);
    }
}
