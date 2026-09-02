<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class EmailNotificationLog extends Model
{
    use HasUuids;

    protected $fillable = [
        'email_subscriber_id',
        'update_type',
        'update_id',
        'sent_at',
    ];

    protected $casts = [
        'sent_at' => 'datetime',
    ];

    public function subscriber(): BelongsTo
    {
        return $this->belongsTo(EmailSubscriber::class, 'email_subscriber_id');
    }
}
