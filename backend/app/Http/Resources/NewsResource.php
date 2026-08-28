<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class NewsResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'title_bn' => $this->title_bn,
            'title_en' => $this->title_en,
            'slug' => $this->slug,
            'content_bn' => $this->content_bn,
            'content_en' => $this->content_en,
            'status' => $this->status,
            'published_at' => $this->published_at,
            'created_at' => $this->created_at,
        ];
    }
}
