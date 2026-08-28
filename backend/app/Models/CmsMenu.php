<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class CmsMenu extends Model
{
    use HasFactory, HasUuids;

    protected $fillable = [
        'name',
        'slug',
    ];

    public function items()
    {
        return $this->hasMany(CmsMenuItem::class)->whereNull('parent_id')->orderBy('display_order');
    }

    public function allItems()
    {
        return $this->hasMany(CmsMenuItem::class);
    }
}
