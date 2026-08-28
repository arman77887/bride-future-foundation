<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class CmsMenuResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'name' => $this->name,
            'slug' => $this->slug,
            'items' => $this->whenLoaded('items', function () {
                return $this->formatItems($this->items);
            }),
        ];
    }

    protected function formatItems($items)
    {
        return $items->map(function ($item) {
            return [
                'id' => $item->id,
                'label_bn' => $item->label_bn,
                'label_en' => $item->label_en,
                'url' => $item->url,
                'route' => $item->route,
                'target' => $item->target,
                'children' => $item->children->count() > 0 ? $this->formatItems($item->children) : [],
            ];
        });
    }
}
