<?php

namespace App\Http\Requests\Vacancy;

use Illuminate\Foundation\Http\FormRequest;

class StoreVacancyRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'department_id' => ['required', 'uuid', 'exists:departments,id'],
            'title' => ['required', 'string', 'max:255'],
            'slug' => ['required', 'string', 'max:255', 'unique:vacancies,slug'],
            'description' => ['required', 'string'],
            'requirements' => ['required', 'string'],
            'employment_type' => ['required', 'string'],
            'deadline' => ['required', 'date'],
        ];
    }
}
