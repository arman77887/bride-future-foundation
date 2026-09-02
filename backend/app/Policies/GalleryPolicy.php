<?php

namespace App\Policies;

use App\Models\User;

class GalleryPolicy
{
    public function manage(User $user): bool
    {
        return $user->hasPermission('gallery.create')
            || $user->hasPermission('gallery.update')
            || $user->hasPermission('gallery.delete');
    }
}
