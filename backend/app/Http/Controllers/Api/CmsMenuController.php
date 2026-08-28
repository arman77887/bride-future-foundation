<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\CmsMenuResource;
use App\Models\CmsMenu;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class CmsMenuController extends Controller
{
    public function show(string $slug): CmsMenuResource
    {
        $menu = CmsMenu::where('slug', $slug)->with(['items' => function($q) {
            $q->with('children');
        }])->firstOrFail();

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
        return response()->json(['message' => 'Menu created successfully', 'data' => new CmsMenuResource($menu)], 201);
    }
}
