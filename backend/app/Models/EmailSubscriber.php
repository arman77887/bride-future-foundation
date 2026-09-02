<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Concerns\HasUuids;

class EmailSubscriber extends Model
{
    use HasUuids;

    protected $fillable = [
        'email',
        'unsubscribe_token',
        'is_active',
        'subscribed_at',
        'unsubscribed_at',
    ];

    protected $casts = [
        'is_active' => 'boolean',
        'subscribed_at' => 'datetime',
        'unsubscribed_at' => 'datetime',
    ];

    public function scopeActive(Builder $query): Builder
    {
        return $query->whereRaw('is_active = TRUE');
    }
}
