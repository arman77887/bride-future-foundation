<?php

namespace App\Policies;

use App\Models\PublicDocument;
use App\Models\User;

class PublicDocumentPolicy
{
    public function manage(User $user): bool
    {
        return $user->hasAnyRole([
            'developer',
            'president',
            'super-admin',
        ]) || (
            $user->hasPermission('documents.create') &&
            $user->hasPermission('documents.update') &&
            $user->hasPermission('documents.delete')
        );
    }
}
