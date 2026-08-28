<?php

namespace App\Services;

use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;

class FileService
{
    public function uploadPrivate(UploadedFile $file, string $folder = 'documents'): string
    {
        return $file->store($folder, 'private');
    }

    public function uploadPublic(UploadedFile $file, string $folder = 'cms'): string
    {
        return $file->store($folder, 'public');
    }

    public function delete(string $path, string $disk = 'private'): bool
    {
        if (Storage::disk($disk)->exists($path)) {
            return Storage::disk($disk)->delete($path);
        }

        return false;
    }
}
