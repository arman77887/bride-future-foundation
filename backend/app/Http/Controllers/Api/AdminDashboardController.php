<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Donation;
use App\Models\JobApplication;
use App\Models\OfficerProfile;
use App\Models\News;
use App\Models\Notice;
use App\Models\Event;
use App\Models\Project;
use App\Models\Vacancy;
use App\Models\PublicDocument;
use App\Models\User;
use App\Models\EmailSubscriber;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class AdminDashboardController extends Controller
{
    private function ensureAdmin(Request $request): void
    {
        $user = $request->user();

        abort_unless($user, 401, 'Unauthenticated.');

        $isAdmin = $user->roles()
            ->whereIn('slug', [
                'developer',
                'president',
                'super-admin',
            ])
            ->exists();

        abort_unless(
            $isAdmin,
            403,
            'You do not have permission to access the admin dashboard.'
        );
    }

    public function stats(Request $request): JsonResponse
    {
        $this->ensureAdmin($request);

        return response()->json([
            'message' => 'Dashboard statistics retrieved successfully',
            'data' => [
                'overview' => [
                    'donations' => Donation::count(),
                    'applications' => JobApplication::count(),
                    'officers' => OfficerProfile::count(),
                    'news' => News::count(),
                    'notices' => Notice::count(),
                    'events' => Event::count(),
                    'projects' => Project::count(),
                    'vacancies' => Vacancy::count(),
                    'documents' => PublicDocument::count(),
                    'users' => User::count(),
                    'subscribers' => EmailSubscriber::count(),
                    'active_subscribers' => EmailSubscriber::whereRaw('is_active = TRUE')->count(),
                ],

                'recent' => [
                    'donations' => Donation::with('donationMethod')
                        ->latest()
                        ->limit(5)
                        ->get(),

                    'applications' => JobApplication::latest()
                        ->limit(5)
                        ->get(),

                    'officers' => OfficerProfile::latest()
                        ->limit(5)
                        ->get(),
                ],
            ],
        ]);
    }
}
