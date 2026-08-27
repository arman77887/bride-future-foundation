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
            'department_id' => ['required', 'uuid', 'exists:departments,id'],
            'position_id' => ['required', 'uuid', 'exists:positions,id'],
            'official_id' => ['required', 'string', 'unique:officer_profiles,official_id'],
            'name' => ['required', 'string', 'max:255'],
            'email_personal' => ['required', 'email', 'max:255'],
            'phone' => ['required', 'string', 'max:20'],
            'dob' => ['required', 'date'],
            'nid' => ['required', 'string', 'max:50'],
        ];
    }
}
