<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class VacancyResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,

            'department_id' => $this->department_id,
            'position_id' => $this->position_id,
            'required_count' => $this->required_count,

            'title_bn' => $this->title_bn,
            'title_en' => $this->title_en,

            'description_bn' => $this->description_bn,
            'description_en' => $this->description_en,

            'requirements' => $this->requirements,

            'deadline' => $this->deadline?->toISOString(),

            'status' => $this->status,

            'department' => $this->whenLoaded('department'),
            'position' => $this->whenLoaded('position'),

            'created_by' => $this->created_by,
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
        ];
    }
}
