<?php

namespace App\Http\Requests\Officer;

use Illuminate\Foundation\Http\FormRequest;

class StoreOfficerRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'user_id' => ['required', 'uuid', 'exists:users,id'],
            'department_id' => ['required', 'uuid', 'exists:departments,id'],
            'position_id' => ['required', 'uuid', 'exists:positions,id'],
            'official_id' => ['required', 'string', 'max:50', 'unique:officer_profiles,official_id'],
            'name' => ['required', 'string', 'max:255'],
            'email_personal' => ['required', 'email', 'max:255'],
            'phone' => ['required', 'string', 'max:20'],
            'dob' => ['required', 'date'],
            'nid' => ['required', 'string', 'max:50'],
            'bio_bn' => ['nullable', 'string'],
            'bio_en' => ['nullable', 'string'],
            'avatar_url' => ['nullable', 'string', 'max:255'],
            'address' => ['nullable', 'string'],
            'passport' => ['nullable', 'string'],
            'emergency_contact' => ['nullable', 'string'],
        ];
    }
}
