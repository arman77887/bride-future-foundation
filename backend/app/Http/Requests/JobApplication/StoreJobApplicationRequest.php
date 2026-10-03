<?php

namespace App\Http\Requests\JobApplication;

use Illuminate\Foundation\Http\FormRequest;

class StoreJobApplicationRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'vacancy_id' => ['required', 'uuid', 'exists:vacancies,id'],
            'applicant_uid' => ['required', 'string', 'max:100', 'exists:users,uid'],
            'applicant_name' => ['required', 'string', 'max:255'],
            'applicant_email' => ['nullable', 'email', 'max:255'],
            'applicant_phone' => ['required', 'string', 'max:20'],
            'applicant_address' => ['required', 'string', 'max:2000'],
            'applicant_nid' => ['nullable', 'string', 'max:100'],
            'applicant_passport' => ['nullable', 'string', 'max:100'],
            'photo' => ['required', 'image', 'mimes:jpg,jpeg,png,webp', 'max:5120'],
            'resume_path' => ['nullable', 'string'],
            'cover_letter' => ['nullable', 'string', 'max:10000'],
        ];
    }
}
