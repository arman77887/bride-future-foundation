<?php

namespace App\Http\Requests\Cms;

use Illuminate\Foundation\Http\FormRequest;

class StoreProjectRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'title_bn' => ['required', 'string', 'max:255'],
            'title_en' => ['required', 'string', 'max:255'],
            'slug' => ['required', 'string', 'max:255', 'unique:projects,slug'],
            'description_bn' => ['required', 'string'],
            'description_en' => ['required', 'string'],
            'status' => ['required', 'string', 'in:ACTIVE,COMPLETED,ARCHIVED'],
        ];
    }
}
