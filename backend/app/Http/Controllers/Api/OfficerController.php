<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\Officer\StoreOfficerRequest;
use App\Http\Requests\Officer\UpdateOfficerRequest;
use App\Http\Requests\Officer\VerifyOfficerRequest;
use App\Http\Resources\OfficerProfileResource;
use App\Models\OfficerProfile;
use App\Models\Department;
use App\Models\Position;
use App\Models\OfficerVerificationHistory;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;
use Illuminate\Support\Str;

class OfficerController extends Controller
{
    /**
     * Public officers.
     */
    public function index(): AnonymousResourceCollection
    {
        $officers = OfficerProfile::with(['department', 'position', 'avatarMedia'])
            ->where('is_public', true)
            ->paginate(15);

        return OfficerProfileResource::collection($officers);
    }

    /**
     * Admin officer list.
     */
    public function adminIndex(Request $request): AnonymousResourceCollection
    {
        $query = OfficerProfile::with(['department', 'position', 'avatarMedia'])
            ->latest();

        if ($request->filled('search')) {
            $search = trim($request->string('search')->toString());

            $query->where(function ($q) use ($search) {
                $q->where('name', 'ilike', "%{$search}%")
                    ->orWhere('official_id', 'ilike', "%{$search}%")
                    ->orWhere('email_personal', 'ilike', "%{$search}%")
                    ->orWhere('phone', 'ilike', "%{$search}%");
            });
        }

        if ($request->filled('status')) {
            $status = strtoupper($request->string('status')->toString());

            if ($status !== 'ALL') {
                $query->where('status', $status);
            }
        }

        if ($request->filled('department_id')) {
            $query->where('department_id', $request->string('department_id'));
        }

        if ($request->filled('position_id')) {
            $query->where('position_id', $request->string('position_id'));
        }

        return OfficerProfileResource::collection(
            $query->paginate(15)->withQueryString()
        );
    }

    /**
     * Create officer profile.
     */
    public function store(StoreOfficerRequest $request): JsonResponse
    {
        $officer = OfficerProfile::create(array_merge(
            $request->validated(),
            [
                'status' => 'SUBMITTED',
                'is_public' => false,
            ]
        ));

        $officer->load(['department', 'position', 'avatarMedia']);

        return response()->json([
            'message' => 'Officer profile submitted successfully',
            'data' => new OfficerProfileResource($officer),
        ], 201);
    }

    /**
     * Update officer/member profile.
     */
    public function update(UpdateOfficerRequest $request, string $id): JsonResponse
    {
        $officer = OfficerProfile::findOrFail($id);

        $officer->update($request->validated());

        $officer->load(['department', 'position', 'avatarMedia']);

        return response()->json([
            'message' => 'Officer profile updated successfully',
            'data' => new OfficerProfileResource($officer),
        ]);
    }

    /**
     * Create a department from the member admin form.
     */
    public function storeDepartment(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'name_bn' => ['required', 'string', 'max:255'],
            'name_en' => ['required', 'string', 'max:255'],
        ]);

        $baseSlug = Str::slug($validated['name_en']);

        if ($baseSlug === '') {
            $baseSlug = 'department';
        }

        $slug = $baseSlug;
        $counter = 2;

        while (Department::withTrashed()->where('slug', $slug)->exists()) {
            $slug = $baseSlug . '-' . $counter++;
        }

        $department = Department::create([
            'name_bn' => trim($validated['name_bn']),
            'name_en' => trim($validated['name_en']),
            'slug' => $slug,
            'display_order' => 0,
            'is_active' => true,
        ]);

        return response()->json([
            'message' => 'Department created successfully',
            'data' => $department,
        ], 201);
    }

    /**
     * Create a designation/position from the member admin form.
     */
    public function storePosition(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'title_bn' => ['required', 'string', 'max:255'],
            'title_en' => ['required', 'string', 'max:255'],
        ]);

        $baseSlug = Str::slug($validated['title_en']);

        if ($baseSlug === '') {
            $baseSlug = 'position';
        }

        $slug = $baseSlug;
        $counter = 2;

        while (Position::withTrashed()->where('slug', $slug)->exists()) {
            $slug = $baseSlug . '-' . $counter++;
        }

        $position = Position::create([
            'title_bn' => trim($validated['title_bn']),
            'title_en' => trim($validated['title_en']),
            'slug' => $slug,
            'display_order' => 0,
            'is_active' => true,
        ]);

        return response()->json([
            'message' => 'Designation created successfully',
            'data' => $position,
        ], 201);
    }

    /**
     * Verify officer.
     */
    public function verify(
        VerifyOfficerRequest $request,
        string $id
    ): JsonResponse {
        $officer = OfficerProfile::findOrFail($id);

        $previousStatus = $officer->status;
        $newStatus = strtoupper($request->validated('status'));

        $officer->update([
            'status' => $newStatus,
            'is_public' => $newStatus === 'APPROVED',
        ]);

        OfficerVerificationHistory::create([
            'officer_profile_id' => $officer->id,
            'reviewer_id' => $request->user()->id,
            'previous_status' => $previousStatus,
            'new_status' => $newStatus,
            'review_note' => $request->validated('remarks'),
        ]);

        $officer->load(['department', 'position', 'avatarMedia']);

        return response()->json([
            'message' => 'Officer verification status updated',
            'data' => new OfficerProfileResource($officer),
        ]);
    }
}
