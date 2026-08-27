<?php

namespace App\Http\Requests\Donation;

use Illuminate\Foundation\Http\FormRequest;

class StoreDonationMethodRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'name_bn' => ['required', 'string', 'max:255'],
            'name_en' => ['required', 'string', 'max:255'],
            'instructions_bn' => ['nullable', 'string'],
            'instructions_en' => ['nullable', 'string'],
            'payment_type' => ['required', 'string', 'max:50'],
            'account_identifier' => ['required', 'string', 'max:100'],
            'is_active' => ['boolean'],
            'display_order' => ['integer', 'min:0'],
        ];
    }
}
