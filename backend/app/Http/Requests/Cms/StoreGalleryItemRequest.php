<?php

namespace App\Http\Requests\Cms;

use Illuminate\Foundation\Http\FormRequest;

class StoreGalleryItemRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'gallery_album_id' => ['required', 'uuid', 'exists:gallery_albums,id'],
            'media_id' => ['nullable', 'uuid', 'exists:media,id'],
            'title_bn' => ['nullable', 'string', 'max:255'],
            'title_en' => ['nullable', 'string', 'max:255'],
            'file_url' => ['nullable', 'string', 'max:255', 'required_without:media_id'],
            'display_order' => ['nullable', 'integer', 'min:0'],
        ];
    }
}
