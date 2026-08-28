<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Models\OfficerProfile;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Symfony\Component\HttpFoundation\Response;

class OfficerController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $query = OfficerProfile::with(['user', 'department', 'position']);

        if ($request->has('status')) {
            $query->where('status', $request->string('status'));
        }

        $officers = $query->paginate($request->integer('per_page', 15));

        return response()->json($officers);
    }

    public function updateStatus(Request $request, OfficerProfile $officer): JsonResponse
    {
        $validated = $request->validate([
            'status' => ['required', 'string', 'in:PENDING,APPROVED,REJECTED,SUSPENDED'],
            'notes' => ['nullable', 'string', 'max:1000'],
        ]);

        DB::transaction(function () use ($officer, $validated) {
            $officer->update([
                'status' => $validated['status'],
                'admin_notes' => $validated['notes'] ?? $officer->admin_notes,
            ]);
        });

        return response()->json([
            'message' => 'Officer status updated successfully',
            'officer' => $officer->fresh(),
        ]);
    }
}
