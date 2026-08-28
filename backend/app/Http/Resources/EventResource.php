<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class EventResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'title_bn' => $this->title_bn,
            'title_en' => $this->title_en,
            'slug' => $this->slug,
            'description_bn' => $this->description_bn,
            'description_en' => $this->description_en,
            'location_bn' => $this->location_bn,
            'location_en' => $this->location_en,
            'start_time' => $this->start_time,
            'end_time' => $this->end_time,
            'status' => $this->status,
            'registration_link' => $this->registration_link,
            'created_at' => $this->created_at,
        ];
    }
}
