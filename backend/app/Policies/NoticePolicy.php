<?php

namespace App\Policies;

use App\Models\Notice;
use App\Models\User;

class NoticePolicy
{
    public function manage(User $user): bool
    {
        return $user->hasAnyRole([
            'developer',
            'president',
            'super-admin',
        ]) || (
            $user->hasPermission('notices.create') &&
            $user->hasPermission('notices.update') &&
            $user->hasPermission('notices.delete')
        );
    }
}
