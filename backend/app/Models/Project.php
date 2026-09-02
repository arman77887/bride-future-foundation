<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Project extends Model
{
    use HasFactory, HasUuids;

    protected $fillable = [
        'title_bn',
        'title_en',
        'slug',
        'description_bn',
        'description_en',
        'status',
        'cover_media_id',
    ];
    public function coverMedia()
    {
        return $this->belongsTo(Media::class, 'cover_media_id');
    }

}
