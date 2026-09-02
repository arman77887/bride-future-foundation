<?php

namespace App\Http\Requests\Cms;

use Illuminate\Foundation\Http\FormRequest;

class UpdateProjectRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        $projectId = $this->route('id');

        return [
            'title_bn' => ['sometimes', 'required', 'string', 'max:255'],
            'title_en' => ['sometimes', 'required', 'string', 'max:255'],
            'slug' => ['sometimes', 'required', 'string', 'max:255', "unique:projects,slug,{$projectId}"],
            'description_bn' => ['sometimes', 'required', 'string'],
            'description_en' => ['sometimes', 'required', 'string'],
            'status' => ['sometimes', 'required', 'string', 'in:ACTIVE,COMPLETED,ARCHIVED'],
            'cover_media_id' => ['sometimes', 'nullable', 'uuid', 'exists:media,id'],
        ];
    }
}
