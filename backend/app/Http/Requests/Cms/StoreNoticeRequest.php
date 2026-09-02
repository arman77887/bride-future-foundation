<?php

namespace App\Http\Requests\Cms;

use Illuminate\Foundation\Http\FormRequest;

class StoreNoticeRequest extends FormRequest
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
            'content_bn' => ['required', 'string'],
            'content_en' => ['required', 'string'],
            'expires_at' => ['nullable', 'date'],
            'status' => ['required', 'string', 'in:DRAFT,PUBLISHED,ARCHIVED'],
            'cover_media_id' => ['nullable', 'uuid', 'exists:media,id'],
        ];
    }
}
