<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Vacancy extends Model
{
    use HasFactory, HasUuids;

    protected $fillable = [
        'department_id',
        'position_id',
        'required_count',
        'title_bn',
        'title_en',
        'description_bn',
        'description_en',
        'requirements',
        'deadline',
        'status',
        'created_by',
    ];

    protected $casts = [
        'required_count' => 'integer',
        'deadline' => 'datetime',
    ];

    public function department()
    {
        return $this->belongsTo(Department::class);
    }

    public function position()
    {
        return $this->belongsTo(Position::class);
    }

    public function applications()
    {
        return $this->hasMany(JobApplication::class);
    }

    public function creator()
    {
        return $this->belongsTo(User::class, 'created_by');
    }
}
