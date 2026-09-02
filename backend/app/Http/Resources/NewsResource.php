<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use Illuminate\Support\Facades\Storage;

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
            'cover_media_id' => $this->cover_media_id,
            'cover_image_url' => $this->cover_media_id && $this->coverMedia
                ? Storage::disk('public')->url($this->coverMedia->storage_key)
                : null,
            'created_at' => $this->created_at,
        ];
    }
}
