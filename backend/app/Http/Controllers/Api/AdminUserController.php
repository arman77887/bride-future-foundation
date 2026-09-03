<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Role;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;
use Illuminate\Validation\Rule;

class AdminUserController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $query = User::with('roles:id,name,slug')
            ->select([
                'id',
                'uid',
                'email',
                'name',
                'phone',
                'address',
                'status',
                'two_factor_enabled',
                'created_at',
                'updated_at',
            ]);

        if ($request->filled('search')) {
            $search = trim((string) $request->input('search'));

            $query->where(function ($q) use ($search) {
                $q->where('uid', 'ilike', "%{$search}%")
                    ->orWhere('email', 'ilike', "%{$search}%")
                    ->orWhere('name', 'ilike', "%{$search}%")
                    ->orWhere('phone', 'ilike', "%{$search}%");
            });
        }

        if ($request->filled('status')) {
            $query->where('status', $request->input('status'));
        }

        $users = $query->latest()->paginate(
            min(max((int) $request->input('per_page', 20), 1), 100)
        );

        return response()->json($users);
    }

    public function show(User $user): JsonResponse
    {
        $user->load('roles:id,name,slug');

        return response()->json([
            'data' => $user,
        ]);
    }

    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'email' => ['required', 'email', 'max:255', 'unique:users,email'],
            'name' => ['nullable', 'string', 'max:150'],
            'phone' => ['nullable', 'string', 'max:30'],
            'address' => ['nullable', 'string'],
            'password' => ['required', 'string', 'min:8'],
            'status' => ['nullable', Rule::in([
                'INVITED',
                'ACTIVE',
                'INACTIVE',
                'SUSPENDED',
                'LOCKED',
            ])],
            'role_id' => ['nullable', 'uuid', 'exists:roles,id'],
        ]);

        $user = DB::transaction(function () use ($validated) {
            do {
                $uid = 'BFF-' . strtoupper(Str::random(10));
            } while (User::where('uid', $uid)->exists());

            $user = User::create([
                'uid' => $uid,
                'email' => $validated['email'],
                'name' => $validated['name'] ?? null,
                'phone' => $validated['phone'] ?? null,
                'address' => $validated['address'] ?? null,
                'password' => Hash::make($validated['password']),
                'status' => $validated['status'] ?? 'ACTIVE',
            ]);

            if (!empty($validated['role_id'])) {
                $user->roles()->sync([$validated['role_id']]);
            }

            return $user->load('roles:id,name,slug');
        });

        return response()->json([
            'message' => 'User created successfully.',
            'data' => $user,
        ], 201);
    }

    public function update(Request $request, User $user): JsonResponse
    {
        $validated = $request->validate([
            'email' => [
                'required',
                'email',
                'max:255',
                Rule::unique('users', 'email')->ignore($user->id),
            ],
            'name' => ['nullable', 'string', 'max:150'],
            'phone' => ['nullable', 'string', 'max:30'],
            'address' => ['nullable', 'string'],
            'password' => ['nullable', 'string', 'min:8'],
            'status' => ['required', Rule::in([
                'INVITED',
                'ACTIVE',
                'INACTIVE',
                'SUSPENDED',
                'LOCKED',
            ])],
            'role_id' => ['nullable', 'uuid', 'exists:roles,id'],
        ]);

        DB::transaction(function () use ($validated, $user) {
            $data = [
                'email' => $validated['email'],
                'name' => $validated['name'] ?? null,
                'phone' => $validated['phone'] ?? null,
                'address' => $validated['address'] ?? null,
                'status' => $validated['status'],
            ];

            if (!empty($validated['password'])) {
                $data['password'] = Hash::make($validated['password']);
            }

            $user->update($data);

            if (array_key_exists('role_id', $validated)) {
                $user->roles()->sync(
                    $validated['role_id'] ? [$validated['role_id']] : []
                );
            }
        });

        $user->load('roles:id,name,slug');

        return response()->json([
            'message' => 'User updated successfully.',
            'data' => $user,
        ]);
    }

    public function destroy(User $user): JsonResponse
    {
        if ($user->id === optional(request()->user())->id) {
            return response()->json([
                'message' => 'You cannot delete your own account.',
            ], 422);
        }

        $user->update(['status' => 'INACTIVE']);
        $user->delete();

        return response()->json([
            'message' => 'User deleted successfully.',
        ]);
    }

    public function roles(): JsonResponse
    {
        return response()->json([
            'data' => Role::query()
                ->select(['id', 'name', 'slug'])
                ->orderBy('name')
                ->get(),
        ]);
    }
}
