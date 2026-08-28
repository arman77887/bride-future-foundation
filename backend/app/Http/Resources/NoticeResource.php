<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class NoticeResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'title_bn' => $this->title_bn,
            'title_en' => $this->title_en,
            'content_bn' => $this->content_bn,
            'content_en' => $this->content_en,
            'expires_at' => $this->expires_at,
            'status' => $this->status,
            'created_at' => $this->created_at,
        ];
    }
}
