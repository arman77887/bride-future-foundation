<?php

namespace App\Policies;

use App\Models\Event;
use App\Models\User;

class EventPolicy
{
    public function manage(User $user): bool
    {
        return $user->hasAnyRole([
            'developer',
            'president',
            'super-admin',
        ]) || (
            $user->hasPermission('events.create') &&
            $user->hasPermission('events.update') &&
            $user->hasPermission('events.delete')
        );
    }
}
