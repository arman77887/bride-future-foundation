<?php

namespace App\Policies;

use App\Models\User;

class CmsPolicy
{
    public function view(User $user): bool
    {
        return $user->hasPermission('cms.view');
    }

    public function create(User $user): bool
    {
        return $user->hasPermission('cms.create');
    }

    public function update(User $user): bool
    {
        return $user->hasPermission('cms.update');
    }

    public function delete(User $user): bool
    {
        return $user->hasPermission('cms.delete');
    }

    /**
     * Backward-compatible generic CMS management check.
     *
     * Used by existing controllers that call:
     * $this->authorize('manage', CmsPage::class)
     */
    public function manage(User $user): bool
    {
        return $user->hasAnyRole([
            'developer',
            'president',
            'super-admin',
        ]) || (
            $user->hasPermission('cms.create') &&
            $user->hasPermission('cms.update') &&
            $user->hasPermission('cms.delete')
        );
    }
}
