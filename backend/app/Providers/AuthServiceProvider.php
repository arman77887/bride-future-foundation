<?php

namespace App\Providers;

use App\Models\Donation;
use App\Policies\DonationPolicy;
use Illuminate\Foundation\Support\Providers\AuthServiceProvider as ServiceProvider;

class AuthServiceProvider extends ServiceProvider
{
    protected $policies = [
        Donation::class => DonationPolicy::class,
    ];

    public function boot(): void
    {
        //
    }
}
