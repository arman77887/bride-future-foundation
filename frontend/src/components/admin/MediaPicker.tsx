'use client';

import React, { useEffect, useState } from 'react';
import api from '@/services/api';

interface MediaItem {
  id: string;
  filename: string;
  url: string;
  mime_type: string;
  file_size: number;
}

interface MediaPickerProps {
  value?: string | null;
  existingUrl?: string | null;
  onChange: (mediaId: string | null) => void;
  label?: string;
  mediaType?: 'logo' | 'cover' | 'gallery';
  multiple?: boolean;
  selectedValues?: string[];
  onMultipleChange?: (ids: string[]) => void;
}

export default function MediaPicker({
  value,
  existingUrl = null,
  onChange,
  label = 'Cover Image',
  mediaType = 'cover',
  multiple = false,
  selectedValues = [],
  onMultipleChange,
}: MediaPickerProps) {
  const [items, setItems] = useState<MediaItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');

  const loadMedia = async () => {
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
    loadMedia();
  }, []);

  const upload = async (file: File) => {
    try {
      setUploading(true);
      setError('');

      const maxSize = 20 * 1024 * 1024;
      const maxSizeLabel = '20 MB';

      if (!['image/jpeg', 'image/png'].includes(file.type)) {
        throw new Error('Only JPG, JPEG or PNG images are allowed.');
      }

      if (file.size > maxSize) {
        throw new Error(`File is too large. Maximum size is ${maxSizeLabel}.`);
      }

      const image = new Image();
      const objectUrl = URL.createObjectURL(file);

      await new Promise<void>((resolve, reject) => {
        image.onload = () => resolve();
        image.onerror = () => reject(new Error('Could not read image dimensions.'));
        image.src = objectUrl;
      });

      URL.revokeObjectURL(objectUrl);

      if (mediaType !== 'gallery') {
        const ratio = image.width / image.height;
        const targetRatio = mediaType === 'logo' ? 1 : 16 / 9;
        const tolerance = 0.03;

        if (Math.abs(ratio - targetRatio) > tolerance) {
          throw new Error(
            mediaType === 'logo'
              ? 'Logo must use a 1:1 square ratio. Recommended: 512×512 px.'
              : 'Cover Photo must use a 16:9 ratio. Recommended: 1920×1080 px.'
          );
        }
      }

      const formData = new FormData();
      formData.append('file', file);

      const response = await api.post('/media', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      const uploaded = response?.data?.data;

      if (uploaded?.id) {
        await loadMedia();
        onChange(uploaded.id);
      } else {
        throw new Error('Invalid media response.');
      }
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

  const selected = items.find((item) => item.id === value);

  const mediaBaseUrl =
    process.env.NEXT_PUBLIC_API_BASE_URL?.replace(/\/api\/v1\/?$/, '') ||
    'http://localhost:8000';

  const resolveMediaUrl = (url?: string | null) => {
    if (!url) return null;
    if (/^https?:\/\//i.test(url)) return url;
    return `${mediaBaseUrl}${url.startsWith('/') ? url : `/${url}`}`;
  };

  const selectedUrl = resolveMediaUrl(selected?.url || existingUrl);
  const selectedFilename = selected?.filename || 'Current cover image';

  const images = items.filter((item) =>
    item.mime_type?.startsWith('image/')
  );

  const visibleImages =
    mediaType === 'gallery' && search.trim()
      ? images.filter((item) =>
          item.filename.toLowerCase().includes(search.trim().toLowerCase())
        )
      : images;



  return (
    <div className="md:col-span-2">
      <label className="mb-2 block text-sm font-medium text-gray-700">
        {label}
      </label>

      <div className="rounded-xl border border-gray-200 bg-gray-50 p-4">
        {selectedUrl && (
          <div className="mb-4 overflow-hidden rounded-lg border border-gray-200 bg-white">
            <img
              src={selectedUrl}
              alt={selectedFilename}
              className="h-48 w-full object-cover"
            />

            <div className="flex items-center justify-between gap-3 p-3">
              <span className="truncate text-sm font-medium text-gray-700">
                {selectedFilename}
              </span>

              <button
                type="button"
                onClick={() => onChange(null)}
                className="bff-button shrink-0 rounded-md bg-red-50 px-3 py-2 text-xs font-semibold text-red-700 transition-all duration-200 hover:-translate-y-0.5 hover:bg-red-100 active:scale-95"
              >
                Remove
              </button>
            </div>
          </div>
        )}

        <div className="mb-4">
          <p className="mb-2 text-xs text-gray-500">
            {mediaType === 'logo'
              ? 'Recommended: 512×512 px • 1:1 • JPG/PNG • Max 20 MB'
              : mediaType === 'gallery'
                ? 'Gallery image • Portrait, landscape or square • JPG/PNG • Max 20 MB'
                : 'Recommended: 1920×1080 px • 16:9 • JPG/PNG • Max 20 MB'}
          </p>

          <label
            htmlFor={`media-picker-upload-${mediaType}`}
            className="bff-button inline-flex cursor-pointer rounded-lg bg-emerald-600 px-4 py-2 text-sm font-semibold text-white transition-all duration-200 hover:-translate-y-0.5 hover:bg-emerald-700 active:scale-95"
          >
            {uploading ? 'Uploading...' : 'Upload New Image'}

            <input
              id={`media-picker-upload-${mediaType}`}
              type="file"
              accept=".jpg,.jpeg,.png"
              disabled={uploading}
              className="hidden"
              onChange={(e) => {
                const selectedFile = e.target.files?.[0];

                if (selectedFile) {
                  upload(selectedFile);
                }

                e.currentTarget.value = '';
              }}
            />
          </label>
        </div>

        {error && (
          <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
            {error}
          </div>
        )}

        {loading ? (
          <div className="rounded-xl border border-dashed border-gray-300 bg-white p-8 text-center text-sm text-gray-500">
            Loading images...
          </div>
        ) : images.length === 0 ? (
          <div className="rounded-xl border border-dashed border-gray-300 bg-white p-8 text-center">
            <p className="font-semibold text-gray-700">No images available</p>
            <p className="mt-1 text-sm text-gray-500">
              Upload an image above to add it to the Media Library.
            </p>
          </div>
        ) : (
          <>
            {mediaType === 'gallery' && (
              <div className="mb-4 rounded-xl border border-gray-200 bg-white p-4">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <h3 className="font-semibold text-gray-900">
                      Media Library
                    </h3>
                    <p className="mt-1 text-xs text-gray-500">
                      {images.length} image{images.length === 1 ? '' : 's'} available • {multiple ? `${selectedValues.length} selected` : 'Click an image to select it'}
                    </p>
                  </div>

                  <input
                    type="search"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Search images..."
                    className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 sm:w-72"
                  />
                </div>
              </div>
            )}

            {visibleImages.length === 0 ? (
              <div className="rounded-xl border border-dashed border-gray-300 bg-white p-8 text-center text-sm text-gray-500">
                No images match your search.
              </div>
            ) : (
              <div
                className={
                  mediaType === 'gallery'
                    ? 'grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5'
                    : 'grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5'
                }
              >
                {visibleImages.map((item) => {
                  const isSelected = multiple
                    ? selectedValues.includes(item.id)
                    : value === item.id;

                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => {
                        if (multiple && onMultipleChange) {
                          onMultipleChange(
                            isSelected
                              ? selectedValues.filter((id) => id !== item.id)
                              : [...selectedValues, item.id],
                          );
                          return;
                        }

                        onChange(item.id);
                      }}
                      aria-pressed={isSelected}
                      className={`group relative overflow-hidden rounded-xl border-2 bg-white text-left transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md active:scale-[0.98] ${
                        isSelected
                          ? 'border-emerald-500 ring-4 ring-emerald-100'
                          : 'border-gray-200 hover:border-emerald-300'
                      }`}
                    >
                      <div className={mediaType === 'gallery' ? 'aspect-square bg-gray-100' : 'h-24 bg-gray-100'}>
                        <img
                          src={resolveMediaUrl(item.url) || ''}
                          alt={item.filename}
                          loading="lazy"
                          className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
                        />
                      </div>

                      {isSelected && (
                        <div className="absolute right-2 top-2 rounded-full bg-emerald-600 px-2.5 py-1 text-xs font-bold text-white shadow">
                          ✓ Selected
                        </div>
                      )}

                      <div className="p-2.5">
                        <p
                          className="truncate text-xs font-medium text-gray-700"
                          title={item.filename}
                        >
                          {item.filename}
                        </p>
                      </div>
                    </button>
                  );
                })}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
