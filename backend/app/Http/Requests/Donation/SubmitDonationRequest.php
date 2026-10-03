<?php

namespace App\Http\Requests\Donation;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class SubmitDonationRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'donation_method_id' => [
                'required',
                'uuid',
                Rule::exists('donation_methods', 'id')
                    ->where('is_active', true),
            ],
            'project_id' => [
                'nullable',
                'uuid',
                Rule::exists('projects', 'id')
                    ->where('status', 'ACTIVE'),
            ],
            'donor_name' => ['nullable', 'string', 'max:255'],
            'donor_email' => ['nullable', 'email', 'max:255'],
            'donor_phone' => ['nullable', 'string', 'max:20'],
            'amount' => ['required', 'numeric', 'min:1', 'max:999999999999.99'],
            'currency' => ['required', 'string', 'in:BDT,USD'],
            'transaction_id' => ['required', 'string', 'max:100', 'unique:donations,transaction_id'],
            'sender_phone' => ['required', 'string', 'max:20'],
            'evidence' => ['nullable', 'file', 'mimes:jpg,jpeg,png,pdf', 'max:5120'],
        ];
    }
}
