<?php

namespace App\Policies;

use App\Models\User;

class CmsPolicy
{
    public function manage(User $user): bool
    {
        return $user->roles()->whereIn('slug', ['admin', 'president', 'content-manager'])->exists();
    }
}
