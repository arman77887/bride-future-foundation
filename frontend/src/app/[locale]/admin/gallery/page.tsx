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
    setSelectedAlbum(album);
    setEditingImage(null);
    setMediaId(null);
    setImageTitleBn('');
    setImageTitleEn('');
    setDisplayOrder(0);
  }

  function startEditImage(album: GalleryAlbum, item: GalleryItem) {
    setSelectedAlbum(album);
    setEditingImage(item);
    setMediaId(item.media_id || null);
    setImageTitleBn(item.title_bn || '');
    setImageTitleEn(item.title_en || '');
    setDisplayOrder(item.display_order || 0);
  }

  function resetImageForm() {
    setEditingImage(null);
    setMediaId(null);
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

    if (!mediaId && !editingImage) {
      setMessage(
        isBn ? 'একটি ছবি নির্বাচন করুন।' : 'Select an image.',
      );
      return;
    }

    setSavingImage(true);

    try {
      const payload = {
        media_id: mediaId,
        title_bn: imageTitleBn,
        title_en: imageTitleEn,
        display_order: displayOrder,
      };

      if (editingImage) {
        await api.put(
          `/gallery/items/${editingImage.id}`,
          payload,
        );

        setMessage(
          isBn
            ? 'ছবি সফলভাবে আপডেট হয়েছে।'
            : 'Image updated successfully.',
        );
      } else {
        await api.post('/gallery/items', {
          gallery_album_id: selectedAlbum.id,
          ...payload,
        });

        setMessage(
          isBn
            ? 'ছবি সফলভাবে যোগ হয়েছে।'
            : 'Image added successfully.',
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
      <div className="mx-auto max-w-7xl space-y-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            {isBn ? 'গ্যালারি ব্যবস্থাপনা' : 'Gallery Management'}
          </h1>

          <p className="mt-2 text-gray-600">
            {isBn
              ? 'অ্যালবাম ও ছবিগুলো পরিচালনা করুন।'
              : 'Manage albums and gallery images.'}
          </p>
        </div>

        {message && (
          <div className="rounded-lg bg-blue-50 px-4 py-3 text-blue-800">
            {message}
          </div>
        )}

        <section className="rounded-xl bg-white p-6 shadow">
          <h2 className="mb-5 text-xl font-semibold">
            {editingAlbum
              ? isBn
                ? 'অ্যালবাম সম্পাদনা'
                : 'Edit Album'
              : isBn
                ? 'নতুন অ্যালবাম'
                : 'New Album'}
          </h2>

          <form onSubmit={saveAlbum} className="space-y-4">
            <input
              value={titleBn}
              onChange={(e) => setTitleBn(e.target.value)}
              placeholder="বাংলা শিরোনাম"
              className="w-full rounded-lg border px-4 py-3"
              required
            />

            <input
              value={titleEn}
              onChange={(e) => setTitleEn(e.target.value)}
              placeholder="English title"
              className="w-full rounded-lg border px-4 py-3"
              required
            />

            <input
              value={slug}
              onChange={(e) => setSlug(e.target.value)}
              placeholder="slug"
              className="w-full rounded-lg border px-4 py-3"
              required
            />

            <textarea
              value={descriptionBn}
              onChange={(e) => setDescriptionBn(e.target.value)}
              placeholder="বাংলা বিবরণ"
              className="min-h-24 w-full rounded-lg border px-4 py-3"
            />

            <textarea
              value={descriptionEn}
              onChange={(e) => setDescriptionEn(e.target.value)}
              placeholder="English description"
              className="min-h-24 w-full rounded-lg border px-4 py-3"
            />

            <div className="flex gap-2">
              <button
                type="submit"
                disabled={savingAlbum}
                className="rounded-lg bg-black px-5 py-3 font-semibold text-white transition-all duration-200 hover:scale-[1.02] hover:bg-gray-800 active:scale-95 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {savingAlbum ? (
                  <span className="flex items-center gap-2">
                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                    {isBn ? 'সংরক্ষণ হচ্ছে...' : 'Saving...'}
                  </span>
                ) : editingAlbum ? (
                  isBn ? 'আপডেট করুন' : 'Update Album'
                ) : (
                  isBn ? 'অ্যালবাম তৈরি করুন' : 'Create Album'
                )}
              </button>

              {editingAlbum && (
                <button
                  type="button"
                  onClick={resetAlbumForm}
                  className="rounded-lg border px-5 py-3 transition-all duration-200 hover:scale-[1.02] hover:bg-gray-100 active:scale-95"
                >
                  {isBn ? 'বাতিল' : 'Cancel'}
                </button>
              )}
            </div>
          </form>
        </section>

        <section className="rounded-xl bg-white p-6 shadow">
          <h2 className="mb-5 text-xl font-semibold">
            {isBn ? 'অ্যালবামসমূহ' : 'Albums'}
          </h2>

          {loading ? (
            <p>{isBn ? 'লোড হচ্ছে...' : 'Loading...'}</p>
          ) : albums.length === 0 ? (
            <p className="text-gray-500">
              {isBn ? 'কোনো অ্যালবাম নেই।' : 'No albums yet.'}
            </p>
          ) : (
            <div className="space-y-6">
              {albums.map((album) => (
                <div
                  key={album.id}
                  className="rounded-xl border p-5"
                >
                  <div className="flex flex-col justify-between gap-4 md:flex-row">
                    <div>
                      <h3 className="text-xl font-bold">
                        {isBn ? album.title_bn : album.title_en}
                      </h3>

                      <p className="mt-1 text-sm text-gray-500">
                        {album.items?.length || 0}{' '}
                        {isBn ? 'টি ছবি' : 'images'}
                      </p>
                    </div>

                    <div className="flex flex-wrap gap-2">
                      <button
                        type="button"
                        onClick={() => startAddImage(album)}
                        className="rounded-lg bg-green-600 px-4 py-2 text-sm font-semibold text-white transition-all duration-200 hover:scale-[1.03] hover:bg-green-700 active:scale-95 disabled:cursor-not-allowed disabled:opacity-60"
                      >
                        {isBn ? 'ছবি যোগ করুন' : 'Add Image'}
                      </button>

                      <button
                        type="button"
                        onClick={() => startEditAlbum(album)}
                        className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition-all duration-200 hover:scale-[1.03] hover:bg-blue-700 active:scale-95 disabled:cursor-not-allowed disabled:opacity-60"
                      >
                        {isBn ? 'এডিট' : 'Edit'}
                      </button>

                      <button
                        type="button"
                        onClick={() => deleteAlbum(album.id)}
                        className="rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white transition-all duration-200 hover:scale-[1.03] hover:bg-red-700 active:scale-95 disabled:cursor-not-allowed disabled:opacity-60"
                      >
                        {isBn ? 'ডিলেট' : 'Delete'}
                      </button>
                    </div>
                  </div>

                  {album.items && album.items.length > 0 && (
                    <div className="mt-5 grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
                      {album.items.map((item) => {
                        const imageUrl = resolveMediaUrl(
                          item.image_url || item.file_url,
                        );

                        return (
                          <div
                            key={item.id}
                            className="overflow-hidden rounded-lg border bg-white"
                          >
                            {imageUrl && (
                              <img
                                src={imageUrl}
                                alt={
                                  isBn
                                    ? item.title_bn || 'Gallery image'
                                    : item.title_en || 'Gallery image'
                                }
                                className="h-40 w-full object-cover"
                              />
                            )}

                            <div className="p-2">
                              <p className="truncate text-sm font-medium">
                                {isBn
                                  ? item.title_bn || 'ছবি'
                                  : item.title_en || 'Image'}
                              </p>

                              <div className="mt-2 flex gap-1">
                                <button
                                  type="button"
                                  onClick={() =>
                                    startEditImage(album, item)
                                  }
                                  className="flex-1 rounded bg-blue-600 px-2 py-1 text-xs font-semibold text-white"
                                >
                                  {isBn ? 'এডিট' : 'Edit'}
                                </button>

                                <button
                                  type="button"
                                  onClick={() => deleteImage(item.id)}
                                  disabled={deletingImageId === item.id}
                                  className="flex-1 rounded bg-red-600 px-2 py-1 text-xs font-semibold text-white transition-all duration-200 hover:scale-[1.03] hover:bg-red-700 active:scale-95 disabled:cursor-not-allowed disabled:opacity-60"
                                >
                                  {deletingImageId === item.id ? (
                                    <span className="flex items-center justify-center gap-1">
                                      <span className="h-3 w-3 animate-spin rounded-full border-2 border-white border-t-transparent" />
                                      {isBn ? 'মুছছে...' : 'Deleting...'}
                                    </span>
                                  ) : (
                                    isBn ? 'ডিলেট' : 'Delete'
                                  )}
                                </button>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </section>

        {selectedAlbum && (
          <section className="rounded-xl bg-white p-6 shadow">
            <div className="mb-5 flex items-center justify-between">
              <h2 className="text-xl font-semibold">
                {editingImage
                  ? isBn
                    ? 'ছবি সম্পাদনা'
                    : 'Edit Image'
                  : isBn
                    ? 'ছবি যোগ করুন'
                    : 'Add Image'}
              </h2>

              <button
                type="button"
                onClick={() => {
                  setSelectedAlbum(null);
                  resetImageForm();
                }}
                className="rounded-lg border px-4 py-2"
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
                onChange={setMediaId}
                label={
                  isBn
                    ? 'ছবি নির্বাচন / Upload'
                    : 'Select / Upload Image'
                }
              />

              <input
                value={imageTitleBn}
                onChange={(e) => setImageTitleBn(e.target.value)}
                placeholder="ছবির বাংলা শিরোনাম"
                className="w-full rounded-lg border px-4 py-3"
              />

              <input
                value={imageTitleEn}
                onChange={(e) => setImageTitleEn(e.target.value)}
                placeholder="Image English title"
                className="w-full rounded-lg border px-4 py-3"
              />

              <input
                type="number"
                min="0"
                value={displayOrder}
                onChange={(e) =>
                  setDisplayOrder(Number(e.target.value))
                }
                placeholder="Display order"
                className="w-full rounded-lg border px-4 py-3"
              />

              <div className="flex gap-2">
                <button
                  type="submit"
                  disabled={savingImage}
                  className="rounded-lg bg-green-600 px-5 py-3 font-semibold text-white transition-all duration-200 hover:scale-[1.03] hover:bg-green-700 active:scale-95 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {savingImage ? (
                    <span className="flex items-center gap-2">
                      <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                      {isBn ? 'সংরক্ষণ হচ্ছে...' : 'Saving...'}
                    </span>
                  ) : editingImage ? (
                    isBn ? 'ছবি আপডেট করুন' : 'Update Image'
                  ) : (
                    isBn ? 'ছবি যোগ করুন' : 'Add Image'
                  )}
                </button>

                {editingImage && (
                  <button
                    type="button"
                    onClick={resetImageForm}
                    className="rounded-lg border px-5 py-3 transition-all duration-200 hover:scale-[1.02] hover:bg-gray-100 active:scale-95"
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
