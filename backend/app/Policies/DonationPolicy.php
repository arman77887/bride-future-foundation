<?php

namespace App\Policies;

use App\Models\User;
use App\Models\Donation;

class DonationPolicy
{
    public function viewAny(User $user): bool
    {
        return $user->hasPermission('donations.view');
    }

    public function view(User $user, Donation $donation): bool
    {
        return $user->hasPermission('donations.view');
    }

    public function review(User $user, Donation $donation): bool
    {
        return $user->hasPermission('donations.verify');
    }

    public function export(User $user): bool
    {
        return $user->hasPermission('donations.export');
    }

    public function viewEvidence(User $user, Donation $donation): bool
    {
        return $user->hasPermission('donations.view');
    }
}
