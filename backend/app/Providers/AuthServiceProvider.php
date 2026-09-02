<?php

namespace App\Providers;

use App\Models\CmsMenu;
use App\Models\CmsPage;
use App\Models\Donation;
use App\Models\GalleryAlbum;
use App\Models\Media;
use App\Policies\CmsPolicy;
use App\Policies\DonationPolicy;
use App\Policies\GalleryPolicy;
use App\Policies\MediaPolicy;
use Illuminate\Foundation\Support\Providers\AuthServiceProvider as ServiceProvider;

class AuthServiceProvider extends ServiceProvider
{
    protected $policies = [
        CmsPage::class => CmsPolicy::class,
        CmsMenu::class => CmsPolicy::class,
        Donation::class => DonationPolicy::class,
        GalleryAlbum::class => GalleryPolicy::class,
        Media::class => MediaPolicy::class,
    ];

    public function boot(): void
    {
        //
    }
}
