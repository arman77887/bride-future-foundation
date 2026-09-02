<?php

namespace App\Http\Requests\Cms;

use Illuminate\Foundation\Http\FormRequest;

class UpdateNoticeRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'title_bn' => ['sometimes', 'required', 'string', 'max:255'],
            'title_en' => ['sometimes', 'required', 'string', 'max:255'],
            'content_bn' => ['sometimes', 'required', 'string'],
            'content_en' => ['sometimes', 'required', 'string'],
            'expires_at' => ['sometimes', 'nullable', 'date'],
            'status' => ['sometimes', 'required', 'string', 'in:DRAFT,PUBLISHED,ARCHIVED'],
            'cover_media_id' => ['sometimes', 'nullable', 'uuid', 'exists:media,id'],
        ];
    }
}
