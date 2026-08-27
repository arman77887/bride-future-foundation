<?php

namespace App\Http\Requests\Donation;

use Illuminate\Foundation\Http\FormRequest;

class UpdateDonationMethodRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'name_bn' => ['sometimes', 'required', 'string', 'max:255'],
            'name_en' => ['sometimes', 'required', 'string', 'max:255'],
            'instructions_bn' => ['nullable', 'string'],
            'instructions_en' => ['nullable', 'string'],
            'payment_type' => ['sometimes', 'required', 'string', 'max:50'],
            'account_identifier' => ['sometimes', 'required', 'string', 'max:100'],
            'is_active' => ['boolean'],
            'display_order' => ['integer', 'min:0'],
        ];
    }
}
