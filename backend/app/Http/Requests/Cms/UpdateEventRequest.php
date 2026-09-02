<?php

namespace App\Http\Requests\Cms;

use Illuminate\Foundation\Http\FormRequest;

class UpdateEventRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        $eventId = $this->route('id');

        return [
            'title_bn' => ['sometimes', 'required', 'string', 'max:255'],
            'title_en' => ['sometimes', 'required', 'string', 'max:255'],
            'slug' => ['sometimes', 'required', 'string', 'max:255', "unique:events,slug,{$eventId}"],
            'description_bn' => ['sometimes', 'required', 'string'],
            'description_en' => ['sometimes', 'required', 'string'],
            'location_bn' => ['nullable', 'string', 'max:255'],
            'location_en' => ['nullable', 'string', 'max:255'],
            'start_time' => ['sometimes', 'required', 'date'],
            'end_time' => ['sometimes', 'required', 'date', 'after_or_equal:start_time'],
            'status' => ['sometimes', 'required', 'string', 'in:DRAFT,PUBLISHED,ARCHIVED'],
            'registration_link' => ['nullable', 'url', 'max:255'],
            'cover_media_id' => ['sometimes', 'nullable', 'uuid', 'exists:media,id'],
        ];
    }
}
