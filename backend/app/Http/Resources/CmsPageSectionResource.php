<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class CmsPageSectionResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'cms_page_id' => $this->cms_page_id,
            'section_key' => $this->section_key,

            'title_bn' => $this->title_bn,
            'title_en' => $this->title_en,

            'content_bn' => $this->content_bn,
            'content_en' => $this->content_en,

            'display_order' => $this->display_order,
            'is_active' => $this->is_active,

            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
        ];
    }
}
