<?php

namespace App\Http\Requests\Donation;

use Illuminate\Foundation\Http\FormRequest;

class SubmitDonationRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'donation_method_id' => ['required', 'uuid', 'exists:donation_methods,id'],
            'donor_name' => ['nullable', 'string', 'max:255'],
            'donor_email' => ['nullable', 'email', 'max:255'],
            'donor_phone' => ['nullable', 'string', 'max:20'],
            'amount' => ['required', 'numeric', 'min:1', 'max:999999999999.99'],
            'currency' => ['required', 'string', 'size:3'],
            'payment_gateway' => ['required', 'string', 'max:50'],
            'transaction_id' => ['required', 'string', 'max:100', 'unique:donations,transaction_id'],
            'sender_phone' => ['nullable', 'string', 'max:20'],
            'evidence' => ['nullable', 'file', 'mimes:jpg,jpeg,png,pdf', 'max:5120'],
        ];
    }
}
