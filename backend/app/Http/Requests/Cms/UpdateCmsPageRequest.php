<?php

namespace App\Http\Requests\Cms;

use Illuminate\Foundation\Http\FormRequest;

class UpdateCmsPageRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        $pageId = $this->route('id');
        return [
            'slug' => ['sometimes', 'required', 'string', 'max:255', "unique:cms_pages,slug,{$pageId}"],
            'title_bn' => ['sometimes', 'required', 'string', 'max:255'],
            'title_en' => ['sometimes', 'required', 'string', 'max:255'],
            'content_bn' => ['nullable', 'string'],
            'content_en' => ['nullable', 'string'],
            'status' => ['sometimes', 'required', 'string', 'in:DRAFT,PUBLISHED,ARCHIVED'],
            'seo_title_bn' => ['nullable', 'string', 'max:255'],
            'seo_title_en' => ['nullable', 'string', 'max:255'],
            'seo_description_bn' => ['nullable', 'string'],
            'seo_description_en' => ['nullable', 'string'],
            'metadata' => ['nullable', 'array'],
        ];
    }
}
