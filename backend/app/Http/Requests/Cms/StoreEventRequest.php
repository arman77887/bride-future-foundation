<?php

namespace App\Http\Requests\Cms;

use Illuminate\Foundation\Http\FormRequest;

class StoreEventRequest extends FormRequest
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
            'slug' => ['required', 'string', 'max:255', 'unique:events,slug'],
            'description_bn' => ['required', 'string'],
            'description_en' => ['required', 'string'],
            'location_bn' => ['nullable', 'string', 'max:255'],
            'location_en' => ['nullable', 'string', 'max:255'],
            'start_time' => ['required', 'date'],
            'end_time' => ['required', 'date', 'after_or_equal:start_time'],
            'status' => ['required', 'string', 'in:DRAFT,PUBLISHED,ARCHIVED'],
            'registration_link' => ['nullable', 'url', 'max:255'],
        ];
    }
}
