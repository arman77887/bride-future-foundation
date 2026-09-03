'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { api } from '@/services/api';

interface Role {
  id: string;
  name: string;
  slug: string;
}

interface User {
  id: string;
  uid: string;
  email: string;
  name: string | null;
  phone: string | null;
  address: string | null;
  status: 'INVITED' | 'ACTIVE' | 'INACTIVE' | 'SUSPENDED' | 'LOCKED';
  two_factor_enabled: boolean;
  created_at: string;
  updated_at: string;
  roles: Role[];
}

interface UsersResponse {
  data: User[];
  current_page: number;
  last_page: number;
  total: number;
}

const emptyForm = {
  email: '',
  name: '',
  phone: '',
  address: '',
  password: '',
  status: 'ACTIVE' as User['status'],
  role_id: '',
};

const statuses: User['status'][] = [
  'INVITED',
  'ACTIVE',
  'INACTIVE',
  'SUSPENDED',
  'LOCKED',
];

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [roles, setRoles] = useState<Role[]>([]);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [loading, setLoading] = useState(false);
  const [loadingRoles, setLoadingRoles] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [page, setPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);
  const [total, setTotal] = useState(0);

  const isBn = useMemo(
    () =>
      typeof window !== 'undefined' &&
      window.location.pathname.split('/')[1] === 'bn',
    []
  );

  const fetchUsers = async (targetPage = page) => {
    setLoading(true);
    setError('');

    try {
      const response = await api.get<UsersResponse>('/users', {
        params: {
          page: targetPage,
          per_page: 20,
          search: search.trim() || undefined,
          status: statusFilter || undefined,
        },
      });

      setUsers(response.data.data || []);
      setPage(response.data.current_page || targetPage);
      setLastPage(response.data.last_page || 1);
      setTotal(response.data.total || 0);
    } catch (err: any) {
      setError(
        err?.response?.data?.message ||
          (isBn ? 'ইউজার তালিকা লোড করা যায়নি।' : 'Unable to load users.')
      );
    } finally {
      setLoading(false);
    }
  };

  const fetchRoles = async () => {
    setLoadingRoles(true);

    try {
      const response = await api.get<{ data: Role[] }>('/roles');
      setRoles(response.data.data || []);
    } catch (err: any) {
      setError(
        err?.response?.data?.message ||
          (isBn ? 'রোল তালিকা লোড করা যায়নি।' : 'Unable to load roles.')
      );
    } finally {
      setLoadingRoles(false);
    }
  };

  useEffect(() => {
    fetchRoles();
  }, []);

  useEffect(() => {
    fetchUsers(1);
  }, [search, statusFilter]);

  const updateField = (
    field: keyof typeof emptyForm,
    value: string
  ) => {
    setForm((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const resetForm = () => {
    setForm(emptyForm);
    setEditingId(null);
    setError('');
  };

  const handleEdit = (user: User) => {
    setEditingId(user.id);
    setForm({
      email: user.email || '',
      name: user.name || '',
      phone: user.phone || '',
      address: user.address || '',
      password: '',
      status: user.status,
      role_id: user.roles?.[0]?.id || '',
    });
    setError('');
    setSuccess('');

    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const payload: Record<string, unknown> = {
        email: form.email.trim(),
        name: form.name.trim() || null,
        phone: form.phone.trim() || null,
        address: form.address.trim() || null,
        status: form.status,
        role_id: form.role_id || null,
      };

      if (form.password.trim()) {
        payload.password = form.password;
      } else if (!editingId) {
        throw new Error(
          isBn
            ? 'নতুন ইউজারের জন্য password আবশ্যক।'
            : 'Password is required for a new user.'
        );
      }

      if (editingId) {
        await api.put(`/users/${editingId}`, payload);
        setSuccess(
          isBn
            ? 'ইউজার সফলভাবে আপডেট হয়েছে।'
            : 'User updated successfully.'
        );
      } else {
        await api.post('/users', payload);
        setSuccess(
          isBn
            ? 'ইউজার সফলভাবে তৈরি হয়েছে।'
            : 'User created successfully.'
        );
      }

      resetForm();
      await fetchUsers(editingId ? page : 1);
    } catch (err: any) {
      setError(
        err?.response?.data?.message ||
          err?.message ||
          (isBn ? 'ইউজার সংরক্ষণ করা যায়নি।' : 'Unable to save user.')
      );
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (user: User) => {
    const confirmed = window.confirm(
      isBn
        ? `"${user.name || user.email}" ইউজারটি মুছে ফেলতে চান?`
        : `Delete "${user.name || user.email}"?`
    );

    if (!confirmed) return;

    setLoading(true);
    setError('');
    setSuccess('');

    try {
      await api.delete(`/users/${user.id}`);

      setSuccess(
        isBn
          ? 'ইউজার সফলভাবে মুছে ফেলা হয়েছে।'
          : 'User deleted successfully.'
      );

      if (editingId === user.id) {
        resetForm();
      }

      await fetchUsers(users.length === 1 && page > 1 ? page - 1 : page);
    } catch (err: any) {
      setError(
        err?.response?.data?.message ||
          (isBn ? 'ইউজার মুছে ফেলা যায়নি।' : 'Unable to delete user.')
      );
    } finally {
      setLoading(false);
    }
  };

  const statusLabel = (status: User['status']) => {
    if (!isBn) return status;

    const labels: Record<User['status'], string> = {
      INVITED: 'আমন্ত্রিত',
      ACTIVE: 'সক্রিয়',
      INACTIVE: 'নিষ্ক্রিয়',
      SUSPENDED: 'স্থগিত',
      LOCKED: 'লকড',
    };

    return labels[status];
  };

  const statusClass = (status: User['status']) => {
    const classes: Record<User['status'], string> = {
      INVITED: 'bg-yellow-100 text-yellow-800',
      ACTIVE: 'bg-green-100 text-green-800',
      INACTIVE: 'bg-gray-100 text-gray-700',
      SUSPENDED: 'bg-orange-100 text-orange-800',
      LOCKED: 'bg-red-100 text-red-800',
    };

    return classes[status];
  };

  return (
    <div className="bff-page space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-brand-green">
          {isBn ? 'ইউজার ও রোল ব্যবস্থাপনা' : 'Users & Roles'}
        </h1>
        <p className="mt-1 text-gray-500">
          {isBn
            ? 'ইউজার, স্ট্যাটাস এবং রোল পরিচালনা করুন।'
            : 'Create, update, assign roles and manage user access.'}
        </p>
      </div>

      {error && (
        <div className="bff-fade rounded-lg border border-red-200 bg-red-50 p-4 text-red-700">
          {error}
        </div>
      )}

      {success && (
        <div className="bff-fade rounded-lg border border-green-200 bg-green-50 p-4 text-green-700">
          {success}
        </div>
      )}

      <form
        onSubmit={handleSubmit}
        className="bff-card rounded-xl border border-gray-100 bg-white p-6 shadow-sm"
      >
        <div className="mb-5 flex items-center justify-between">
          <h2 className="text-xl font-bold text-gray-900">
            {editingId
              ? isBn
                ? 'ইউজার সম্পাদনা'
                : 'Edit User'
              : isBn
                ? 'নতুন ইউজার'
                : 'Add User'}
          </h2>

          {editingId && (
            <button
              type="button"
              onClick={resetForm}
              className="bff-button text-sm font-medium text-gray-600 hover:text-gray-900"
            >
              {isBn ? 'এডিট বাতিল' : 'Cancel Edit'}
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              {isBn ? 'নাম' : 'Name'}
            </label>
            <input
              type="text"
              value={form.name}
              onChange={(e) => updateField('name', e.target.value)}
              className="mt-1 w-full rounded-md border border-gray-300 p-2.5 focus:border-brand-green focus:outline-none"
              placeholder={isBn ? 'পূর্ণ নাম' : 'Full name'}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Email
            </label>
            <input
              type="email"
              required
              value={form.email}
              onChange={(e) => updateField('email', e.target.value)}
              className="mt-1 w-full rounded-md border border-gray-300 p-2.5 focus:border-brand-green focus:outline-none"
              placeholder="user@example.com"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              {isBn ? 'ফোন' : 'Phone'}
            </label>
            <input
              type="text"
              value={form.phone}
              onChange={(e) => updateField('phone', e.target.value)}
              className="mt-1 w-full rounded-md border border-gray-300 p-2.5 focus:border-brand-green focus:outline-none"
              placeholder="+966..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              {isBn ? 'স্ট্যাটাস' : 'Status'}
            </label>
            <select
              value={form.status}
              onChange={(e) =>
                updateField('status', e.target.value)
              }
              className="mt-1 w-full rounded-md border border-gray-300 p-2.5"
            >
              {statuses.map((status) => (
                <option key={status} value={status}>
                  {statusLabel(status)}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              {isBn ? 'রোল' : 'Role'}
            </label>
            <select
              value={form.role_id}
              onChange={(e) =>
                updateField('role_id', e.target.value)
              }
              disabled={loadingRoles}
              className="mt-1 w-full rounded-md border border-gray-300 p-2.5 disabled:bg-gray-100"
            >
              <option value="">
                {loadingRoles
                  ? isBn
                    ? 'লোড হচ্ছে...'
                    : 'Loading...'
                  : isBn
                    ? 'রোল নির্বাচন করুন'
                    : 'Select role'}
              </option>
              {roles.map((role) => (
                <option key={role.id} value={role.id}>
                  {role.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              {isBn
                ? editingId
                  ? 'নতুন Password (ঐচ্ছিক)'
                  : 'Password'
                : editingId
                  ? 'New Password (optional)'
                  : 'Password'}
            </label>
            <input
              type="password"
              required={!editingId}
              minLength={8}
              value={form.password}
              onChange={(e) =>
                updateField('password', e.target.value)
              }
              className="mt-1 w-full rounded-md border border-gray-300 p-2.5"
              placeholder="••••••••"
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700">
              {isBn ? 'ঠিকানা' : 'Address'}
            </label>
            <textarea
              rows={3}
              value={form.address}
              onChange={(e) =>
                updateField('address', e.target.value)
              }
              className="mt-1 w-full rounded-md border border-gray-300 p-2.5"
              placeholder={
                isBn ? 'সম্পূর্ণ ঠিকানা' : 'Full address'
              }
            />
          </div>
        </div>

        <div className="mt-5 flex flex-wrap gap-3">
          <button
            type="submit"
            disabled={loading}
            className="bff-button rounded-lg bg-brand-green px-5 py-2.5 font-semibold text-white shadow-sm transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading
              ? isBn
                ? 'সংরক্ষণ হচ্ছে...'
                : 'Saving...'
              : editingId
                ? isBn
                  ? 'ইউজার আপডেট করুন'
                  : 'Update User'
                : isBn
                  ? 'ইউজার তৈরি করুন'
                  : 'Create User'}
          </button>

          {editingId && (
            <button
              type="button"
              onClick={resetForm}
              className="bff-button rounded-lg border border-gray-300 px-5 py-2.5 font-semibold text-gray-700 transition hover:bg-gray-50"
            >
              {isBn ? 'বাতিল' : 'Cancel'}
            </button>
          )}
        </div>
      </form>

      <div className="bff-card rounded-xl border border-gray-100 bg-white p-6 shadow-sm">
        <div className="mb-5 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="text-xl font-bold text-gray-900">
              {isBn ? 'ইউজার তালিকা' : 'User List'}
            </h2>
            <p className="text-sm text-gray-500">
              {isBn ? `মোট ${total} জন` : `${total} total users`}
            </p>
          </div>

          <div className="flex flex-col gap-2 sm:flex-row">
            <input
              type="search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder={
                isBn
                  ? 'UID, নাম, ইমেইল বা ফোন দিয়ে খুঁজুন...'
                  : 'Search UID, name, email or phone...'
              }
              className="bff-button w-full rounded-md border border-gray-300 px-3 py-2 text-sm sm:w-72"
            />

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="rounded-md border border-gray-300 px-3 py-2 text-sm"
            >
              <option value="">
                {isBn ? 'সব স্ট্যাটাস' : 'All statuses'}
              </option>
              {statuses.map((status) => (
                <option key={status} value={status}>
                  {statusLabel(status)}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead>
              <tr className="text-left text-xs font-semibold uppercase tracking-wider text-gray-500">
                <th className="px-3 py-3">UID</th>
                <th className="px-3 py-3">
                  {isBn ? 'ইউজার' : 'User'}
                </th>
                <th className="px-3 py-3">
                  {isBn ? 'ফোন' : 'Phone'}
                </th>
                <th className="px-3 py-3">
                  {isBn ? 'রোল' : 'Role'}
                </th>
                <th className="px-3 py-3">
                  {isBn ? 'স্ট্যাটাস' : 'Status'}
                </th>
                <th className="px-3 py-3">
                  {isBn ? '2FA' : '2FA'}
                </th>
                <th className="px-3 py-3 text-right">
                  {isBn ? 'অ্যাকশন' : 'Actions'}
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-100">
              {loading && users.length === 0 ? (
                <tr>
                  <td
                    colSpan={7}
                    className="px-3 py-10 text-center text-gray-500"
                  >
                    {isBn ? 'লোড হচ্ছে...' : 'Loading users...'}
                  </td>
                </tr>
              ) : users.length === 0 ? (
                <tr>
                  <td
                    colSpan={7}
                    className="px-3 py-10 text-center text-gray-500"
                  >
                    {isBn
                      ? 'কোনো ইউজার পাওয়া যায়নি।'
                      : 'No users found.'}
                  </td>
                </tr>
              ) : (
                users.map((user) => (
                  <tr
                    key={user.id}
                    className="transition hover:bg-gray-50"
                  >
                    <td className="whitespace-nowrap px-3 py-4 text-sm font-medium text-brand-green">
                      {user.uid}
                    </td>

                    <td className="px-3 py-4">
                      <div className="font-medium text-gray-900">
                        {user.name || '—'}
                      </div>
                      <div className="text-sm text-gray-500">
                        {user.email}
                      </div>
                    </td>

                    <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-600">
                      {user.phone || '—'}
                    </td>

                    <td className="px-3 py-4">
                      <div className="flex flex-wrap gap-1">
                        {user.roles?.length ? (
                          user.roles.map((role) => (
                            <span
                              key={role.id}
                              className="rounded-full bg-blue-50 px-2 py-1 text-xs font-medium text-blue-700"
                            >
                              {role.name}
                            </span>
                          ))
                        ) : (
                          <span className="text-sm text-gray-400">
                            —
                          </span>
                        )}
                      </div>
                    </td>

                    <td className="whitespace-nowrap px-3 py-4">
                      <span
                        className={`rounded-full px-2.5 py-1 text-xs font-semibold ${statusClass(user.status)}`}
                      >
                        {statusLabel(user.status)}
                      </span>
                    </td>

                    <td className="whitespace-nowrap px-3 py-4 text-sm">
                      {user.two_factor_enabled ? (
                        <span className="font-semibold text-green-700">
                          ON
                        </span>
                      ) : (
                        <span className="text-gray-400">OFF</span>
                      )}
                    </td>

                    <td className="whitespace-nowrap px-3 py-4 text-right">
                      <div className="flex justify-end gap-2">
                        <button
                          type="button"
                          onClick={() => handleEdit(user)}
                          className="bff-button rounded-md border border-gray-300 px-3 py-1.5 text-sm font-medium text-gray-700 transition hover:bg-gray-50"
                        >
                          {isBn ? 'এডিট' : 'Edit'}
                        </button>

                        <button
                          type="button"
                          onClick={() => handleDelete(user)}
                          disabled={loading}
                          className="bff-button rounded-md bg-red-600 px-3 py-1.5 text-sm font-medium text-white transition hover:bg-red-700 disabled:opacity-50"
                        >
                          {isBn ? 'ডিলিট' : 'Delete'}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {lastPage > 1 && (
          <div className="mt-5 flex items-center justify-between border-t border-gray-100 pt-4">
            <button
              type="button"
              disabled={page <= 1 || loading}
              onClick={() => fetchUsers(page - 1)}
              className="bff-button rounded-md border border-gray-300 px-4 py-2 text-sm font-medium disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isBn ? '← আগের' : '← Previous'}
            </button>

            <span className="text-sm text-gray-500">
              {isBn
                ? `পৃষ্ঠা ${page} / ${lastPage}`
                : `Page ${page} / ${lastPage}`}
            </span>

            <button
              type="button"
              disabled={page >= lastPage || loading}
              onClick={() => fetchUsers(page + 1)}
              className="bff-button rounded-md border border-gray-300 px-4 py-2 text-sm font-medium disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isBn ? 'পরের →' : 'Next →'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
