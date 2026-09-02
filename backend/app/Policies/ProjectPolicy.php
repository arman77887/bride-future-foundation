<?php

namespace App\Policies;

use App\Models\Project;
use App\Models\User;

class ProjectPolicy
{
    public function manage(User $user): bool
    {
        return $user->hasAnyRole([
            'developer',
            'president',
            'super-admin',
        ]) || (
            $user->hasPermission('projects.create') &&
            $user->hasPermission('projects.update') &&
            $user->hasPermission('projects.delete')
        );
    }
}
