<?php

namespace App\Http\Requests\Cms;

use Illuminate\Foundation\Http\FormRequest;

class UpdatePublicDocumentRequest extends FormRequest
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
            'file_url' => ['sometimes', 'required', 'url', 'max:2048'],
            'file_size' => ['nullable', 'integer', 'min:0'],
        ];
    }
}
