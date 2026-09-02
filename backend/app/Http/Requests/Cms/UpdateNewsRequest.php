<?php

namespace App\Http\Requests\Cms;

use Illuminate\Foundation\Http\FormRequest;

class UpdateNewsRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        $newsId = $this->route('id');
        return [
            'title_bn' => ['sometimes', 'required', 'string', 'max:255'],
            'title_en' => ['sometimes', 'required', 'string', 'max:255'],
            'slug' => ['sometimes', 'required', 'string', 'max:255', "unique:news,slug,{$newsId}"],
            'content_bn' => ['sometimes', 'required', 'string'],
            'content_en' => ['sometimes', 'required', 'string'],
            'status' => ['sometimes', 'required', 'string', 'in:DRAFT,PUBLISHED,ARCHIVED'],
            'cover_media_id' => ['sometimes', 'nullable', 'uuid', 'exists:media,id'],
        ];
    }
}
