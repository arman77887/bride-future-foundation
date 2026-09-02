'use client';

export default function UsersPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-900">
        Users & Roles
      </h1>

      <div className="rounded-xl border border-yellow-200 bg-yellow-50 p-6">
        <h2 className="text-lg font-semibold text-yellow-800">
          Backend API Required
        </h2>

        <p className="mt-2 text-sm text-yellow-700">
          User and role management UI is ready to be connected,
          but the backend currently has no /api/v1/users endpoint.
        </p>
      </div>
    </div>
  );
}
