<?php

namespace App\Policies;

use App\Models\User;
use App\Models\Donation;

class DonationPolicy
{
    public function viewAny(User $user): bool
    {
        return $user->roles()->whereIn('slug', ['admin', 'president', 'accountant', 'auditor'])->exists();
    }

    public function view(User $user, Donation $donation): bool
    {
        return $user->roles()->whereIn('slug', ['admin', 'president', 'accountant', 'auditor'])->exists();
    }

    public function review(User $user, Donation $donation): bool
    {
        return $user->roles()->whereIn('slug', ['admin', 'president', 'accountant'])->exists();
    }

    public function export(User $user): bool
    {
        return $user->roles()->whereIn('slug', ['admin', 'president', 'accountant', 'auditor'])->exists();
    }

    public function viewEvidence(User $user, Donation $donation): bool
    {
        return $user->roles()->whereIn('slug', ['admin', 'president', 'accountant', 'auditor'])->exists();
    }
}
