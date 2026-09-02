<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Media extends Model
{
    use HasFactory, HasUuids;

    public $timestamps = false;

    protected $fillable = [
        'filename',
        'storage_key',
        'mime_type',
        'file_size',
        'uploader_id',
    ];

    protected $casts = [
        'file_size' => 'integer',
    ];

    public function uploader()
    {
        return $this->belongsTo(User::class, 'uploader_id');
    }
}
