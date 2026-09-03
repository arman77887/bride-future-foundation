<?php

namespace App\Http\Requests\Vacancy;

use Illuminate\Foundation\Http\FormRequest;

class UpdateVacancyRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'department_id' => [
                'sometimes',
                'uuid',
                'exists:departments,id',
            ],

            'position_id' => [
                'sometimes',
                'uuid',
                'exists:positions,id',
            ],

            'required_count' => [
                'sometimes',
                'integer',
                'min:1',
            ],

            'title_bn' => [
                'sometimes',
                'string',
                'max:255',
            ],

            'title_en' => [
                'sometimes',
                'string',
                'max:255',
            ],

            'description_bn' => [
                'nullable',
                'string',
            ],

            'description_en' => [
                'nullable',
                'string',
            ],

            'requirements' => [
                'nullable',
                'string',
            ],

            'deadline' => [
                'sometimes',
                'date',
            ],

            'status' => [
                'sometimes',
                'string',
                'in:DRAFT,PUBLISHED,CLOSED,CANCELLED',
            ],

            'is_active' => [
                'sometimes',
                'boolean',
            ],

            'application_limit' => [
                'nullable',
                'integer',
                'min:1',
            ],
        ];
    }
}
