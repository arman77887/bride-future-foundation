<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\OfficerController;
use App\Http\Controllers\Api\VacancyController;
use App\Http\Controllers\Api\JobApplicationController;
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

Route::prefix('v1')->group(function () {
    Route::post('/auth/register', [AuthController::class, 'register']);
    Route::post('/auth/login', [AuthController::class, 'login']);

    Route::get('/officers', [OfficerController::class, 'index']);
    Route::post('/officers', [OfficerController::class, 'store']);

    Route::get('/vacancies', [VacancyController::class, 'index']);
    Route::post('/job-applications', [JobApplicationController::class, 'store']);

    Route::get('/donation-methods', [DonationMethodController::class, 'index']);
    Route::post('/donations', [DonationManagementController::class, 'store']);

    // Public CMS Endpoints
    Route::get('/cms-pages', [CmsPageController::class, 'index']);
    Route::get('/cms-pages/{slug}', [CmsPageController::class, 'show']);
    Route::get('/news', [NewsController::class, 'index']);
    Route::get('/news/{slug}', [NewsController::class, 'show']);
    Route::get('/events', [EventController::class, 'index']);
    Route::get('/projects', [ProjectController::class, 'index']);
    Route::get('/notices', [NoticeController::class, 'index']);
    Route::get('/gallery', [GalleryController::class, 'index']);
    Route::get('/public-documents', [PublicDocumentController::class, 'index']);
    Route::get('/cms-menus/{slug}', [CmsMenuController::class, 'show']);

    Route::middleware('auth:sanctum')->group(function () {
        Route::post('/officers/{id}/verify', [OfficerController::class, 'verify']);
        Route::post('/vacancies', [VacancyController::class, 'store']);

        Route::post('/donation-methods', [DonationMethodController::class, 'store']);
        Route::put('/donation-methods/{id}', [DonationMethodController::class, 'update']);
        Route::delete('/donation-methods/{id}', [DonationMethodController::class, 'destroy']);

        Route::get('/admin/donations', [DonationManagementController::class, 'index']);
        Route::get('/admin/donations/stats', [DonationManagementController::class, 'stats']);
        Route::get('/admin/donations/export', [DonationManagementController::class, 'export']);
        Route::post('/admin/donations/{id}/transition', [DonationManagementController::class, 'transition']);
        Route::get('/admin/donations/{id}/evidence', [DonationManagementController::class, 'evidenceUrl']);

        // Admin CMS Management
        Route::post('/cms-pages', [CmsPageController::class, 'store']);
        Route::put('/cms-pages/{id}', [CmsPageController::class, 'update']);
        Route::delete('/cms-pages/{id}', [CmsPageController::class, 'destroy']);

        Route::post('/news', [NewsController::class, 'store']);
        Route::delete('/news/{id}', [NewsController::class, 'destroy']);

        Route::post('/events', [EventController::class, 'store']);
        Route::post('/projects', [ProjectController::class, 'store']);
        Route::post('/notices', [NoticeController::class, 'store']);
        Route::post('/gallery', [GalleryController::class, 'store']);
        Route::post('/public-documents', [PublicDocumentController::class, 'store']);
        Route::post('/cms-menus', [CmsMenuController::class, 'store']);
        Route::post('/media', [MediaController::class, 'store']);
    });
});
