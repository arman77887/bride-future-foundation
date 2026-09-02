<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\CmsMenuResource;
use App\Models\CmsMenu;
use App\Models\CmsMenuItem;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class CmsMenuController extends Controller
{
    public function show(string $slug): CmsMenuResource
    {
        $menu = CmsMenu::where('slug', $slug)
            ->with([
                'items' => function ($q) {
                    $q->with('children');
                }
            ])
            ->firstOrFail();

        return new CmsMenuResource($menu);
    }

    public function store(Request $request): JsonResponse
    {
        $this->authorize('manage', CmsMenu::class);

        $data = $request->validate([
            'name' => ['required', 'string', 'max:100'],
            'slug' => ['required', 'string', 'max:100', 'unique:cms_menus,slug'],
        ]);

        $menu = CmsMenu::create($data);

        return response()->json([
            'message' => 'Menu created successfully',
            'data' => new CmsMenuResource($menu),
        ], 201);
    }

    public function updateItems(
        Request $request,
        string $slug
    ): JsonResponse {
        $this->authorize('manage', CmsMenu::class);

        $menu = CmsMenu::where('slug', $slug)->firstOrFail();

        $validated = $request->validate([
            'items' => ['required', 'array'],
            'items.*.id' => ['nullable', 'uuid'],
            'items.*.parent_id' => ['nullable', 'uuid'],
            'items.*.label_bn' => ['required', 'string', 'max:150'],
            'items.*.label_en' => ['required', 'string', 'max:150'],
            'items.*.url' => ['nullable', 'string', 'max:255'],
            'items.*.route' => ['nullable', 'string', 'max:150'],
            'items.*.display_order' => ['nullable', 'integer'],
            'items.*.target' => ['nullable', 'string', 'max:50'],
        ]);

        DB::transaction(function () use ($validated, $menu) {
            foreach ($validated['items'] as $item) {
                $item['cms_menu_id'] = $menu->id;

                if (!empty($item['id'])) {
                    $existing = CmsMenuItem::where('cms_menu_id', $menu->id)
                        ->findOrFail($item['id']);

                    $existing->update($item);
                } else {
                    CmsMenuItem::create($item);
                }
            }
        });

        return response()->json([
            'message' => 'Menu updated successfully',
            'data' => new CmsMenuResource(
                $menu->fresh()->load([
                    'items' => fn ($q) => $q->with('children')
                ])
            ),
        ]);
    }

    public function deleteItem(
        Request $request,
        string $slug,
        string $id
    ): JsonResponse {
        $this->authorize('manage', CmsMenu::class);

        $menu = CmsMenu::where('slug', $slug)->firstOrFail();

        $item = CmsMenuItem::where('cms_menu_id', $menu->id)
            ->findOrFail($id);

        $item->delete();

        return response()->json([
            'message' => 'Menu item deleted successfully',
        ]);
    }
}
