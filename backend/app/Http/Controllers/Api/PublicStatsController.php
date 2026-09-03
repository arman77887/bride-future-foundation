<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Donation;
use App\Models\EmailSubscriber;
use App\Models\User;
use Illuminate\Http\JsonResponse;

class PublicStatsController extends Controller
{
    public function index(): JsonResponse
    {
        return response()->json([
            'data' => [
                'subscribers' => EmailSubscriber::whereRaw('is_active = TRUE')->count(),
                'registered_users' => User::whereHas('roles', function ($query) {
                    $query->where('slug', 'member');
                })->count(),
                'donations' => Donation::where('status', 'VERIFIED')->count(),
            ],
        ]);
    }
}
