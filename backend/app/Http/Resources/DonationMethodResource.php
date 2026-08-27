<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class DonationMethodResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'name_bn' => $this->name_bn,
            'name_en' => $this->name_en,
            'instructions_bn' => $this->instructions_bn,
            'instructions_en' => $this->instructions_en,
            'payment_type' => $this->payment_type,
            'account_identifier' => $this->account_identifier,
            'is_active' => $this->is_active,
            'display_order' => $this->display_order,
            'created_at' => $this->created_at,
        ];
    }
}
