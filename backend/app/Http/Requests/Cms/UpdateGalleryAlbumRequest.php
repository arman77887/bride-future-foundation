<?php

namespace App\Http\Requests\Cms;

use Illuminate\Foundation\Http\FormRequest;

class UpdateGalleryAlbumRequest extends FormRequest
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
            'slug' => ['required', 'string', 'max:255', 'unique:gallery_albums,slug,' . $this->route('id')],
            'description_bn' => ['nullable', 'string'],
            'description_en' => ['nullable', 'string'],
        ];
    }
}
