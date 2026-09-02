<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Notice extends Model
{
    use HasFactory, HasUuids;

    protected $fillable = [
        'title_bn',
        'title_en',
        'content_bn',
        'content_en',
        'expires_at',
        'status',
        'cover_media_id',
    ];

    protected $casts = [
        'expires_at' => 'datetime',
    ];
    public function coverMedia()
    {
        return $this->belongsTo(Media::class, 'cover_media_id');
    }

}
