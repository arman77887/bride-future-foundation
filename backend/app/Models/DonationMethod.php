<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class DonationMethod extends Model
{
    use HasFactory, HasUuids;

    protected $fillable = [
        'name_bn',
        'name_en',
        'type',
        'account_identifier',
        'instructions_bn',
        'instructions_en',
        'is_active',
        'display_order',
    ];

    protected $casts = [
        'is_active' => 'boolean',
        'display_order' => 'integer',
    ];

    public function setIsActiveAttribute($value): void
    {
        $this->attributes['is_active'] = filter_var(
            $value,
            FILTER_VALIDATE_BOOLEAN
        ) ? 'true' : 'false';
    }
}
