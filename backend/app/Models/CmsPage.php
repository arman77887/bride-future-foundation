<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class CmsPage extends Model
{
    use HasFactory, HasUuids;

    protected $fillable = [
        'slug',
        'title_bn',
        'title_en',
        'content_bn',
        'content_en',
        'status',
        'seo_title_bn',
        'seo_title_en',
        'seo_description_bn',
        'seo_description_en',
        'metadata',
        'published_at',
        'created_by',
        'updated_by',
    ];

    protected $casts = [
        'metadata' => 'array',
        'published_at' => 'datetime',
    ];

    public function sections()
    {
        return $this->hasMany(CmsPageSection::class);
    }

    public function creator()
    {
        return $this->belongsTo(User::class, 'created_by');
    }

    public function updater()
    {
        return $this->belongsTo(User::class, 'updated_by');
    }
}
