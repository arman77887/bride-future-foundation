<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Event extends Model
{
    use HasFactory, HasUuids;

    protected $fillable = [
        'title_bn',
        'title_en',
        'slug',
        'description_bn',
        'description_en',
        'location_bn',
        'location_en',
        'start_time',
        'end_time',
        'status',
        'registration_link',
        'cover_media_id',
    ];

    protected $casts = [
        'start_time' => 'datetime',
        'end_time' => 'datetime',
    ];
    public function coverMedia()
    {
        return $this->belongsTo(Media::class, 'cover_media_id');
    }

}
