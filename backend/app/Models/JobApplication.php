<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class JobApplication extends Model
{
    use HasFactory, HasUuids;

    protected $fillable = [
        'vacancy_id',
        'application_reference',
        'applicant_name',
        'applicant_email',
        'applicant_phone',
        'resume_path',
        'cover_letter',
        'status',
    ];

    public function vacancy()
    {
        return $this->belongsTo(Vacancy::class);
    }

    public function statusHistory()
    {
        return $this->hasMany(
            ApplicationStatusHistory::class,
            'application_id'
        )->latest('created_at');
    }
}
