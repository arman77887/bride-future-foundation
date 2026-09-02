<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class GalleryItem extends Model
{
    use HasFactory, HasUuids;

    public $timestamps = false;

    protected $fillable = [
        'gallery_album_id',
        'media_id',
        'title_bn',
        'title_en',
        'file_url',
        'display_order',
    ];

    protected $casts = [
        'display_order' => 'integer',
        'created_at' => 'datetime',
    ];

    public function album()
    {
        return $this->belongsTo(GalleryAlbum::class, 'gallery_album_id');
    }

    public function media()
    {
        return $this->belongsTo(Media::class, 'media_id');
    }
}
