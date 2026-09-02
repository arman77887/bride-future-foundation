'use client';

import React, { useEffect, useState } from 'react';
import api from '@/services/api';

interface MediaItem {
  id: string;
  filename: string;
  storage_key: string;
  url: string;
  mime_type: string;
  file_size: number;
  uploader_id: string;
  created_at: string;
}

export default function MediaPage() {
  const [items, setItems] = useState<MediaItem[]>([]);
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  const load = async () => {
    try {
      setLoading(true);
      setError('');

      const response = await api.get('/media');
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
        'Failed to load media.'
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const upload = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!file) {
      setError('Please select a file first.');
      return;
    }

    try {
      setUploading(true);
      setError('');
      setMessage('');

      const formData = new FormData();
      formData.append('file', file);

      await api.post('/media', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      setMessage('Media uploaded successfully.');
      setFile(null);

      const input = document.getElementById(
        'media-file'
      ) as HTMLInputElement | null;

      if (input) {
        input.value = '';
      }

      await load();
    } catch (err: any) {
      const validation = err?.response?.data?.errors;

      if (validation) {
        const first = Object.values(validation)
          .flat()
          .find(Boolean);

        setError(String(first || 'Upload validation failed.'));
      } else {
        setError(
          err?.response?.data?.message ||
          err?.message ||
          'Upload failed.'
        );
      }
    } finally {
      setUploading(false);
    }
  };

  const remove = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this media?')) {
      return;
    }

    try {
      setError('');
      setMessage('');

      await api.delete(`/media/${id}`);

      setMessage('Media deleted successfully.');
      await load();
    } catch (err: any) {
      setError(
        err?.response?.data?.message ||
        err?.message ||
        'Delete failed.'
      );
    }
  };

  const mediaBaseUrl =
    process.env.NEXT_PUBLIC_API_BASE_URL?.replace(/\/api\/v1\/?$/, '') ||
    'http://localhost:8000';

  const resolveMediaUrl = (url?: string | null) => {
    if (!url) return null;
    if (/^https?:\/\//i.test(url)) return url;
    return `${mediaBaseUrl}${url.startsWith('/') ? url : `/${url}`}`;
  };

  const formatSize = (bytes: number) => {
    if (!bytes) return '0 B';

    const units = ['B', 'KB', 'MB', 'GB'];
    const index = Math.min(
      Math.floor(Math.log(bytes) / Math.log(1024)),
      units.length - 1
    );

    return `${(bytes / Math.pow(1024, index)).toFixed(1)} ${units[index]}`;
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">
          Media Library
        </h1>

        <p className="mt-1 text-sm text-gray-500">
          মিডিয়া লাইব্রেরি — ছবি ও অন্যান্য ফাইল আপলোড এবং ব্যবস্থাপনা
        </p>
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

      <form
        onSubmit={upload}
        className="rounded-xl bg-white p-6 shadow-sm"
      >
        <h2 className="mb-4 text-xl font-bold text-gray-900">
          Upload Media
        </h2>

        <div className="flex flex-col gap-4 sm:flex-row sm:items-end">
          <div className="flex-1">
            <label
              htmlFor="media-file"
              className="mb-2 block text-sm font-medium text-gray-700"
            >
              Select file
            </label>

            <input
              id="media-file"
              type="file"
              accept=".jpg,.jpeg,.png,.pdf,.docx"
              onChange={(e) =>
                setFile(e.target.files?.[0] || null)
              }
              className="block w-full rounded-lg border border-gray-300 px-4 py-3 text-sm"
            />

            <p className="mt-2 text-xs text-gray-500">
              JPG, JPEG, PNG, PDF or DOCX — maximum 10 MB
            </p>
          </div>

          <button
            type="submit"
            disabled={uploading || !file}
            className="rounded-lg bg-emerald-600 px-6 py-3 text-sm font-semibold text-white hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {uploading ? 'Uploading...' : 'Upload'}
          </button>
        </div>
      </form>

      <div className="overflow-hidden rounded-xl bg-white shadow-sm">
        {loading ? (
          <div className="p-8 text-center text-gray-500">
            Loading media...
          </div>
        ) : items.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            No media found.
          </div>
        ) : (
          <div className="grid gap-6 p-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {items.map((item) => {
              const isImage =
                item.mime_type?.startsWith('image/');

              return (
                <div
                  key={item.id}
                  className="overflow-hidden rounded-xl border border-gray-200 bg-white"
                >
                  <div className="aspect-video bg-gray-100">
                    {isImage ? (
                      <img
                        src={resolveMediaUrl(item.url) || ''}
                        alt={item.filename}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center text-sm font-medium text-gray-500">
                        {item.mime_type || 'FILE'}
                      </div>
                    )}
                  </div>

                  <div className="p-4">
                    <p
                      className="truncate text-sm font-semibold text-gray-900"
                      title={item.filename}
                    >
                      {item.filename}
                    </p>

                    <p className="mt-1 text-xs text-gray-500">
                      {formatSize(item.file_size)}
                    </p>

                    <button
                      type="button"
                      onClick={() => remove(item.id)}
                      className="mt-4 rounded-md bg-red-50 px-3 py-2 text-xs font-semibold text-red-700 hover:bg-red-100"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
