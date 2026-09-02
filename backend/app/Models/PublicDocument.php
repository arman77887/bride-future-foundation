<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class PublicDocument extends Model
{
    use HasFactory, HasUuids;

    protected $fillable = [
        'title_bn',
        'title_en',
        'file_url',
        'file_size',
    ];

    const UPDATED_AT = null;

    protected $casts = [
        'file_size' => 'integer',
    ];
}
