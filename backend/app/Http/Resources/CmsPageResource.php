<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class CmsPageResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'slug' => $this->slug,
            'title_bn' => $this->title_bn,
            'title_en' => $this->title_en,
            'content_bn' => $this->content_bn,
            'content_en' => $this->content_en,
            'status' => $this->status,
            'seo_title_bn' => $this->seo_title_bn,
            'seo_title_en' => $this->seo_title_en,
            'seo_description_bn' => $this->seo_description_bn,
            'seo_description_en' => $this->seo_description_en,
            'metadata' => $this->metadata,
            'published_at' => $this->published_at,
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
        ];
    }
}
