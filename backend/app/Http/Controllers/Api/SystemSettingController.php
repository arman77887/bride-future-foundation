<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\SystemSetting;
use App\Models\Media;
use Illuminate\Support\Facades\Storage;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class SystemSettingController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $query = SystemSetting::query();

        if (!$request->user()) {
            $query->whereRaw('is_public = TRUE');
        }

        if ($request->filled('group')) {
            $query->where('group', $request->string('group'));
        }

        $settings = $query
            ->orderBy('group')
            ->orderBy('key')
            ->get()
            ->map(fn (SystemSetting $setting) => $this->withMediaUrl($setting));

        return response()->json([
            'success' => true,
            'data' => $settings,
        ]);
    }

    public function show(Request $request, string $key): JsonResponse
    {
        $query = SystemSetting::where('key', $key);

        if (!$request->user()) {
            $query->whereRaw('is_public = TRUE');
        }

        $setting = $query->firstOrFail();

        return response()->json([
            'success' => true,
            'data' => $this->withMediaUrl($setting),
        ]);
    }

    private function withMediaUrl(SystemSetting $setting): array
    {
        $data = $setting->toArray();

        if ($setting->type === 'media' && $setting->value) {
            $media = Media::find($setting->value);

            $data['media_url'] = $media
                ? Storage::disk('public')->url($media->storage_key)
                : null;
        }

        return $data;
    }

    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'key' => ['required', 'string', 'max:150'],
            'value' => ['required', 'string'],
            'type' => ['required', 'string', 'max:50'],
            'group' => ['required', 'string', 'max:50'],
            'description' => ['nullable', 'string'],
            'is_public' => ['nullable', 'boolean'],
        ]);

        $validated['is_public'] = (bool) ($validated['is_public'] ?? false);

        $setting = SystemSetting::where('key', $validated['key'])->first();

        if ($setting) {
            $setting->key = $validated['key'];
            $setting->value = $validated['value'];
            $setting->type = $validated['type'];
            $setting->group = $validated['group'];
            $setting->description = $validated['description'] ?? null;
            $setting->save();

            DB::statement(
                'UPDATE system_settings SET is_public = ?::boolean WHERE id = ?',
                [$validated['is_public'] ? 'true' : 'false', $setting->id]
            );

            $setting->refresh();
        } else {
            $setting = new SystemSetting();

            $setting->key = $validated['key'];
            $setting->value = $validated['value'];
            $setting->type = $validated['type'];
            $setting->group = $validated['group'];
            $setting->description = $validated['description'] ?? null;

            $setting->save();

            if ($validated['is_public']) {
                DB::statement(
                    'UPDATE system_settings SET is_public = TRUE WHERE id = ?',
                    [$setting->id]
                );

                $setting->refresh();
            }
        }

        return response()->json([
            'success' => true,
            'message' => 'System setting saved successfully',
            'data' => $setting,
        ], 201);
    }

    public function update(Request $request, string $id): JsonResponse
    {
        $setting = SystemSetting::findOrFail($id);

        $validated = $request->validate([
            'key' => ['sometimes', 'string', 'max:150'],
            'value' => ['sometimes', 'string'],
            'type' => ['sometimes', 'string', 'max:50'],
            'group' => ['sometimes', 'string', 'max:50'],
            'description' => ['nullable', 'string'],
            'is_public' => ['sometimes', 'boolean'],
        ]);

        $isPublic = array_key_exists('is_public', $validated)
            ? (bool) $validated['is_public']
            : null;

        unset($validated['is_public']);

        foreach ($validated as $field => $value) {
            $setting->{$field} = $value;
        }

        $setting->save();

        if ($isPublic !== null) {
            DB::statement(
                'UPDATE system_settings SET is_public = ?::boolean WHERE id = ?',
                [$isPublic ? 'true' : 'false', $setting->id]
            );

            $setting->refresh();
        }

        return response()->json([
            'success' => true,
            'message' => 'System setting updated successfully',
            'data' => $setting->fresh(),
        ]);
    }

    public function destroy(string $id): JsonResponse
    {
        $setting = SystemSetting::findOrFail($id);
        $setting->delete();

        return response()->json([
            'success' => true,
            'message' => 'System setting deleted successfully',
        ]);
    }
}
