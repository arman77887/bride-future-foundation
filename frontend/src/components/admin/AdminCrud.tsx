'use client';

import React, { useEffect, useState } from 'react';
import api from '@/services/api';

interface AdminCrudProps {
  title: string;
  titleBn: string;
  endpoint: string;
  fields: string[];
  createEnabled?: boolean;
  updateEnabled?: boolean;
  deleteEnabled?: boolean;
}

export default function AdminCrud({
  title,
  titleBn,
  endpoint,
  fields,
  createEnabled = true,
  updateEnabled = true,
  deleteEnabled = true,
}: AdminCrudProps) {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [editing, setEditing] = useState<any | null>(null);
  const [showForm, setShowForm] = useState(false);

  const emptyForm = Object.fromEntries(
    fields.map((field) => [field, ''])
  );

  const [form, setForm] = useState<any>(emptyForm);

  const buttonBase =
    'transition-all duration-150 ease-out active:scale-[0.97] disabled:cursor-not-allowed disabled:opacity-60 disabled:active:scale-100';

  const load = async () => {
    try {
      setLoading(true);
      setError('');

      const response = await api.get(endpoint);
      const data = response?.data?.data;

      if (Array.isArray(data)) {
        setItems(data);
      } else if (Array.isArray(data?.data)) {
        setItems(data.data);
      } else {
        setItems([]);
      }
    } catch (err: any) {
      setError(
        err?.response?.data?.message ||
          err?.message ||
          'Failed to load data'
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, [endpoint]);

  const startCreate = () => {
    if (saving || deletingId) return;

    setEditing(null);
    setForm(emptyForm);
    setMessage('');
    setError('');
    setShowForm(true);
  };

  const startEdit = (item: any) => {
    if (saving || deletingId) return;

    setEditing(item);

    const nextForm: any = {};

    fields.forEach((field) => {
      nextForm[field] = item?.[field] ?? '';
    });

    setForm(nextForm);
    setMessage('');
    setError('');
    setShowForm(true);
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (saving) return;

    try {
      setSaving(true);
      setError('');
      setMessage('');

      if (editing) {
        await api.put(`${endpoint}/${editing.id}`, form);
        setMessage('Updated successfully.');
      } else {
        await api.post(endpoint, form);
        setMessage('Created successfully.');
      }

      setShowForm(false);
      setEditing(null);
      setForm(emptyForm);

      await load();
    } catch (err: any) {
      const validation = err?.response?.data?.errors;

      if (validation) {
        const first = Object.values(validation)
          .flat()
          .find(Boolean);

        setError(String(first || 'Validation failed.'));
      } else {
        setError(
          err?.response?.data?.message ||
            err?.message ||
            'Operation failed.'
        );
      }
    } finally {
      setSaving(false);
    }
  };

  const remove = async (id: string) => {
    if (deletingId || saving) return;

    if (!window.confirm('Are you sure you want to delete this item?')) {
      return;
    }

    try {
      setDeletingId(id);
      setError('');
      setMessage('');

      await api.delete(`${endpoint}/${id}`);

      setMessage('Deleted successfully.');
      await load();
    } catch (err: any) {
      setError(
        err?.response?.data?.message ||
          err?.message ||
          'Delete failed.'
      );
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            {title}
          </h1>

          <p className="mt-1 text-sm text-gray-500">
            {titleBn}
          </p>
        </div>

        {createEnabled && (
          <button
            type="button"
            onClick={startCreate}
            disabled={saving || Boolean(deletingId)}
            className={`${buttonBase} rounded-lg bg-emerald-600 px-5 py-3 text-sm font-semibold text-white shadow-sm hover:bg-emerald-700 hover:shadow-md`}
          >
            + Add {title}
          </button>
        )}
      </div>

      {message && (
        <div className="rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">
          {message}
        </div>
      )}

      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      {showForm && (
        <form
          onSubmit={submit}
          className="rounded-xl bg-white p-6 shadow-sm"
        >
          <div className="mb-6 flex items-center justify-between">
            <h2 className="text-xl font-bold text-gray-900">
              {editing ? `Edit ${title}` : `Create ${title}`}
            </h2>

            <button
              type="button"
              onClick={() => setShowForm(false)}
              disabled={saving}
              aria-label="Close"
              className={`${buttonBase} rounded-md px-2 py-1 text-xl text-gray-500 hover:bg-gray-100 hover:text-gray-900`}
            >
              ✕
            </button>
          </div>

          <div className="grid gap-5 md:grid-cols-2">
            {fields.map((field) => (
              <div key={field}>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  {field.replace(/_/g, ' ')}
                </label>

                <textarea
                  value={form[field] ?? ''}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      [field]: e.target.value,
                    })
                  }
                  disabled={saving}
                  rows={
                    field.includes('description') ||
                    field.includes('content')
                      ? 4
                      : 2
                  }
                  className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm outline-none transition duration-150 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 disabled:bg-gray-50"
                />
              </div>
            ))}
          </div>

          <div className="mt-6 flex gap-3">
            <button
              type="submit"
              disabled={saving}
              className={`${buttonBase} inline-flex min-w-[110px] items-center justify-center gap-2 rounded-lg bg-emerald-600 px-6 py-3 text-sm font-semibold text-white shadow-sm hover:bg-emerald-700 hover:shadow-md`}
            >
              {saving && (
                <span
                  className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white"
                  aria-hidden="true"
                />
              )}

              {saving
                ? editing
                  ? 'Updating...'
                  : 'Creating...'
                : editing
                  ? 'Update'
                  : 'Create'}
            </button>

            <button
              type="button"
              onClick={() => setShowForm(false)}
              disabled={saving}
              className={`${buttonBase} rounded-lg border border-gray-300 px-6 py-3 text-sm font-semibold text-gray-700 hover:bg-gray-50 hover:shadow-sm`}
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      <div className="overflow-hidden rounded-xl bg-white shadow-sm">
        {loading ? (
          <div className="flex items-center justify-center gap-3 p-8 text-gray-500">
            <span
              className="h-5 w-5 animate-spin rounded-full border-2 border-gray-300 border-t-emerald-600"
              aria-hidden="true"
            />
            Loading...
          </div>
        ) : items.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            No records found.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-semibold uppercase text-gray-500">
                    #
                  </th>

                  {fields.slice(0, 4).map((field) => (
                    <th
                      key={field}
                      className="px-6 py-4 text-left text-xs font-semibold uppercase text-gray-500"
                    >
                      {field.replace(/_/g, ' ')}
                    </th>
                  ))}

                  <th className="px-6 py-4 text-right text-xs font-semibold uppercase text-gray-500">
                    Actions
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-gray-100">
                {items.map((item, index) => (
                  <tr
                    key={item.id || index}
                    className="transition-colors duration-150 hover:bg-gray-50"
                  >
                    <td className="px-6 py-4 text-sm text-gray-500">
                      {index + 1}
                    </td>

                    {fields.slice(0, 4).map((field) => (
                      <td
                        key={field}
                        className="max-w-xs px-6 py-4 text-sm text-gray-700"
                      >
                        <div className="truncate">
                          {String(item?.[field] ?? '-')}
                        </div>
                      </td>
                    ))}

                    <td className="px-6 py-4">
                      <div className="flex justify-end gap-2">
                        {updateEnabled && item.id && (
                          <button
                            type="button"
                            onClick={() => startEdit(item)}
                            disabled={
                              saving ||
                              Boolean(deletingId)
                            }
                            className={`${buttonBase} rounded-md bg-blue-50 px-3 py-2 text-xs font-semibold text-blue-700 hover:bg-blue-100 hover:shadow-sm`}
                          >
                            Edit
                          </button>
                        )}

                        {deleteEnabled && item.id && (
                          <button
                            type="button"
                            onClick={() => remove(item.id)}
                            disabled={
                              saving ||
                              Boolean(deletingId)
                            }
                            className={`${buttonBase} inline-flex min-w-[68px] items-center justify-center gap-2 rounded-md bg-red-50 px-3 py-2 text-xs font-semibold text-red-700 hover:bg-red-100 hover:shadow-sm`}
                          >
                            {deletingId === item.id && (
                              <span
                                className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-red-300 border-t-red-700"
                                aria-hidden="true"
                              />
                            )}

                            {deletingId === item.id
                              ? 'Deleting...'
                              : 'Delete'}
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
