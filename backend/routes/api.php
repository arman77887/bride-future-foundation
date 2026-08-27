<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\OfficerController;
use App\Http\Controllers\Api\VacancyController;
use App\Http\Controllers\Api\JobApplicationController;
use App\Http\Controllers\Api\DonationController;
use App\Http\Controllers\Api\DonationMethodController;
use App\Http\Controllers\Api\DonationManagementController;

Route::prefix('v1')->group(function () {
    Route::post('/auth/register', [AuthController::class, 'register']);
    Route::post('/auth/login', [AuthController::class, 'login']);

    Route::get('/officers', [OfficerController::class, 'index']);
    Route::post('/officers', [OfficerController::class, 'store']);

    Route::get('/vacancies', [VacancyController::class, 'index']);
    Route::post('/job-applications', [JobApplicationController::class, 'store']);

    // Donation Public & Management
    Route::get('/donation-methods', [DonationMethodController::class, 'index']);
    Route::post('/donations', [DonationManagementController::class, 'store']);

    Route::middleware('auth:sanctum')->group(function () {
        Route::post('/officers/{id}/verify', [OfficerController::class, 'verify']);
        Route::post('/vacancies', [VacancyController::class, 'store']);

        // Donation Methods Management
        Route::post('/donation-methods', [DonationMethodController::class, 'store']);
        Route::put('/donation-methods/{id}', [DonationMethodController::class, 'update']);
        Route::delete('/donation-methods/{id}', [DonationMethodController::class, 'destroy']);

        // Donation Administration & Workflow
        Route::get('/admin/donations', [DonationManagementController::class, 'index']);
        Route::get('/admin/donations/stats', [DonationManagementController::class, 'stats']);
        Route::get('/admin/donations/export', [DonationManagementController::class, 'export']);
        Route::post('/admin/donations/{id}/transition', [DonationManagementController::class, 'transition']);
        Route::get('/admin/donations/{id}/evidence', [DonationManagementController::class, 'evidenceUrl']);
    });
});
