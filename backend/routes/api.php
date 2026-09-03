<?php

use Illuminate\Support\Facades\Route;

use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\OfficerController;
use App\Http\Controllers\Api\VacancyController;
use App\Http\Controllers\Api\JobApplicationController;
use App\Http\Controllers\Api\AdminJobApplicationController;
use App\Http\Controllers\Api\DonationController;
use App\Http\Controllers\Api\DonationMethodController;
use App\Http\Controllers\Api\DonationManagementController;
use App\Http\Controllers\Api\CmsPageController;
use App\Http\Controllers\Api\ContactMessageController;
use App\Http\Controllers\Api\SystemSettingController;
use App\Http\Controllers\Api\NewsController;
use App\Http\Controllers\Api\EventController;
use App\Http\Controllers\Api\ProjectController;
use App\Http\Controllers\Api\NoticeController;
use App\Http\Controllers\Api\GalleryController;
use App\Http\Controllers\Api\GalleryItemController;
use App\Http\Controllers\Api\PublicDocumentController;
use App\Http\Controllers\Api\CmsMenuController;
use App\Http\Controllers\Api\MediaController;
use App\Http\Controllers\Api\AdminDashboardController;
use App\Http\Controllers\Api\SubscriptionController;
use App\Http\Controllers\Api\AdminUserController;
use App\Http\Controllers\Api\AdminAuditLogController;
use App\Http\Controllers\Api\PublicStatsController;

Route::prefix('v1')->group(function () {
    Route::post('/subscriptions/subscribe', [SubscriptionController::class, 'subscribe'])->middleware('throttle:10,1');
    Route::post('/subscriptions/unsubscribe', [SubscriptionController::class, 'unsubscribe'])->middleware('throttle:10,1');
Route::get('/subscriptions/unsubscribe/{token}', [SubscriptionController::class, 'unsubscribeByToken']);
        Route::post('/contact-messages', [ContactMessageController::class, 'store'])
        ->middleware('throttle:10,1');


    /*
    |--------------------------------------------------------------------------
    | AUTH
    |--------------------------------------------------------------------------
    */

    Route::get('/public/stats', [PublicStatsController::class, 'index']);

    Route::post('/auth/register', [AuthController::class, 'register'])
        ->middleware('throttle:5,1');

    Route::post('/auth/login', [AuthController::class, 'login']);

    Route::middleware('auth:sanctum')->group(function () {

        Route::get('/auth/me', [AuthController::class, 'me']);
        Route::put('/auth/profile', [AuthController::class, 'updateProfile']);
        Route::post('/auth/change-password', [AuthController::class, 'changePassword']);
        Route::post('/auth/logout', [AuthController::class, 'logout']);

        /*
        |--------------------------------------------------------------------------
        | ADMIN - USERS
        |--------------------------------------------------------------------------
        */

        Route::get('/users', [
            AdminUserController::class,
            'index'
        ])->middleware('permission:users.view');

        Route::get('/users/{user}', [
            AdminUserController::class,
            'show'
        ])->middleware('permission:users.view');

        Route::get('/roles', [
            AdminUserController::class,
            'roles'
        ])->middleware('permission:users.view');

        Route::post('/users', [
            AdminUserController::class,
            'store'
        ])->middleware('permission:users.create');

        Route::put('/users/{user}', [
            AdminUserController::class,
            'update'
        ])->middleware('permission:users.update');

        Route::delete('/users/{user}', [
            AdminUserController::class,
            'destroy'
        ])->middleware('permission:users.delete');


        /*
        |--------------------------------------------------------------------------
        | ADMIN - AUDIT LOGS
        |--------------------------------------------------------------------------
        */

        Route::get('/audit-logs', [
            AdminAuditLogController::class,
            'index'
        ])->middleware('permission:audit.view');

        Route::get('/audit-logs/filters', [
            AdminAuditLogController::class,
            'filters'
        ])->middleware('permission:audit.view');


        /*
        |--------------------------------------------------------------------------
        | ADMIN - JOB APPLICATIONS
        |--------------------------------------------------------------------------
        */

        Route::get('/admin/applications', [
            AdminJobApplicationController::class,
            'index'
        ])->middleware('permission:applications.view');

        Route::get('/admin/applications/{id}', [
            AdminJobApplicationController::class,
            'show'
        ])->middleware('permission:applications.view');

        Route::patch('/admin/applications/{id}/status', [
            AdminJobApplicationController::class,
            'updateStatus'
        ])->middleware('permission:applications.status');


    });


    /*
    |--------------------------------------------------------------------------
    | PUBLIC
    |--------------------------------------------------------------------------
    */

    Route::get('/officers', [OfficerController::class, 'index']);

    Route::get('/vacancies', [VacancyController::class, 'index']);

    Route::post('/job-applications', [
        JobApplicationController::class,
        'store'
    ]);

    Route::get('/donation-methods', [
        DonationMethodController::class,
        'index'
    ]);

    Route::post('/donations', [
        DonationManagementController::class,
        'store'
    ]);

    Route::get('/cms-pages', [
        CmsPageController::class,
        'index'
    ]);

    Route::get('/cms-pages/{slug}', [
        CmsPageController::class,
        'show'
    ]);

    Route::get('/news', [
        NewsController::class,
        'index'
    ]);

    Route::get('/news/{slug}', [
        NewsController::class,
        'show'
    ]);

    Route::get('/events', [
        EventController::class,
        'index'
    ]);

    Route::get('/projects', [
        ProjectController::class,
        'index'
    ]);

    Route::get('/notices', [
        NoticeController::class,
        'index'
    ]);

    Route::get('/gallery', [
        GalleryController::class,
        'index'
    ]);

    Route::get('/public-documents', [
        PublicDocumentController::class,
        'index'
    ]);

    Route::get('/cms-menus/{slug}', [
        CmsMenuController::class,
        'show'
    ]);

    /*
    |--------------------------------------------------------------------------
    | SYSTEM SETTINGS
    |--------------------------------------------------------------------------
    */

    Route::get('/settings', [
        SystemSettingController::class,
        'index'
    ]);

    Route::get('/settings/{key}', [
        SystemSettingController::class,
        'show'
    ]);



    /*
    |--------------------------------------------------------------------------
    | AUTHENTICATED ADMIN
    |--------------------------------------------------------------------------
    */

    Route::middleware([
        'auth:sanctum',
        'admin',
    ])->group(function () {


        /*
        | Contact Messages
        */

        Route::get('/admin/contact-messages', [
            ContactMessageController::class,
            'index'
        ]);

        Route::get('/admin/contact-messages/{id}', [
            ContactMessageController::class,
            'show'
        ]);

        Route::put('/admin/contact-messages/{id}/status', [
            ContactMessageController::class,
            'updateStatus'
        ]);

        Route::delete('/admin/contact-messages/{id}', [
            ContactMessageController::class,
            'destroy'
        ]);

        /*
        | System Settings Management
        */

        Route::post('/settings', [
            SystemSettingController::class,
            'store'
        ])->middleware('permission:settings.create');

        Route::put('/settings/{id}', [
            SystemSettingController::class,
            'update'
        ])->middleware('permission:settings.update');

        Route::delete('/settings/{id}', [
            SystemSettingController::class,
            'destroy'
        ])->middleware('permission:settings.delete');


        /*
        | Dashboard
        */

        Route::get('/admin/dashboard/stats', [
            AdminDashboardController::class,
            'stats'
        ])->middleware('permission:dashboard.view');


        /*
        | Officers
        */

        Route::get('/admin/officers', [
            OfficerController::class,
            'adminIndex'
        ])->middleware('permission:officers.view');


        Route::post('/officers', [
            OfficerController::class,
            'store'
        ])->middleware('permission:officers.create');

        Route::post('/officers/{id}/verify', [
            OfficerController::class,
            'verify'
        ])->middleware('permission:officers.verify');


        /*
        | Vacancies
        */

        Route::get('/admin/vacancies', [
            VacancyController::class,
            'adminIndex'
        ])->middleware('permission:vacancies.view');

        Route::get('/admin/vacancies/options', [
            VacancyController::class,
            'options'
        ])->middleware('permission:vacancies.view');

        Route::post('/vacancies', [
            VacancyController::class,
            'store'
        ])->middleware('permission:vacancies.create');

        Route::put('/vacancies/{id}', [
            VacancyController::class,
            'update'
        ])->middleware('permission:vacancies.update');

        Route::delete('/vacancies/{id}', [
            VacancyController::class,
            'destroy'
        ])->middleware('permission:vacancies.delete');


        /*
        | Donation Methods
        */

        Route::post('/donation-methods', [
            DonationMethodController::class,
            'store'
        ])->middleware('permission:donation-methods.create');

        Route::put('/donation-methods/{id}', [
            DonationMethodController::class,
            'update'
        ])->middleware('permission:donation-methods.update');

        Route::delete('/donation-methods/{id}', [
            DonationMethodController::class,
            'destroy'
        ])->middleware('permission:donation-methods.delete');


        /*
        | Donations
        */

        Route::get('/admin/donations', [
            DonationManagementController::class,
            'index'
        ])->middleware('permission:donations.view');

        Route::get('/admin/donations/stats', [
            DonationManagementController::class,
            'stats'
        ])->middleware('permission:donations.view');

        Route::get('/admin/donations/export', [
            DonationManagementController::class,
            'export'
        ])->middleware('permission:donations.export');

        Route::post('/admin/donations/{id}/transition', [
            DonationManagementController::class,
            'transition'
        ])->middleware('permission:donations.verify');

        Route::get('/admin/donations/{id}/evidence', [
            DonationManagementController::class,
            'evidenceUrl'
        ])->middleware('permission:donations.view');


        /*
        | CMS
        */

        Route::post('/cms-pages', [
            CmsPageController::class,
            'store'
        ])->middleware('permission:cms.create');

        Route::put('/cms-pages/{id}', [
            CmsPageController::class,
            'update'
        ])->middleware('permission:cms.update');

        Route::delete('/cms-pages/{id}', [
            CmsPageController::class,
            'destroy'
        ])->middleware('permission:cms.delete');


        /*
        | News / Events / Projects / Notices
        */

        Route::post('/news', [
            NewsController::class,
            'store'
        ])->middleware('permission:news.create');

        Route::delete('/news/{id}', [
            NewsController::class,
            'destroy'
        ])->middleware('permission:news.delete');

        Route::put('/news/{id}', [
            NewsController::class,
            'update'
        ])->middleware('permission:news.update');


        Route::post('/events', [
            EventController::class,
            'store'
        ])->middleware('permission:events.create');

        Route::put('/events/{id}', [
            EventController::class,
            'update'
        ])->middleware('permission:events.update');

        Route::delete('/events/{id}', [
            EventController::class,
            'destroy'
        ])->middleware('permission:events.delete');

        Route::post('/projects', [
            ProjectController::class,
            'store'
        ])->middleware('permission:projects.create');

        Route::put('/projects/{id}', [
            ProjectController::class,
            'update'
        ])->middleware('permission:projects.update');

        Route::delete('/projects/{id}', [
            ProjectController::class,
            'destroy'
        ])->middleware('permission:projects.delete');

        Route::post('/notices', [
            NoticeController::class,
            'store'
        ])->middleware('permission:notices.create');

        Route::put('/notices/{id}', [
            NoticeController::class,
            'update'
        ])->middleware('permission:notices.update');

        Route::delete('/notices/{id}', [
            NoticeController::class,
            'destroy'
        ])->middleware('permission:notices.delete');


        /*
        | Gallery / Documents / CMS Menu / Media
        */

        Route::post('/gallery', [
            GalleryController::class,
            'store'
        ])->middleware('permission:gallery.create');
        Route::put("/gallery/{id}", [
            GalleryController::class,
            "update"
        ])->middleware("permission:gallery.update");

        Route::delete("/gallery/{id}", [
            GalleryController::class,
            "destroy"
        ])->middleware("permission:gallery.delete");


        Route::post('/gallery/items', [
            GalleryItemController::class,
            'store'
        ])->middleware('permission:gallery.create');

        Route::put('/gallery/items/{id}', [
            GalleryItemController::class,
            'update'
        ])->middleware('permission:gallery.update');

        Route::delete('/gallery/items/{id}', [
            GalleryItemController::class,
            'destroy'
        ])->middleware('permission:gallery.delete');

        Route::post('/public-documents', [
            PublicDocumentController::class,
            'store'
        ])->middleware('permission:documents.create');

        Route::put('/public-documents/{id}', [
            PublicDocumentController::class,
            'update'
        ])->middleware('permission:documents.update');

        Route::delete('/public-documents/{id}', [
            PublicDocumentController::class,
            'destroy'
        ])->middleware('permission:documents.delete');

        Route::post('/cms-menus', [
            CmsMenuController::class,
            'store'
        ])->middleware('permission:cms.update');

        Route::put('/cms-pages/{id}/sections', [
            CmsPageController::class,
            'updateSections'
        ])->middleware('permission:cms.update');

        Route::put('/cms-menus/{slug}/items', [
            CmsMenuController::class,
            'updateItems'
        ])->middleware('permission:cms.update');

        Route::delete('/cms-menus/{slug}/items/{id}', [
            CmsMenuController::class,
            'deleteItem'
        ])->middleware('permission:cms.update');

        Route::get('/media', [
            MediaController::class,
            'index'
        ])->middleware('permission:media.view');

        Route::get('/media', [
            MediaController::class,
            'index'
        ])->middleware('permission:media.view');

        Route::post('/media', [
            MediaController::class,
            'store'
        ])->middleware('permission:media.create');

        Route::put('/media/{id}', [
            MediaController::class,
            'update'
        ])->middleware('permission:media.update');

        Route::delete('/media/{id}', [
            MediaController::class,
            'destroy'
        ])->middleware('permission:media.delete');

    });

});
