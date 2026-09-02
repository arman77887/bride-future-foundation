<?php

namespace App\Policies;

use App\Models\User;

class NewsPolicy
{
    public function manage(User $user): bool
    {
        return $user->hasAnyRole([
            'developer',
            'president',
            'super-admin',
        ]) || (
            $user->hasPermission('news.create') &&
            $user->hasPermission('news.update') &&
            $user->hasPermission('news.delete')
        );
    }
}
