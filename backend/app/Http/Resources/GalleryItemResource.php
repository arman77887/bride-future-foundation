<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use Illuminate\Support\Facades\Storage;

class GalleryItemResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'gallery_album_id' => $this->gallery_album_id,
            'media_id' => $this->media_id,
            'title_bn' => $this->title_bn,
            'title_en' => $this->title_en,
            'file_url' => $this->file_url,
            'image_url' => $this->media
                ? Storage::disk('public')->url($this->media->storage_key)
                : $this->file_url,
            'display_order' => $this->display_order,
            'created_at' => $this->created_at,
        ];
    }
}
