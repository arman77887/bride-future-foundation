<?php

namespace App\Http\Requests\Officer;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateOfficerRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        $officerId = $this->route('id');

        return [
            'department_id' => ['sometimes', 'required', 'uuid', 'exists:departments,id'],
            'position_id' => ['sometimes', 'required', 'uuid', 'exists:positions,id'],
            'official_id' => [
                'sometimes',
                'required',
                'string',
                'max:50',
                Rule::unique('officer_profiles', 'official_id')->ignore($officerId),
            ],
            'name' => ['sometimes', 'required', 'string', 'max:255'],
            'avatar_media_id' => ['nullable', 'uuid', 'exists:media,id'],
            'bio_bn' => ['nullable', 'string'],
            'bio_en' => ['nullable', 'string'],
        ];
    }
}
