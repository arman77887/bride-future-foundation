<?php

namespace App\Http\Requests\Donation;

use Illuminate\Foundation\Http\FormRequest;

class TransitionDonationRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'status' => ['required', 'string', 'in:PENDING,UNDER_REVIEW,VERIFIED,REJECTED,REVERSED'],
            'notes' => ['nullable', 'string', 'max:1000'],
        ];
    }
}
