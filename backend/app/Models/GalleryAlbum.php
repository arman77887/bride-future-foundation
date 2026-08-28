<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class GalleryAlbum extends Model
{
    use HasFactory, HasUuids;

    protected $fillable = [
        'title_bn',
        'title_en',
        'slug',
        'description_bn',
        'description_en',
    ];

    public function items()
    {
        return $this->hasMany(GalleryItem::class)->orderBy('display_order');
    }
}
