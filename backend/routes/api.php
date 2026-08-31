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
use App\Http\Controllers\Api\NewsController;
use App\Http\Controllers\Api\EventController;
use App\Http\Controllers\Api\ProjectController;
use App\Http\Controllers\Api\NoticeController;
use App\Http\Controllers\Api\GalleryController;
use App\Http\Controllers\Api\PublicDocumentController;
use App\Http\Controllers\Api\CmsMenuController;
use App\Http\Controllers\Api\MediaController;
use App\Http\Controllers\Api\AdminDashboardController;

Route::prefix('v1')->group(function () {

    /*
    |--------------------------------------------------------------------------
    | AUTH
    |--------------------------------------------------------------------------
    */

    Route::post('/auth/register', [AuthController::class, 'register']);
    Route::post('/auth/login', [AuthController::class, 'login']);

    Route::middleware('auth:sanctum')->group(function () {

        Route::get('/auth/me', [AuthController::class, 'me']);
        Route::post('/auth/logout', [AuthController::class, 'logout']);

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
    | AUTHENTICATED ADMIN
    |--------------------------------------------------------------------------
    */

    Route::middleware([
        'auth:sanctum',
        'admin',
    ])->group(function () {

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

        Route::post('/vacancies', [
            VacancyController::class,
            'store'
        ])->middleware('permission:vacancies.create');


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

        Route::post('/events', [
            EventController::class,
            'store'
        ])->middleware('permission:events.create');

        Route::post('/projects', [
            ProjectController::class,
            'store'
        ])->middleware('permission:projects.create');

        Route::post('/notices', [
            NoticeController::class,
            'store'
        ])->middleware('permission:notices.create');


        /*
        | Gallery / Documents / CMS Menu / Media
        */

        Route::post('/gallery', [
            GalleryController::class,
            'store'
        ])->middleware('permission:gallery.create');

        Route::post('/public-documents', [
            PublicDocumentController::class,
            'store'
        ])->middleware('permission:documents.create');

        Route::post('/cms-menus', [
            CmsMenuController::class,
            'store'
        ])->middleware('permission:cms.update');

        Route::post('/media', [
            MediaController::class,
            'store'
        ])->middleware('permission:media.create');

    });

});
