<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class DonationResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'donor_name' => $this->donor_name,
            'amount' => $this->amount,
            'currency' => $this->currency_code,
            'transaction_id' => $this->transaction_id,
            'sender_info' => $this->sender_info,
            'screenshot_path' => $this->screenshot_path,
            'status' => $this->status,
            'donation_method' => $this->whenLoaded('donationMethod', function () {
                return [
                    'id' => $this->donationMethod->id,
                    'name_bn' => $this->donationMethod->name_bn,
                    'name_en' => $this->donationMethod->name_en,
                    'type' => $this->donationMethod->type,
                    'account_identifier' => $this->donationMethod->account_identifier,
                    'instructions_bn' => $this->donationMethod->instructions_bn,
                    'instructions_en' => $this->donationMethod->instructions_en,
                ];
            }),
            'created_at' => $this->created_at,
        ];
    }
}
