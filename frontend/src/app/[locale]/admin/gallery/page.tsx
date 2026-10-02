'use client';

import { useEffect, useState } from 'react';
import { api } from '@/services/api';
import MediaPicker from '@/components/admin/MediaPicker';

type Locale = 'bn' | 'en';

type GalleryItem = {
  id: string;
  gallery_album_id: string;
  media_id?: string | null;
  title_bn?: string | null;
  title_en?: string | null;
  image_url?: string | null;
  file_url?: string | null;
  display_order?: number;
};

type GalleryAlbum = {
  id: string;
  title_bn: string;
  title_en: string;
  slug: string;
  description_bn?: string | null;
  description_en?: string | null;
  items?: GalleryItem[];
};

function resolveMediaUrl(url?: string | null) {
  if (!url) return null;

  if (/^https?:\/\//i.test(url)) {
    return url;
  }

  const base =
    process.env.NEXT_PUBLIC_API_BASE_URL?.replace(/\/api\/v1\/?$/, '') ||
    'http://localhost:8000';

  return `${base}${url.startsWith('/') ? url : `/${url}`}`;
}

export default function AdminGalleryPage({
  params,
}: {
  params: { locale: string };
}) {
  const locale: Locale = params.locale === 'en' ? 'en' : 'bn';
  const isBn = locale === 'bn';

  const [albums, setAlbums] = useState<GalleryAlbum[]>([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState<'success' | 'error'>('success');
  const [deletingImageId, setDeletingImageId] = useState<string | null>(null);
  const [savingAlbum, setSavingAlbum] = useState(false);
  const [savingImage, setSavingImage] = useState(false);
  const [albumFormOpen, setAlbumFormOpen] = useState(false);
  const [openAlbumMenuId, setOpenAlbumMenuId] = useState<string | null>(null);

  const [titleBn, setTitleBn] = useState('');
  const [titleEn, setTitleEn] = useState('');
  const [slug, setSlug] = useState('');
  const [descriptionBn, setDescriptionBn] = useState('');
  const [descriptionEn, setDescriptionEn] = useState('');

  const [editingAlbum, setEditingAlbum] =
    useState<GalleryAlbum | null>(null);

  const [selectedAlbum, setSelectedAlbum] =
    useState<GalleryAlbum | null>(null);

  const [editingImage, setEditingImage] =
    useState<GalleryItem | null>(null);

  const [mediaId, setMediaId] = useState<string | null>(null);
  const [selectedMediaIds, setSelectedMediaIds] = useState<string[]>([]);
  const [imageTitleBn, setImageTitleBn] = useState('');
  const [imageTitleEn, setImageTitleEn] = useState('');
  const [displayOrder, setDisplayOrder] = useState(0);

  async function loadAlbums() {
    try {
      const response = await api.get('/gallery');

      const data = Array.isArray(response.data?.data)
        ? response.data.data
        : [];

      setAlbums(data);
    } catch (error) {
      console.error('Gallery load error:', error);
      setAlbums([]);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadAlbums();
  }, []);

  function resetAlbumForm() {
    setTitleBn('');
    setTitleEn('');
    setSlug('');
    setDescriptionBn('');
    setDescriptionEn('');
    setEditingAlbum(null);
  }

  function startEditAlbum(album: GalleryAlbum) {
    setEditingAlbum(album);
    setAlbumFormOpen(true);
    setOpenAlbumMenuId(null);
    setTitleBn(album.title_bn || '');
    setTitleEn(album.title_en || '');
    setSlug(album.slug || '');
    setDescriptionBn(album.description_bn || '');
    setDescriptionEn(album.description_en || '');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  async function saveAlbum(e: React.FormEvent) {
    e.preventDefault();
    if (savingAlbum) return;

    setMessage('');
    setSavingAlbum(true);

    try {
      const payload = {
        title_bn: titleBn,
        title_en: titleEn,
        slug,
        description_bn: descriptionBn,
        description_en: descriptionEn,
      };

      if (editingAlbum) {
        await api.put(`/gallery/${editingAlbum.id}`, payload);

        setMessage(
          isBn
            ? 'অ্যালবাম সফলভাবে আপডেট হয়েছে।'
            : 'Album updated successfully.',
        );
      } else {
        await api.post('/gallery', payload);

        setMessage(
          isBn
            ? 'অ্যালবাম সফলভাবে তৈরি হয়েছে।'
            : 'Album created successfully.',
        );
      }

      resetAlbumForm();
      setAlbumFormOpen(false);
      setOpenAlbumMenuId(null);
      await loadAlbums();
    } catch (error) {
      console.error('Album save error:', error);

      setMessage(
        isBn
          ? 'অ্যালবাম সংরক্ষণ করা যায়নি।'
          : 'Could not save album.',
      );
      setMessageType('error');
    } finally {
      setSavingAlbum(false);
    }
  }

  async function deleteAlbum(albumId: string) {
    if (
      !confirm(
        isBn
          ? 'এই অ্যালবাম এবং এর সব ছবি মুছে ফেলবেন?'
          : 'Delete this album and all its images?',
      )
    ) {
      return;
    }

    try {
      await api.delete(`/gallery/${albumId}`);

      if (selectedAlbum?.id === albumId) {
        setSelectedAlbum(null);
      }

      setMessage(
        isBn
          ? 'অ্যালবাম মুছে ফেলা হয়েছে।'
          : 'Album deleted successfully.',
      );

      await loadAlbums();
    } catch (error) {
      console.error('Album delete error:', error);

      setMessage(
        isBn
          ? 'অ্যালবাম মুছতে সমস্যা হয়েছে।'
          : 'Could not delete album.',
      );
    }
  }

  function startAddImage(album: GalleryAlbum) {
    setOpenAlbumMenuId(null);
    setSelectedAlbum(album);
    setEditingImage(null);
    setMediaId(null);
    setSelectedMediaIds([]);
    setImageTitleBn('');
    setImageTitleEn('');
    setDisplayOrder(0);
  }

  function startEditImage(album: GalleryAlbum, item: GalleryItem) {
    setSelectedAlbum(album);
    setEditingImage(item);
    setMediaId(item.media_id || null);
    setSelectedMediaIds([]);
    setImageTitleBn(item.title_bn || '');
    setImageTitleEn(item.title_en || '');
    setDisplayOrder(item.display_order || 0);
  }

  function resetImageForm() {
    setEditingImage(null);
    setMediaId(null);
    setSelectedMediaIds([]);
    setImageTitleBn('');
    setImageTitleEn('');
    setDisplayOrder(0);
  }

  async function saveImage(e: React.FormEvent) {
    e.preventDefault();
    if (savingImage) return;

    setMessage('');

    if (!selectedAlbum) {
      setMessage(
        isBn
          ? 'প্রথমে একটি অ্যালবাম নির্বাচন করুন।'
          : 'Select an album first.',
      );
      return;
    }

    if (editingImage && !mediaId) {
      setMessage(
        isBn ? 'একটি ছবি নির্বাচন করুন।' : 'Select an image.',
      );
      setMessageType('error');
      return;
    }

    if (!editingImage && selectedMediaIds.length === 0) {
      setMessage(
        isBn
          ? 'কমপক্ষে একটি ছবি নির্বাচন করুন।'
          : 'Select at least one image.',
      );
      setMessageType('error');
      return;
    }

    setSavingImage(true);

    try {
      if (editingImage) {
        await api.put(
          `/gallery/items/${editingImage.id}`,
          {
            media_id: mediaId,
            title_bn: imageTitleBn,
            title_en: imageTitleEn,
            display_order: displayOrder,
          },
        );

        setMessage(
          isBn
            ? 'ছবি সফলভাবে আপডেট হয়েছে।'
            : 'Image updated successfully.',
        );
      } else {
        const ids = Array.from(new Set(selectedMediaIds));

        for (let index = 0; index < ids.length; index += 1) {
          await api.post('/gallery/items', {
            gallery_album_id: selectedAlbum.id,
            media_id: ids[index],
            title_bn: ids.length === 1 ? imageTitleBn : '',
            title_en: ids.length === 1 ? imageTitleEn : '',
            display_order: displayOrder + index,
          });
        }

        setMessage(
          isBn
            ? `✓ ${ids.length}টি ছবি সফলভাবে যোগ হয়েছে।`
            : `✓ ${ids.length} image${ids.length === 1 ? '' : 's'} added successfully.`,
        );
      }

      resetImageForm();
      await loadAlbums();

      const response = await api.get('/gallery');
      const freshAlbums: GalleryAlbum[] = Array.isArray(
        response.data?.data,
      )
        ? response.data.data
        : [];

      setAlbums(freshAlbums);

      const freshAlbum = freshAlbums.find(
        (album) => album.id === selectedAlbum.id,
      );

      if (freshAlbum) {
        setSelectedAlbum(freshAlbum);
      }
    } catch (error) {
      console.error('Gallery image save error:', error);

      setMessage(
        isBn
          ? 'ছবি সংরক্ষণ করা যায়নি।'
          : 'Could not save image.',
      );
      setMessageType('error');
    } finally {
      setSavingImage(false);
    }
  }

  async function deleteImage(itemId: string) {
    if (deletingImageId) return;

    if (
      !confirm(
        isBn ? 'এই ছবিটি মুছে ফেলবেন?' : 'Delete this image?',
      )
    ) {
      return;
    }

    setDeletingImageId(itemId);
    setMessage('');
    setMessageType('success');

    try {
      await api.delete(`/gallery/items/${itemId}`);

      // Immediately remove the deleted image from the current UI.
      setAlbums((currentAlbums) =>
        currentAlbums.map((album) => ({
          ...album,
          items: album.items?.filter((item) => item.id !== itemId),
        })),
      );

      setSelectedAlbum((currentAlbum) =>
        currentAlbum
          ? {
              ...currentAlbum,
              items: currentAlbum.items?.filter(
                (item) => item.id !== itemId,
              ),
            }
          : null,
      );

      if (editingImage?.id === itemId) {
        resetImageForm();
      }

      setMessage(
        isBn
          ? '✓ ছবি সফলভাবে মুছে ফেলা হয়েছে।'
          : '✓ Image deleted successfully.',
      );
      setMessageType('success');

      // Refresh from backend to guarantee UI matches database.
      await loadAlbums();
    } catch (error) {
      console.error('Gallery image delete error:', error);

      setMessage(
        isBn
          ? '✕ ছবি মুছতে সমস্যা হয়েছে। আবার চেষ্টা করুন।'
          : '✕ Could not delete image. Please try again.',
      );
      setMessageType('error');
    } finally {
      setDeletingImageId(null);
    }
  }


  return (
    <main className="min-h-screen bg-gray-50 px-4 py-8">
      <div className="mx-auto max-w-7xl space-y-6">

        <section className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
          <div className="flex flex-col gap-5 p-6 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <span className="inline-flex rounded-full bg-emerald-50 px-3 py-1 text-xs font-bold uppercase tracking-wider text-emerald-700">
                {isBn ? 'কনটেন্ট ম্যানেজমেন্ট' : 'Content Management'}
              </span>

              <h1 className="mt-3 text-2xl font-black text-gray-950 sm:text-3xl">
                {isBn ? 'গ্যালারি ব্যবস্থাপনা' : 'Gallery Management'}
              </h1>

              <p className="mt-2 text-sm text-gray-500">
                {isBn
                  ? 'অ্যালবাম তৈরি করুন এবং গ্যালারির ছবিগুলো পরিচালনা করুন।'
                  : 'Create albums and manage gallery images.'}
              </p>
            </div>

            <button
              type="button"
              onClick={() => {
                resetAlbumForm();
                setAlbumFormOpen(true);
                setOpenAlbumMenuId(null);
              }}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-700 px-5 py-3 text-sm font-bold text-white shadow-sm transition hover:bg-emerald-800"
            >
              <span className="text-xl leading-none">+</span>
              {isBn ? 'নতুন অ্যালবাম' : 'Add New Album'}
            </button>
          </div>
        </section>

        {message && (
          <div
            className={`rounded-xl border px-4 py-3 text-sm font-medium ${
              messageType === 'error'
                ? 'border-red-200 bg-red-50 text-red-700'
                : 'border-emerald-200 bg-emerald-50 text-emerald-700'
            }`}
          >
            {message}
          </div>
        )}

        {albumFormOpen && (
          <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm sm:p-7">
            <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 className="text-xl font-bold text-gray-900">
                  {editingAlbum
                    ? isBn
                      ? 'অ্যালবাম সম্পাদনা'
                      : 'Edit Album'
                    : isBn
                      ? 'নতুন অ্যালবাম'
                      : 'Create New Album'}
                </h2>

                <p className="mt-1 text-sm text-gray-500">
                  {editingAlbum
                    ? isBn
                      ? 'নির্বাচিত অ্যালবামের তথ্য পরিবর্তন করুন।'
                      : 'Update the selected album.'
                    : isBn
                      ? 'নতুন ফটো অ্যালবামের তথ্য দিন।'
                      : 'Enter the details for the new photo album.'}
                </p>
              </div>

              <button
                type="button"
                onClick={() => {
                  resetAlbumForm();
                  setAlbumFormOpen(false);
                }}
                className="self-start rounded-xl border border-gray-200 bg-white px-4 py-2 text-sm font-semibold text-gray-600 transition hover:bg-gray-50 sm:self-auto"
              >
                {isBn ? 'বন্ধ করুন' : 'Close'}
              </button>
            </div>

            <form onSubmit={saveAlbum} className="space-y-5">
              <div className="grid gap-5 md:grid-cols-2">
                <div>
                  <label className="mb-2 block text-sm font-semibold text-gray-700">
                    {isBn ? 'বাংলা শিরোনাম' : 'Title (Bangla)'}
                  </label>
                  <input
                    value={titleBn}
                    onChange={(e) => setTitleBn(e.target.value)}
                    placeholder="বাংলা শিরোনাম"
                    className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
                    required
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-semibold text-gray-700">
                    Title (English)
                  </label>
                  <input
                    value={titleEn}
                    onChange={(e) => setTitleEn(e.target.value)}
                    placeholder="English title"
                    className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-gray-700">
                  Slug
                </label>
                <input
                  value={slug}
                  onChange={(e) => setSlug(e.target.value)}
                  placeholder="album-slug"
                  className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
                  required
                />
              </div>

              <div className="grid gap-5 md:grid-cols-2">
                <div>
                  <label className="mb-2 block text-sm font-semibold text-gray-700">
                    {isBn ? 'বাংলা বিবরণ' : 'Description (Bangla)'}
                  </label>
                  <textarea
                    value={descriptionBn}
                    onChange={(e) => setDescriptionBn(e.target.value)}
                    placeholder="বাংলা বিবরণ"
                    className="min-h-32 w-full rounded-xl border border-gray-300 px-4 py-3 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-semibold text-gray-700">
                    Description (English)
                  </label>
                  <textarea
                    value={descriptionEn}
                    onChange={(e) => setDescriptionEn(e.target.value)}
                    placeholder="English description"
                    className="min-h-32 w-full rounded-xl border border-gray-300 px-4 py-3 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
                  />
                </div>
              </div>

              <div className="flex flex-wrap gap-3">
                <button
                  type="submit"
                  disabled={savingAlbum}
                  className="rounded-xl bg-emerald-700 px-5 py-3 text-sm font-bold text-white transition hover:bg-emerald-800 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {savingAlbum
                    ? isBn
                      ? 'সংরক্ষণ হচ্ছে...'
                      : 'Saving...'
                    : editingAlbum
                      ? isBn
                        ? 'অ্যালবাম আপডেট করুন'
                        : 'Update Album'
                      : isBn
                        ? 'অ্যালবাম তৈরি করুন'
                        : 'Create Album'}
                </button>

                <button
                  type="button"
                  onClick={() => {
                    resetAlbumForm();
                    setAlbumFormOpen(false);
                  }}
                  className="rounded-xl border border-gray-300 bg-white px-5 py-3 text-sm font-semibold text-gray-700 transition hover:bg-gray-50"
                >
                  {isBn ? 'বাতিল' : 'Cancel'}
                </button>
              </div>
            </form>
          </section>
        )}

        <section className="overflow-visible rounded-2xl border border-gray-200 bg-white shadow-sm">
          <div className="flex items-center justify-between border-b border-gray-100 px-6 py-5">
            <div>
              <h2 className="text-lg font-bold text-gray-900">
                {isBn ? 'অ্যালবামসমূহ' : 'Existing Albums'}
              </h2>
              <p className="mt-1 text-xs text-gray-500">
                {albums.length} {isBn ? 'টি অ্যালবাম' : `album${albums.length === 1 ? '' : 's'}`}
              </p>
            </div>
          </div>

          {loading ? (
            <div className="p-8 text-sm text-gray-500">
              {isBn ? 'লোড হচ্ছে...' : 'Loading albums...'}
            </div>
          ) : albums.length === 0 ? (
            <div className="p-8 text-center">
              <p className="font-semibold text-gray-700">
                {isBn ? 'কোনো অ্যালবাম নেই' : 'No albums yet'}
              </p>
              <p className="mt-1 text-sm text-gray-500">
                {isBn
                  ? 'উপরের Add New Album বাটন থেকে প্রথম অ্যালবাম তৈরি করুন।'
                  : 'Create your first album using the Add New Album button.'}
              </p>
            </div>
          ) : (
            <div className="divide-y divide-gray-100">
              {albums.map((album, index) => (
                <div key={album.id} className="relative p-5 sm:p-6">
                  <div className="flex items-start gap-4">
                    <span className="inline-flex h-9 min-w-9 shrink-0 items-center justify-center rounded-lg bg-gray-100 px-2 text-xs font-bold text-gray-500">
                      {String(index + 1).padStart(2, '0')}
                    </span>

                    <div className="min-w-0 flex-1">
                      <div className="flex items-start justify-between gap-4">
                        <div className="min-w-0">
                          <h3 className="truncate text-lg font-bold text-gray-900">
                            {isBn ? album.title_bn : album.title_en}
                          </h3>

                          <p className="mt-1 text-sm text-gray-500">
                            {album.items?.length || 0}{' '}
                            {isBn ? 'টি ছবি' : `image${(album.items?.length || 0) === 1 ? '' : 's'}`}
                            <span className="mx-2 text-gray-300">•</span>
                            <span className="font-mono text-xs">/{album.slug}</span>
                          </p>
                        </div>

                        <div className="relative shrink-0">
                          <button
                            type="button"
                            aria-label="Album actions"
                            onClick={() =>
                              setOpenAlbumMenuId((current) =>
                                current === album.id ? null : album.id
                              )
                            }
                            className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-gray-200 bg-white text-xl font-bold leading-none text-gray-500 shadow-sm transition hover:bg-gray-50 hover:text-gray-900"
                          >
                            ⋮
                          </button>

                          {openAlbumMenuId === album.id && (
                            <>
                              <button
                                type="button"
                                aria-label="Close album actions"
                                onClick={() => setOpenAlbumMenuId(null)}
                                className="fixed inset-0 z-20 cursor-default"
                              />

                              <div className="absolute right-0 top-12 z-30 w-48 overflow-hidden rounded-xl border border-gray-200 bg-white p-1.5 text-left shadow-xl">
                                <button
                                  type="button"
                                  onClick={() => startAddImage(album)}
                                  className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-semibold text-emerald-700 transition hover:bg-emerald-50"
                                >
                                  <span className="text-base">＋</span>
                                  {isBn ? 'ছবি যোগ করুন' : 'Add Images'}
                                </button>

                                <button
                                  type="button"
                                  onClick={() => startEditAlbum(album)}
                                  className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-semibold text-gray-700 transition hover:bg-gray-50"
                                >
                                  <span>✎</span>
                                  {isBn ? 'অ্যালবাম এডিট' : 'Edit Album'}
                                </button>

                                <div className="my-1 border-t border-gray-100" />

                                <button
                                  type="button"
                                  onClick={() => {
                                    setOpenAlbumMenuId(null);
                                    deleteAlbum(album.id);
                                  }}
                                  className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-semibold text-red-600 transition hover:bg-red-50"
                                >
                                  <span>⌫</span>
                                  {isBn ? 'অ্যালবাম ডিলেট' : 'Delete Album'}
                                </button>
                              </div>
                            </>
                          )}
                        </div>
                      </div>

                      {album.items && album.items.length > 0 && (
                        <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
                          {album.items.map((item, imageIndex) => {
                            const imageUrl = resolveMediaUrl(
                              item.image_url || item.file_url,
                            );

                            return (
                              <div
                                key={item.id}
                                className="group overflow-hidden rounded-xl border border-gray-200 bg-white transition hover:shadow-md"
                              >
                                <div className="relative aspect-square overflow-hidden bg-gray-100">
                                  {imageUrl ? (
                                    <img
                                      src={imageUrl}
                                      alt={
                                        isBn
                                          ? item.title_bn || 'Gallery image'
                                          : item.title_en || 'Gallery image'
                                      }
                                      className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
                                    />
                                  ) : (
                                    <div className="flex h-full items-center justify-center text-xs text-gray-400">
                                      No image
                                    </div>
                                  )}

                                  <span className="absolute left-2 top-2 rounded-lg bg-black/65 px-2 py-1 text-[10px] font-bold text-white">
                                    {String(imageIndex + 1).padStart(2, '0')}
                                  </span>
                                </div>

                                <div className="p-3">
                                  <p className="truncate text-xs font-semibold text-gray-700">
                                    {isBn
                                      ? item.title_bn || 'ছবি'
                                      : item.title_en || 'Image'}
                                  </p>

                                  <p className="mt-1 text-[10px] text-gray-400">
                                    {isBn ? 'ক্রম' : 'Order'}: {item.display_order ?? 0}
                                  </p>

                                  <div className="mt-3 grid grid-cols-2 gap-2">
                                    <button
                                      type="button"
                                      onClick={() => startEditImage(album, item)}
                                      className="rounded-lg bg-gray-100 px-2 py-2 text-xs font-bold text-gray-700 transition hover:bg-gray-200"
                                    >
                                      {isBn ? 'এডিট' : 'Edit'}
                                    </button>

                                    <button
                                      type="button"
                                      onClick={() => deleteImage(item.id)}
                                      disabled={deletingImageId === item.id}
                                      className="rounded-lg bg-red-50 px-2 py-2 text-xs font-bold text-red-600 transition hover:bg-red-100 disabled:cursor-not-allowed disabled:opacity-50"
                                    >
                                      {deletingImageId === item.id
                                        ? isBn
                                          ? 'মুছছে...'
                                          : 'Deleting...'
                                        : isBn
                                          ? 'ডিলেট'
                                          : 'Delete'}
                                    </button>
                                  </div>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {selectedAlbum && (
          <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm sm:p-7">
            <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <span className="inline-flex rounded-full bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-700">
                  {isBn ? 'নির্বাচিত অ্যালবাম' : 'Selected Album'}
                </span>

                <h2 className="mt-3 text-xl font-bold text-gray-900">
                  {editingImage
                    ? isBn
                      ? 'ছবি সম্পাদনা'
                      : 'Edit Image'
                    : isBn
                      ? 'ছবি যোগ করুন'
                      : 'Add Images'}
                </h2>

                <p className="mt-1 text-sm text-gray-500">
                  {isBn ? selectedAlbum.title_bn : selectedAlbum.title_en}
                </p>
              </div>

              <button
                type="button"
                onClick={() => {
                  setSelectedAlbum(null);
                  resetImageForm();
                }}
                className="self-start rounded-xl border border-gray-200 px-4 py-2 text-sm font-semibold text-gray-600 transition hover:bg-gray-50 sm:self-auto"
              >
                {isBn ? 'বন্ধ করুন' : 'Close'}
              </button>
            </div>

            <form onSubmit={saveImage} className="space-y-5">
              <MediaPicker
                value={mediaId}
                existingUrl={
                  editingImage
                    ? resolveMediaUrl(
                        editingImage.image_url ||
                          editingImage.file_url,
                      )
                    : null
                }
                onChange={(id) => {
                  setMediaId(id);

                  if (!editingImage && id) {
                    setSelectedMediaIds((current) =>
                      current.includes(id) ? current : [...current, id],
                    );
                  }
                }}
                multiple={!editingImage}
                selectedValues={selectedMediaIds}
                onMultipleChange={setSelectedMediaIds}
                label={
                  editingImage
                    ? isBn
                      ? 'ছবি পরিবর্তন করুন'
                      : 'Change Image'
                    : isBn
                      ? 'এক বা একাধিক ছবি নির্বাচন করুন'
                      : 'Select One or More Images'
                }
                mediaType="gallery"
              />

              {!editingImage && selectedMediaIds.length > 0 && (
                <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3">
                  <p className="text-sm font-semibold text-emerald-800">
                    {isBn
                      ? `${selectedMediaIds.length}টি ছবি নির্বাচন করা হয়েছে`
                      : `${selectedMediaIds.length} image${selectedMediaIds.length === 1 ? '' : 's'} selected`}
                  </p>

                  <button
                    type="button"
                    onClick={() => {
                      setSelectedMediaIds([]);
                      setMediaId(null);
                    }}
                    className="text-sm font-semibold text-emerald-700 hover:text-emerald-900"
                  >
                    {isBn ? 'সব নির্বাচন বাতিল' : 'Clear selection'}
                  </button>
                </div>
              )}

              <div className="grid gap-5 md:grid-cols-2">
                <div>
                  <label className="mb-2 block text-sm font-semibold text-gray-700">
                    {isBn ? 'ছবির বাংলা শিরোনাম' : 'Image Title (Bangla)'}
                  </label>
                  <input
                    value={imageTitleBn}
                    onChange={(e) => setImageTitleBn(e.target.value)}
                    placeholder="ছবির বাংলা শিরোনাম"
                    className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-semibold text-gray-700">
                    Image Title (English)
                  </label>
                  <input
                    value={imageTitleEn}
                    onChange={(e) => setImageTitleEn(e.target.value)}
                    placeholder="Image English title"
                    className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
                  />
                </div>
              </div>

              <div className="max-w-xs">
                <label className="mb-2 block text-sm font-semibold text-gray-700">
                  {isBn ? 'প্রদর্শনের ক্রম' : 'Display Order'}
                </label>
                <input
                  type="number"
                  min="0"
                  value={displayOrder}
                  onChange={(e) => setDisplayOrder(Number(e.target.value))}
                  className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
                />
              </div>

              <div className="flex flex-wrap gap-3">
                <button
                  type="submit"
                  disabled={savingImage}
                  className="rounded-xl bg-emerald-700 px-5 py-3 text-sm font-bold text-white transition hover:bg-emerald-800 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {savingImage
                    ? isBn
                      ? 'সংরক্ষণ হচ্ছে...'
                      : 'Saving...'
                    : editingImage
                      ? isBn
                        ? 'ছবি আপডেট করুন'
                        : 'Update Image'
                      : isBn
                        ? 'ছবি যোগ করুন'
                        : 'Add Images'}
                </button>

                {editingImage && (
                  <button
                    type="button"
                    onClick={resetImageForm}
                    className="rounded-xl border border-gray-300 px-5 py-3 text-sm font-semibold text-gray-700 transition hover:bg-gray-50"
                  >
                    {isBn ? 'বাতিল' : 'Cancel'}
                  </button>
                )}
              </div>
            </form>
          </section>
        )}
      </div>
    </main>
  );
}
