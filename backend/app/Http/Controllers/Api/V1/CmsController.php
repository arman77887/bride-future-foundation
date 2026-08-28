<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Models\CmsPage;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class CmsController extends Controller
{
    public function show(string $slug): JsonResponse
    {
        $page = CmsPage::with('sections')->where('slug', $slug)->where('is_published', true)->firstOrFail();

        return response()->json([
            'page' => $page,
        ]);
    }

    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'title' => ['required', 'string', 'max:255'],
            'slug' => ['required', 'string', 'unique:cms_pages,slug'],
            'content' => ['nullable', 'string'],
            'is_published' => ['boolean'],
        ]);

        $page = CmsPage::create($validated);

        return response()->json([
            'message' => 'CMS page created successfully',
            'page' => $page,
        ], Response::HTTP_CREATED);
    }
}
