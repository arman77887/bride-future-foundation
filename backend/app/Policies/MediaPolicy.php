<?php

namespace App\Policies;

use App\Models\User;

class MediaPolicy
{
    public function manage(User $user): bool
    {
        return $user->hasPermission('media.create');
    }
}
