<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class OfficerProfileResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'official_id' => $this->official_id,
            'name' => $this->name,
            'status' => $this->status,
            'is_public' => $this->is_public,
            'department' => $this->whenLoaded('department'),
            'position' => $this->whenLoaded('position'),
            'email_personal' => $this->email_personal,
            'phone' => $this->phone,
            'created_at' => $this->created_at,
        ];
    }
}
