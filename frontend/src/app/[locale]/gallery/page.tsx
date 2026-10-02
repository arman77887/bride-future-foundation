import Link from 'next/link';
import { api } from '@/services/api';
import GalleryViewer, {
  type GalleryPhoto,
} from '@/components/gallery/GalleryViewer';

type Locale = 'bn' | 'en';

type GalleryItem = {
  id: string;
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

function localized(
  locale: Locale,
  bn?: string | null,
  en?: string | null,
  fallback = '',
) {
  return locale === 'bn'
    ? bn || en || fallback
    : en || bn || fallback;
}

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

export default async function GalleryPage({
  params,
}: {
  params: { locale: string };
}) {
  const locale: Locale = params.locale === 'en' ? 'en' : 'bn';

  let albums: GalleryAlbum[] = [];

  try {
    const response = await api.get('/gallery');

    albums = Array.isArray(response.data?.data)
      ? response.data.data
      : [];
  } catch {
    albums = [];
  }

  const totalPhotos = albums.reduce(
    (total, album) => total + (album.items?.length || 0),
    0,
  );

  return (
    <main className="min-h-screen bg-[#f7faf9]">
      <section className="relative overflow-hidden bg-gradient-to-br from-emerald-950 via-emerald-800 to-teal-700 text-white">
        <div className="absolute -right-24 -top-24 h-72 w-72 rounded-full bg-white/10 blur-3xl" />
        <div className="absolute -bottom-32 -left-20 h-80 w-80 rounded-full bg-emerald-300/10 blur-3xl" />

        <div className="relative mx-auto max-w-7xl px-5 py-16 sm:px-6 sm:py-20 lg:px-8">
          <div className="max-w-3xl">
            <div className="mb-5 inline-flex items-center rounded-full border border-white/20 bg-white/10 px-4 py-2 text-sm font-medium backdrop-blur">
              {locale === 'bn'
                ? 'ব্রাইট ফিউচার ফাউন্ডেশন'
                : 'Bright Future Foundation'}
            </div>

            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
              {locale === 'bn'
                ? 'আমাদের গ্যালারি'
                : 'Our Gallery'}
            </h1>

            <p className="mt-5 max-w-2xl text-base leading-7 text-emerald-50 sm:text-lg">
              {locale === 'bn'
                ? 'আমাদের কার্যক্রম, উদ্যোগ এবং স্মরণীয় মুহূর্তগুলো ছবির মাধ্যমে ঘুরে দেখুন।'
                : 'Explore the activities, initiatives and memorable moments of Bright Future Foundation through our photographs.'}
            </p>

            {albums.length > 0 && (
              <div className="mt-8 flex flex-wrap gap-3">
                <div className="rounded-xl border border-white/15 bg-white/10 px-4 py-3 backdrop-blur">
                  <span className="block text-xl font-bold">
                    {albums.length}
                  </span>
                  <span className="text-xs text-emerald-100">
                    {locale === 'bn' ? 'অ্যালবাম' : 'Albums'}
                  </span>
                </div>

                <div className="rounded-xl border border-white/15 bg-white/10 px-4 py-3 backdrop-blur">
                  <span className="block text-xl font-bold">
                    {totalPhotos}
                  </span>
                  <span className="text-xs text-emerald-100">
                    {locale === 'bn' ? 'ছবি' : 'Photos'}
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      <section className="px-4 py-10 sm:px-6 sm:py-14 lg:px-8">
        <div className="mx-auto max-w-7xl">
          {albums.length === 0 ? (
            <div className="rounded-3xl border border-gray-100 bg-white px-6 py-16 text-center shadow-sm">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-50 text-3xl">
                ◫
              </div>

              <h2 className="mt-5 text-xl font-bold text-gray-900">
                {locale === 'bn'
                  ? 'গ্যালারি শীঘ্রই আসছে'
                  : 'Gallery coming soon'}
              </h2>

              <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-gray-500">
                {locale === 'bn'
                  ? 'এখনও কোনো গ্যালারি অ্যালবাম প্রকাশ করা হয়নি।'
                  : 'No gallery albums have been published yet.'}
              </p>
            </div>
          ) : (
            <div className="space-y-10 sm:space-y-14">
              {albums.map((album, albumIndex) => {
                const albumTitle = localized(
                  locale,
                  album.title_bn,
                  album.title_en,
                  locale === 'bn' ? 'অ্যালবাম' : 'Album',
                );

                const photos = (album.items || []).reduce<GalleryPhoto[]>(
                  (result, item) => {
                    const src = resolveMediaUrl(
                      item.image_url || item.file_url,
                    );

                    if (!src) {
                      return result;
                    }

                    const title = localized(
                      locale,
                      item.title_bn,
                      item.title_en,
                    );

                    result.push({
                      id: item.id,
                      src,
                      title: title || undefined,
                      alt: title || albumTitle,
                    });

                    return result;
                  },
                  [],
                );

                return (
                  <article
                    key={album.id}
                    className="overflow-hidden rounded-3xl border border-gray-100 bg-white shadow-sm"
                  >
                    <div className="border-b border-gray-100 px-5 py-6 sm:px-8 sm:py-7">
                      <div className="flex items-start gap-4">
                        <div className="flex h-11 min-w-11 items-center justify-center rounded-xl bg-emerald-50 text-sm font-bold text-emerald-700">
                          {String(albumIndex + 1).padStart(2, '0')}
                        </div>

                        <div className="min-w-0 flex-1">
                          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                            <Link
                              href={`/${locale}/gallery/${album.slug}`}
                              className="group inline-flex items-center gap-2"
                            >
                              <h2 className="text-2xl font-bold tracking-tight text-gray-900 transition group-hover:text-emerald-700 sm:text-3xl">
                                {albumTitle}
                              </h2>
                              <span
                                aria-hidden="true"
                                className="text-emerald-600 transition-transform group-hover:translate-x-1"
                              >
                                →
                              </span>
                            </Link>

                            <span className="w-fit rounded-full bg-gray-100 px-3 py-1.5 text-xs font-semibold text-gray-600">
                              {photos.length}{' '}
                              {locale === 'bn' ? 'ছবি' : photos.length === 1 ? 'Photo' : 'Photos'}
                            </span>
                          </div>


                        </div>
                      </div>
                    </div>

                    <div className="p-4 sm:p-6 lg:p-8">
                      <GalleryViewer
                        photos={photos}
                        locale={locale}
                      />

                      <div className="mt-5 flex justify-end">
                        <Link
                          href={`/${locale}/gallery/${album.slug}`}
                          className="inline-flex items-center gap-2 rounded-xl bg-emerald-700 px-5 py-3 text-sm font-semibold text-white transition hover:bg-emerald-800"
                        >
                          {locale === 'bn'
                            ? 'অ্যালবাম খুলুন'
                            : 'View album'}
                          <span aria-hidden="true">→</span>
                        </Link>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
