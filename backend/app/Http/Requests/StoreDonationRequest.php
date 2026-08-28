<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreDonationRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'donor_name' => ['required', 'string', 'max:255'],
            'donor_email' => ['required', 'email', 'max:255'],
            'donor_phone' => ['required', 'string', 'max:50'],
            'amount' => ['required', 'numeric', 'min:1', 'max:99999999.99'],
            'currency' => ['required', 'string', 'size:3'],
            'payment_method' => ['required', 'string', 'max:50'],
            'transaction_id' => ['required', 'string', 'max:255', 'unique:donations,transaction_id'],
            'evidence' => ['nullable', 'file', 'mimes:jpg,jpeg,png,pdf', 'max:5120'],
            'metadata' => ['nullable', 'array'],
        ];
    }
}
