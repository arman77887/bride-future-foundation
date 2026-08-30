<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class AdminMiddleware
{
    public function handle(Request $request, Closure $next): Response
    {
        $user = $request->user();

        if (! $user) {
            return response()->json([
                'success' => false,
                'message' => 'Unauthenticated.',
            ], 401);
        }

        /*
         * Any authenticated user with a valid RBAC role
         * can reach the protected admin area.
         *
         * Actual authorization is enforced by the
         * permission middleware on individual routes.
         */
        if (! $user->roles()->exists()) {
            return response()->json([
                'success' => false,
                'message' => 'No active role assigned to this account.',
            ], 403);
        }

        return $next($request);
    }
}
