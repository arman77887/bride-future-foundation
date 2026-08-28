<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class CmsMenuItem extends Model
{
    use HasFactory, HasUuids;

    protected $fillable = [
        'cms_menu_id',
        'parent_id',
        'label_bn',
        'label_en',
        'url',
        'route',
        'display_order',
        'target',
    ];

    protected $casts = [
        'display_order' => 'integer',
    ];

    public function menu()
    {
        return $this->belongsTo(CmsMenu::class, 'cms_menu_id');
    }

    public function parent()
    {
        return $this->belongsTo(CmsMenuItem::class, 'parent_id');
    }

    public function children()
    {
        return $this->hasMany(CmsMenuItem::class, 'parent_id')->orderBy('display_order');
    }
}
