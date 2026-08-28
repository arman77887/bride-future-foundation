<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ProjectResource extends JsonResource
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
            'status' => $this->status,
            'created_at' => $this->created_at,
        ];
    }
}
