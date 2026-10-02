import Link from 'next/link';
import { notFound } from 'next/navigation';
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

export default async function GalleryAlbumPage({
  params,
}: {
  params: { locale: string; slug: string };
}) {
  const locale: Locale = params.locale === 'en' ? 'en' : 'bn';

  let album: GalleryAlbum | null = null;

  try {
    const response = await api.get(
      `/gallery/${encodeURIComponent(params.slug)}`,
    );
    album = response.data?.data || null;
  } catch {
    notFound();
  }

  if (!album) {
    notFound();
  }

  const albumTitle = localized(
    locale,
    album.title_bn,
    album.title_en,
    locale === 'bn' ? 'গ্যালারি অ্যালবাম' : 'Gallery Album',
  );

  const description = localized(
    locale,
    album.description_bn,
    album.description_en,
  );

  const photos = [...(album.items || [])]
    .sort(
      (a, b) =>
        (a.display_order ?? Number.MAX_SAFE_INTEGER) -
        (b.display_order ?? Number.MAX_SAFE_INTEGER),
    )
    .reduce<GalleryPhoto[]>((result, item) => {
      const src = resolveMediaUrl(item.image_url || item.file_url);

      if (!src) return result;

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
    }, []);

  return (
    <main className="min-h-screen bg-[#f7faf9]">
      <section className="relative overflow-hidden bg-gradient-to-br from-emerald-950 via-emerald-800 to-teal-700 text-white">
        <div className="absolute -right-24 -top-24 h-72 w-72 rounded-full bg-white/10 blur-3xl" />
        <div className="absolute -bottom-32 -left-20 h-80 w-80 rounded-full bg-emerald-300/10 blur-3xl" />

        <div className="relative mx-auto max-w-7xl px-5 py-14 sm:px-6 sm:py-18 lg:px-8">
          <Link
            href={`/${locale}/gallery`}
            className="mb-7 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-sm font-medium text-white backdrop-blur transition hover:bg-white/20"
          >
            <span aria-hidden="true">←</span>
            {locale === 'bn' ? 'সব অ্যালবাম' : 'All albums'}
          </Link>

          <div className="max-w-4xl">
            <div className="mb-4 flex flex-wrap items-center gap-3">
              <span className="rounded-full border border-white/20 bg-white/10 px-4 py-2 text-sm font-medium backdrop-blur">
                {locale === 'bn'
                  ? 'ব্রাইট ফিউচার ফাউন্ডেশন'
                  : 'Bright Future Foundation'}
              </span>

              <span className="rounded-full border border-white/20 bg-white/10 px-4 py-2 text-sm font-semibold text-emerald-50 backdrop-blur">
                {photos.length}{' '}
                {locale === 'bn'
                  ? 'ছবি'
                  : photos.length === 1
                    ? 'Photo'
                    : 'Photos'}
              </span>
            </div>

            <h1 className="text-3xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
              {albumTitle}
            </h1>

            {description && (
              <p className="mt-5 max-w-3xl whitespace-pre-line text-base leading-8 text-emerald-50 sm:text-lg">
                {description}
              </p>
            )}
          </div>
        </div>
      </section>

      <section className="px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="overflow-hidden rounded-3xl border border-gray-100 bg-white shadow-sm">
            <div className="border-b border-gray-100 px-5 py-5 sm:px-8">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <p className="text-xs font-bold uppercase tracking-[0.18em] text-emerald-700">
                    {locale === 'bn' ? 'ফটো অ্যালবাম' : 'Photo Album'}
                  </p>

                  <h2 className="mt-1 text-xl font-bold text-gray-900 sm:text-2xl">
                    {locale === 'bn'
                      ? 'স্মরণীয় মুহূর্তগুলো দেখুন'
                      : 'Explore the moments'}
                  </h2>
                </div>

                <span className="rounded-full bg-emerald-50 px-4 py-2 text-xs font-semibold text-emerald-800">
                  {locale === 'bn'
                    ? 'প্রতি ২ সেকেন্ডে ছবি পরিবর্তন'
                    : 'Changes every 2 seconds'}
                </span>
              </div>
            </div>

            <div className="p-4 sm:p-6 lg:p-8">
              <GalleryViewer
                photos={photos}
                locale={locale}
              />
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
