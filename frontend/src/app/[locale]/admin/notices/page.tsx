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
  const [formOpen, setFormOpen] = useState(false);
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);

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
    setFormOpen(true);
    setOpenMenuId(null);

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
      setFormOpen(false);
      setOpenMenuId(null);
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
      <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
        <div className="flex flex-col gap-5 p-6 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <span className="inline-flex rounded-full bg-emerald-50 px-3 py-1 text-xs font-bold uppercase tracking-wider text-emerald-700">
              Content Management
            </span>

            <h1 className="mt-3 text-2xl font-black text-gray-950 sm:text-3xl">
              Notice Management
            </h1>

            <p className="mt-2 text-sm text-gray-500">
              Create and manage foundation notices and announcements.
            </p>
          </div>

          <button
            type="button"
            onClick={() => {
              resetForm();
              setFormOpen(true);
              setOpenMenuId(null);
            }}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-700 px-5 py-3 text-sm font-bold text-white shadow-sm transition hover:bg-emerald-800"
          >
            <span className="text-xl leading-none">+</span>
            Add New Notice
          </button>
        </div>
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

      {formOpen && (
        <div>
      <form
        onSubmit={saveNotice}
        className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm sm:p-7"
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
              onClick={() => {
                resetForm();
                setFormOpen(false);
                setOpenMenuId(null);
              }}
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
              onClick={() => {
                resetForm();
                setFormOpen(false);
                setOpenMenuId(null);
              }}
              className="rounded-lg border border-gray-300 px-5 py-2.5 text-sm font-semibold text-gray-700 hover:bg-gray-50"
            >
              Clear
            </button>
          )}
        </div>
      </form>
        </div>
      )}

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
            <table className="min-w-full">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50/80">
                  <th className="w-20 px-6 py-3.5 text-left text-xs font-bold uppercase tracking-wider text-gray-400">
                    #
                  </th>
                  <th className="w-28 px-4 py-3.5 text-left text-xs font-bold uppercase tracking-wider text-gray-400">
                    Image
                  </th>
                  <th className="px-4 py-3.5 text-left text-xs font-bold uppercase tracking-wider text-gray-400">
                    Notice
                  </th>
                  <th className="px-4 py-3.5 text-left text-xs font-bold uppercase tracking-wider text-gray-400">
                    Expires
                  </th>
                  <th className="px-4 py-3.5 text-left text-xs font-bold uppercase tracking-wider text-gray-400">
                    Status
                  </th>
                  <th className="w-20 px-6 py-3.5 text-right text-xs font-bold uppercase tracking-wider text-gray-400">
                    Action
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-gray-100">
                {items.map((item, index) => (
                  <tr
                    key={item.id}
                    className="group transition hover:bg-gray-50/80"
                  >
                    <td className="px-6 py-4">
                      <span className="inline-flex h-8 min-w-8 items-center justify-center rounded-lg bg-gray-100 px-2 text-xs font-bold text-gray-500">
                        {String(index + 1).padStart(2, '0')}
                      </span>
                    </td>

                    <td className="px-4 py-4">
                      {item.cover_image_url ? (
                        <img
                          src={item.cover_image_url}
                          alt={item.title_en || item.title_bn}
                          className="h-14 w-20 rounded-xl border border-gray-100 object-cover shadow-sm"
                        />
                      ) : (
                        <div className="flex h-14 w-20 items-center justify-center rounded-xl border border-dashed border-gray-200 bg-gray-50 text-[10px] font-medium text-gray-400">
                          No image
                        </div>
                      )}
                    </td>

                    <td className="px-4 py-4">
                      <div className="max-w-xl">
                        <p className="font-bold text-gray-900">
                          {item.title_en || 'Untitled'}
                        </p>
                        <p className="mt-1 line-clamp-1 text-sm text-gray-500">
                          {item.title_bn || '—'}
                        </p>
                      </div>
                    </td>

                    <td className="px-4 py-4 text-sm font-medium text-gray-600">
                      {item.expires_at
                        ? new Date(item.expires_at).toLocaleString()
                        : 'No expiry'}
                    </td>

                    <td className="px-4 py-4">
                      <span
                        className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-bold ${
                          item.status === 'PUBLISHED'
                            ? 'bg-emerald-50 text-emerald-700'
                            : item.status === 'ARCHIVED'
                              ? 'bg-gray-100 text-gray-600'
                              : 'bg-amber-50 text-amber-700'
                        }`}
                      >
                        <span
                          className={`h-1.5 w-1.5 rounded-full ${
                            item.status === 'PUBLISHED'
                              ? 'bg-emerald-500'
                              : item.status === 'ARCHIVED'
                                ? 'bg-gray-400'
                                : 'bg-amber-500'
                          }`}
                        />
                        {item.status || 'DRAFT'}
                      </span>
                    </td>

                    <td className="relative px-6 py-4 text-right">
                      <button
                        type="button"
                        aria-label="Notice actions"
                        onClick={() =>
                          setOpenMenuId((current) =>
                            current === item.id ? null : item.id
                          )
                        }
                        className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-gray-200 bg-white text-xl font-bold leading-none text-gray-500 shadow-sm transition hover:bg-gray-50 hover:text-gray-900"
                      >
                        ⋮
                      </button>

                      {openMenuId === item.id && (
                        <>
                          <button
                            type="button"
                            aria-label="Close actions menu"
                            onClick={() => setOpenMenuId(null)}
                            className="fixed inset-0 z-20 cursor-default"
                          />

                          <div className="absolute right-6 top-14 z-30 w-44 overflow-hidden rounded-xl border border-gray-200 bg-white p-1.5 text-left shadow-xl">
                            <button
                              type="button"
                              onClick={() => editNotice(item)}
                              className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-semibold text-gray-700 transition hover:bg-gray-50"
                            >
                              <span>✎</span>
                              Edit
                            </button>

                            <div className="my-1 border-t border-gray-100" />

                            <button
                              type="button"
                              onClick={() => {
                                setOpenMenuId(null);
                                deleteNotice(item.id);
                              }}
                              className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-semibold text-red-600 transition hover:bg-red-50"
                            >
                              <span>⌫</span>
                              Delete
                            </button>
                          </div>
                        </>
                      )}
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
