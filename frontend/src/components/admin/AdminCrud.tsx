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
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);

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
    setOpenMenuId(null);
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
    setOpenMenuId(null);
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
      <section className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
        <div className="flex flex-col gap-5 p-6 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <span className="inline-flex rounded-full bg-emerald-50 px-3 py-1 text-xs font-bold uppercase tracking-wider text-emerald-700">
              Content Management
            </span>

            <h1 className="mt-3 text-2xl font-black text-gray-950 sm:text-3xl">
              {title}
            </h1>

            <p className="mt-2 text-sm text-gray-500">
              {titleBn}
            </p>
          </div>

          {createEnabled && (
            <button
              type="button"
              onClick={startCreate}
              disabled={saving || Boolean(deletingId)}
              className={`${buttonBase} inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-700 px-5 py-3 text-sm font-bold text-white shadow-sm hover:bg-emerald-800`}
            >
              <span className="text-xl leading-none">+</span>
              Add New
            </button>
          )}
        </div>
      </section>

      {message && (
        <div className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-700">
          {message}
        </div>
      )}

      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
          {error}
        </div>
      )}

      {showForm && (
        <form
          onSubmit={submit}
          className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm sm:p-7"
        >
          <div className="mb-6 flex items-start justify-between gap-4">
            <div>
              <h2 className="text-xl font-black text-gray-900">
                {editing ? `Edit ${title}` : `Add New ${title}`}
              </h2>

              <p className="mt-1 text-sm text-gray-500">
                {editing
                  ? 'Update the selected record.'
                  : 'Enter the information below to create a new record.'}
              </p>
            </div>

            <button
              type="button"
              onClick={() => {
                setShowForm(false);
                setEditing(null);
                setOpenMenuId(null);
              }}
              disabled={saving}
              aria-label="Close"
              className={`${buttonBase} inline-flex h-10 w-10 items-center justify-center rounded-xl border border-gray-200 text-gray-500 hover:bg-gray-50`}
            >
              ✕
            </button>
          </div>

          <div className="grid gap-5 md:grid-cols-2">
            {fields.map((field) => (
              <div
                key={field}
                className={
                  field.includes('description') ||
                  field.includes('content')
                    ? 'md:col-span-2'
                    : ''
                }
              >
                <label className="mb-2 block text-sm font-semibold capitalize text-gray-700">
                  {field.replace(/_/g, ' ')}
                </label>

                {field.includes('description') ||
                field.includes('content') ? (
                  <textarea
                    value={form[field] ?? ''}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        [field]: e.target.value,
                      })
                    }
                    disabled={saving}
                    rows={5}
                    className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-sm outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 disabled:bg-gray-50"
                  />
                ) : (
                  <input
                    value={form[field] ?? ''}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        [field]: e.target.value,
                      })
                    }
                    disabled={saving}
                    className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-sm outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 disabled:bg-gray-50"
                  />
                )}
              </div>
            ))}
          </div>

          <div className="mt-6 flex flex-wrap gap-3">
            <button
              type="submit"
              disabled={saving}
              className={`${buttonBase} inline-flex min-w-[120px] items-center justify-center gap-2 rounded-xl bg-emerald-700 px-6 py-3 text-sm font-bold text-white hover:bg-emerald-800`}
            >
              {saving && (
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
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
              onClick={() => {
                setShowForm(false);
                setEditing(null);
                setOpenMenuId(null);
              }}
              disabled={saving}
              className={`${buttonBase} rounded-xl border border-gray-300 bg-white px-6 py-3 text-sm font-semibold text-gray-700 hover:bg-gray-50`}
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      <section className="overflow-visible rounded-2xl border border-gray-200 bg-white shadow-sm">
        <div className="border-b border-gray-100 px-6 py-5">
          <h2 className="text-lg font-bold text-gray-900">
            Existing Records
          </h2>

          <p className="mt-1 text-xs text-gray-500">
            {items.length} record{items.length === 1 ? '' : 's'}
          </p>
        </div>

        {loading ? (
          <div className="flex items-center justify-center gap-3 p-10 text-sm text-gray-500">
            <span className="h-5 w-5 animate-spin rounded-full border-2 border-gray-300 border-t-emerald-600" />
            Loading...
          </div>
        ) : items.length === 0 ? (
          <div className="p-10 text-center">
            <p className="font-semibold text-gray-700">No records found.</p>
            <p className="mt-1 text-sm text-gray-500">
              Use the Add New button to create the first record.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50/80">
                  <th className="w-20 px-6 py-3.5 text-left text-xs font-bold uppercase tracking-wider text-gray-400">
                    #
                  </th>

                  {fields.slice(0, 4).map((field) => (
                    <th
                      key={field}
                      className="px-4 py-3.5 text-left text-xs font-bold uppercase tracking-wider text-gray-400"
                    >
                      {field.replace(/_/g, ' ')}
                    </th>
                  ))}

                  <th className="w-20 px-6 py-3.5 text-right text-xs font-bold uppercase tracking-wider text-gray-400">
                    Action
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-gray-100">
                {items.map((item, index) => {
                  const menuKey = String(item.id ?? index);

                  return (
                    <tr
                      key={menuKey}
                      className="transition hover:bg-gray-50/80"
                    >
                      <td className="px-6 py-4">
                        <span className="inline-flex h-8 min-w-8 items-center justify-center rounded-lg bg-gray-100 px-2 text-xs font-bold text-gray-500">
                          {String(index + 1).padStart(2, '0')}
                        </span>
                      </td>

                      {fields.slice(0, 4).map((field) => (
                        <td
                          key={field}
                          className="max-w-xs px-4 py-4 text-sm text-gray-700"
                        >
                          <div className="max-w-xs truncate">
                            {String(item?.[field] ?? '—')}
                          </div>
                        </td>
                      ))}

                      <td className="relative px-6 py-4 text-right">
                        {(updateEnabled || deleteEnabled) && item.id && (
                          <>
                            <button
                              type="button"
                              aria-label="Record actions"
                              onClick={() =>
                                setOpenMenuId((current) =>
                                  current === menuKey ? null : menuKey
                                )
                              }
                              className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-gray-200 bg-white text-xl font-bold leading-none text-gray-500 shadow-sm transition hover:bg-gray-50 hover:text-gray-900"
                            >
                              ⋮
                            </button>

                            {openMenuId === menuKey && (
                              <>
                                <button
                                  type="button"
                                  aria-label="Close actions"
                                  onClick={() => setOpenMenuId(null)}
                                  className="fixed inset-0 z-20 cursor-default"
                                />

                                <div className="absolute right-6 top-14 z-30 w-44 overflow-hidden rounded-xl border border-gray-200 bg-white p-1.5 text-left shadow-xl">
                                  {updateEnabled && (
                                    <button
                                      type="button"
                                      onClick={() => startEdit(item)}
                                      className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-semibold text-gray-700 transition hover:bg-gray-50"
                                    >
                                      <span>✎</span>
                                      Edit
                                    </button>
                                  )}

                                  {updateEnabled && deleteEnabled && (
                                    <div className="my-1 border-t border-gray-100" />
                                  )}

                                  {deleteEnabled && (
                                    <button
                                      type="button"
                                      onClick={() => {
                                        setOpenMenuId(null);
                                        remove(item.id);
                                      }}
                                      disabled={Boolean(deletingId)}
                                      className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-semibold text-red-600 transition hover:bg-red-50 disabled:opacity-50"
                                    >
                                      <span>⌫</span>
                                      {deletingId === item.id
                                        ? 'Deleting...'
                                        : 'Delete'}
                                    </button>
                                  )}
                                </div>
                              </>
                            )}
                          </>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}
