<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\AuditLog;
use Illuminate\Http\Request;

class AdminAuditLogController extends Controller
{
    public function index(Request $request)
    {
        $validated = $request->validate([
            'search' => ['nullable', 'string', 'max:100'],
            'module' => ['nullable', 'string', 'max:100'],
            'action' => ['nullable', 'string', 'max:100'],
            'actor_id' => ['nullable', 'uuid'],
            'per_page' => ['nullable', 'integer', 'min:10', 'max:100'],
        ]);

        $query = AuditLog::query()
            ->with([
                'actor:id,uid,name,email',
            ])
            ->orderByDesc('created_at');

        if (!empty($validated['search'])) {
            $search = $validated['search'];

            $query->where(function ($q) use ($search) {
                $q->where('action', 'ILIKE', "%{$search}%")
                    ->orWhere('module', 'ILIKE', "%{$search}%")
                    ->orWhere('entity_type', 'ILIKE', "%{$search}%")
                    ->orWhere('entity_id', 'ILIKE', "%{$search}%")
                    ->orWhere('ip_address', 'ILIKE', "%{$search}%")
                    ->orWhereHas('actor', function ($actorQuery) use ($search) {
                        $actorQuery->where('uid', 'ILIKE', "%{$search}%")
                            ->orWhere('name', 'ILIKE', "%{$search}%")
                            ->orWhere('email', 'ILIKE', "%{$search}%");
                    });
            });
        }

        if (!empty($validated['module'])) {
            $query->where('module', $validated['module']);
        }

        if (!empty($validated['action'])) {
            $query->where('action', $validated['action']);
        }

        if (!empty($validated['actor_id'])) {
            $query->where('actor_id', $validated['actor_id']);
        }

        $perPage = $validated['per_page'] ?? 25;

        $logs = $query->paginate($perPage);

        return response()->json($logs);
    }

    public function filters()
    {
        return response()->json([
            'modules' => AuditLog::query()
                ->select('module')
                ->distinct()
                ->orderBy('module')
                ->pluck('module'),

            'actions' => AuditLog::query()
                ->select('action')
                ->distinct()
                ->orderBy('action')
                ->pluck('action'),
        ]);
    }
}
