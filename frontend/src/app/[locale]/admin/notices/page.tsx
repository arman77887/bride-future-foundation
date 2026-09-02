'use client';

import React, { useEffect, useState } from 'react';
import MediaPicker from '@/components/admin/MediaPicker';
import api from '@/services/api';

interface NoticeItem {
  id: string;
  title_bn: string;
  title_en: string;
  content_bn: string;
  content_en: string;
  expires_at?: string | null;
  status: string;
  cover_media_id?: string | null;
  cover_image_url?: string | null;
}

interface NoticeForm {
  title_bn: string;
  title_en: string;
  content_bn: string;
  content_en: string;
  expires_at: string;
  status: string;
  cover_media_id: string | null;
}

const emptyForm: NoticeForm = {
  title_bn: '',
  title_en: '',
  content_bn: '',
  content_en: '',
  expires_at: '',
  status: 'DRAFT',
  cover_media_id: null,
};

export default function NoticesPage() {
  const [items, setItems] = useState<NoticeItem[]>([]);
  const [form, setForm] = useState<NoticeForm>(emptyForm);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const loadNotices = async () => {
    try {
      setLoading(true);
      setError('');

      const response = await api.get('/notices');
      const payload = response?.data?.data;

      if (Array.isArray(payload)) {
        setItems(payload);
      } else if (Array.isArray(payload?.data)) {
        setItems(payload.data);
      } else {
        setItems([]);
      }
    } catch (err: any) {
      setError(
        err?.response?.data?.message ||
          err?.message ||
          'Failed to load notices.'
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadNotices();
  }, []);

  const updateField = (
    field: keyof NoticeForm,
    value: string | null
  ) => {
    setForm((current) => ({
      ...current,
      [field]: value,
    }));
  };

  const resetForm = () => {
    setForm(emptyForm);
    setEditingId(null);
  };

  const editNotice = (item: NoticeItem) => {
    setEditingId(item.id);

    setForm({
      title_bn: item.title_bn || '',
      title_en: item.title_en || '',
      content_bn: item.content_bn || '',
      content_en: item.content_en || '',
      expires_at: item.expires_at
        ? item.expires_at.slice(0, 16)
        : '',
      status: item.status || 'DRAFT',
      cover_media_id: item.cover_media_id || null,
    });

    setMessage('');
    setError('');

    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  const saveNotice = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      setSaving(true);
      setMessage('');
      setError('');

      const payload = {
        ...form,
        expires_at: form.expires_at || null,
        cover_media_id: form.cover_media_id || null,
      };

      if (editingId) {
        await api.put(`/notices/${editingId}`, payload);
        setMessage('Notice updated successfully.');
      } else {
        await api.post('/notices', payload);
        setMessage('Notice created successfully.');
      }

      resetForm();
      await loadNotices();
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
            'Failed to save notice.'
        );
      }
    } finally {
      setSaving(false);
    }
  };

  const deleteNotice = async (id: string) => {
    if (
      !window.confirm(
        'Are you sure you want to delete this notice?'
      )
    ) {
      return;
    }

    try {
      setError('');
      setMessage('');

      await api.delete(`/notices/${id}`);

      setMessage('Notice deleted successfully.');

      if (editingId === id) {
        resetForm();
      }

      await loadNotices();
    } catch (err: any) {
      setError(
        err?.response?.data?.message ||
          err?.message ||
          'Failed to delete notice.'
      );
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">
          Notice Management
        </h1>

        <p className="mt-1 text-sm text-gray-600">
          Create, edit, delete and manage notice cover images.
        </p>
      </div>

      {(message || error) && (
        <div
          className={`rounded-lg border px-4 py-3 text-sm ${
            error
              ? 'border-red-200 bg-red-50 text-red-700'
              : 'border-green-200 bg-green-50 text-green-700'
          }`}
        >
          {error || message}
        </div>
      )}

      <form
        onSubmit={saveNotice}
        className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm"
      >
        <div className="mb-6 flex items-center justify-between gap-4">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">
              {editingId ? 'Edit Notice' : 'Create Notice'}
            </h2>

            <p className="text-sm text-gray-500">
              {editingId
                ? 'Update the selected notice.'
                : 'Add a new notice.'}
            </p>
          </div>

          {editingId && (
            <button
              type="button"
              onClick={resetForm}
              className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              Cancel Edit
            </button>
          )}
        </div>

        <div className="grid gap-5 md:grid-cols-2">
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">
              Title (Bangla)
            </label>

            <input
              value={form.title_bn}
              onChange={(e) =>
                updateField('title_bn', e.target.value)
              }
              required
              className="w-full rounded-lg border border-gray-300 px-3 py-2.5 outline-none focus:border-emerald-500"
              placeholder="নোটিশের শিরোনাম"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">
              Title (English)
            </label>

            <input
              value={form.title_en}
              onChange={(e) =>
                updateField('title_en', e.target.value)
              }
              required
              className="w-full rounded-lg border border-gray-300 px-3 py-2.5 outline-none focus:border-emerald-500"
              placeholder="Notice title"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">
              Status
            </label>

            <select
              value={form.status}
              onChange={(e) =>
                updateField('status', e.target.value)
              }
              className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 outline-none focus:border-emerald-500"
            >
              <option value="DRAFT">Draft</option>
              <option value="PUBLISHED">Published</option>
              <option value="ARCHIVED">Archived</option>
            </select>
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">
              Expires At
            </label>

            <input
              type="datetime-local"
              value={form.expires_at}
              onChange={(e) =>
                updateField('expires_at', e.target.value)
              }
              className="w-full rounded-lg border border-gray-300 px-3 py-2.5 outline-none focus:border-emerald-500"
            />

            <p className="mt-1 text-xs text-gray-500">
              Optional. Leave empty if the notice does not expire.
            </p>
          </div>

          <div className="md:col-span-2">
            <label className="mb-2 block text-sm font-medium text-gray-700">
              Content (Bangla)
            </label>

            <textarea
              value={form.content_bn}
              onChange={(e) =>
                updateField('content_bn', e.target.value)
              }
              rows={9}
              required
              className="w-full rounded-lg border border-gray-300 px-3 py-2.5 outline-none focus:border-emerald-500"
              placeholder="নোটিশের বিস্তারিত内容"
            />
          </div>

          <div className="md:col-span-2">
            <label className="mb-2 block text-sm font-medium text-gray-700">
              Content (English)
            </label>

            <textarea
              value={form.content_en}
              onChange={(e) =>
                updateField('content_en', e.target.value)
              }
              rows={9}
              required
              className="w-full rounded-lg border border-gray-300 px-3 py-2.5 outline-none focus:border-emerald-500"
              placeholder="Full notice content"
            />
          </div>

          <MediaPicker
            value={form.cover_media_id}
            existingUrl={
              editingId
                ? items.find((item) => item.id === editingId)?.cover_image_url || null
                : null
            }
            onChange={(mediaId) =>
              updateField('cover_media_id', mediaId)
            }
            label="Notice Cover Image"
          />
        </div>

        <div className="mt-6 flex gap-3">
          <button
            type="submit"
            disabled={saving}
            className="rounded-lg bg-emerald-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {saving
              ? 'Saving...'
              : editingId
                ? 'Update Notice'
                : 'Create Notice'}
          </button>

          {editingId && (
            <button
              type="button"
              onClick={resetForm}
              className="rounded-lg border border-gray-300 px-5 py-2.5 text-sm font-semibold text-gray-700 hover:bg-gray-50"
            >
              Clear
            </button>
          )}
        </div>
      </form>

      <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
        <div className="border-b border-gray-200 px-6 py-4">
          <h2 className="text-lg font-semibold text-gray-900">
            Existing Notices
          </h2>
        </div>

        {loading ? (
          <div className="p-6 text-sm text-gray-500">
            Loading notices...
          </div>
        ) : items.length === 0 ? (
          <div className="p-6 text-sm text-gray-500">
            No notices found.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                    Image
                  </th>

                  <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                    Notice
                  </th>

                  <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                    Expires
                  </th>

                  <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                    Status
                  </th>

                  <th className="px-6 py-3 text-right text-xs font-semibold uppercase tracking-wide text-gray-500">
                    Actions
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-gray-200 bg-white">
                {items.map((item) => (
                  <tr key={item.id}>
                    <td className="px-6 py-4">
                      {item.cover_image_url ? (
                        <img
                          src={item.cover_image_url}
                          alt={item.title_en}
                          className="h-16 w-24 rounded-lg object-cover"
                        />
                      ) : (
                        <div className="flex h-16 w-24 items-center justify-center rounded-lg bg-gray-100 text-xs text-gray-400">
                          No image
                        </div>
                      )}
                    </td>

                    <td className="px-6 py-4">
                      <div className="font-medium text-gray-900">
                        {item.title_en}
                      </div>

                      <div className="mt-1 text-sm text-gray-500">
                        {item.title_bn}
                      </div>
                    </td>

                    <td className="px-6 py-4 text-sm text-gray-600">
                      {item.expires_at
                        ? new Date(
                            item.expires_at
                          ).toLocaleString()
                        : 'No expiry'}
                    </td>

                    <td className="px-6 py-4">
                      <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-semibold text-gray-700">
                        {item.status || 'DRAFT'}
                      </span>
                    </td>

                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end gap-2">
                        <button
                          type="button"
                          onClick={() => editNotice(item)}
                          className="rounded-lg bg-blue-50 px-3 py-2 text-xs font-semibold text-blue-700 hover:bg-blue-100"
                        >
                          Edit
                        </button>

                        <button
                          type="button"
                          onClick={() =>
                            deleteNotice(item.id)
                          }
                          className="rounded-lg bg-red-50 px-3 py-2 text-xs font-semibold text-red-700 hover:bg-red-100"
                        >
                          Delete
                        </button>
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
