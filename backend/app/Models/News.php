<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class News extends Model
{
    use HasFactory, HasUuids;

    protected $table = 'news';

    protected $fillable = [
        'title_bn',
        'title_en',
        'slug',
        'content_bn',
        'content_en',
        'status',
        'published_at',
        'created_by',
        'cover_media_id',
    ];

    protected $casts = [
        'published_at' => 'datetime',
    ];

    public function creator()
    {
        return $this->belongsTo(User::class, 'created_by');
    }
    public function coverMedia()
    {
        return $this->belongsTo(Media::class, 'cover_media_id');
    }

}
