<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class UserResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'uid' => $this->uid,
            'name' => $this->name,
            'email' => $this->email,
            'phone' => $this->phone,
            'address' => $this->address,
            'status' => $this->status,
            'two_factor_enabled' => $this->two_factor_enabled,
            'roles' => $this->whenLoaded('roles', fn() => $this->roles->pluck('slug')),
            'created_at' => $this->created_at,
        ];
    }
}
