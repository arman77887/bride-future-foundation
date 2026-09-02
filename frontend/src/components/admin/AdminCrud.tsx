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
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [editing, setEditing] = useState<any | null>(null);
  const [showForm, setShowForm] = useState(false);

  const emptyForm = Object.fromEntries(
    fields.map((field) => [field, ''])
  );

  const [form, setForm] = useState<any>(emptyForm);

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
    setEditing(null);
    setForm(emptyForm);
    setMessage('');
    setError('');
    setShowForm(true);
  };

  const startEdit = (item: any) => {
    setEditing(item);

    const nextForm: any = {};

    fields.forEach((field) => {
      nextForm[field] =
        item?.[field] ??
        '';
    });

    setForm(nextForm);
    setMessage('');
    setError('');
    setShowForm(true);
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();

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
    if (!window.confirm('Are you sure you want to delete this item?')) {
      return;
    }

    try {
      setError('');
      await api.delete(`${endpoint}/${id}`);
      setMessage('Deleted successfully.');
      await load();
    } catch (err: any) {
      setError(
        err?.response?.data?.message ||
        err?.message ||
        'Delete failed.'
      );
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
            className="rounded-lg bg-emerald-600 px-5 py-3 text-sm font-semibold text-white hover:bg-emerald-700"
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
              className="text-gray-500 hover:text-gray-900"
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
                  rows={field.includes('description') || field.includes('content') ? 4 : 2}
                  className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
                />
              </div>
            ))}
          </div>

          <div className="mt-6 flex gap-3">
            <button
              type="submit"
              disabled={saving}
              className="rounded-lg bg-emerald-600 px-6 py-3 text-sm font-semibold text-white hover:bg-emerald-700 disabled:opacity-50"
            >
              {saving
                ? 'Saving...'
                : editing
                  ? 'Update'
                  : 'Create'}
            </button>

            <button
              type="button"
              onClick={() => setShowForm(false)}
              className="rounded-lg border border-gray-300 px-6 py-3 text-sm font-semibold text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      <div className="overflow-hidden rounded-xl bg-white shadow-sm">
        {loading ? (
          <div className="p-8 text-center text-gray-500">
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
                  <tr key={item.id || index} className="hover:bg-gray-50">
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
                            className="rounded-md bg-blue-50 px-3 py-2 text-xs font-semibold text-blue-700 hover:bg-blue-100"
                          >
                            Edit
                          </button>
                        )}

                        {deleteEnabled && item.id && (
                          <button
                            type="button"
                            onClick={() => remove(item.id)}
                            className="rounded-md bg-red-50 px-3 py-2 text-xs font-semibold text-red-700 hover:bg-red-100"
                          >
                            Delete
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
