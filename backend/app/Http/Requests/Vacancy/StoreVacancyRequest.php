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
            'department_id' => [
                'required',
                'uuid',
                'exists:departments,id',
            ],

            'position_id' => [
                'required',
                'uuid',
                'exists:positions,id',
            ],

            'required_count' => [
                'sometimes',
                'integer',
                'min:1',
            ],

            'title_bn' => [
                'required',
                'string',
                'max:255',
            ],

            'title_en' => [
                'required',
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
                'required',
                'date',
            ],

            'status' => [
                'sometimes',
                'string',
                'in:DRAFT,PUBLISHED,CLOSED',
            ],
        ];
    }
}
