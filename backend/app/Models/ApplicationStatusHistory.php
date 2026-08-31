<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ApplicationStatusHistory extends Model
{
    use HasFactory, HasUuids;

    public $timestamps = false;

    protected $table = 'application_status_history';

    protected $fillable = [
        'application_id',
        'changed_by',
        'previous_status',
        'new_status',
        'note',
        'created_at',
    ];

    protected $casts = [
        'created_at' => 'datetime',
    ];

    public function application()
    {
        return $this->belongsTo(JobApplication::class, 'application_id');
    }

    public function changedBy()
    {
        return $this->belongsTo(User::class, 'changed_by');
    }
}
