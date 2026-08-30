<?php

namespace App\Http\Requests\Officer;

use Illuminate\Foundation\Http\FormRequest;

class VerifyOfficerRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'status' => [
                'required',
                'string',
                'in:APPROVED,REJECTED',
            ],
            'remarks' => [
                'nullable',
                'string',
            ],
        ];
    }
}
