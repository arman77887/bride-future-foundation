import { api } from '@/services/api';

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

  return (
    <main className="min-h-screen bg-gray-50">
      <section className="bg-white px-6 py-12">
        <div className="mx-auto max-w-6xl">
          <h1 className="text-4xl font-bold text-gray-900">
            {locale === 'bn' ? 'গ্যালারি' : 'Gallery'}
          </h1>

          <p className="mt-3 text-gray-600">
            {locale === 'bn'
              ? 'আমাদের কার্যক্রম ও স্মরণীয় মুহূর্তের ছবি দেখুন।'
              : 'Explore photos from our activities and memorable moments.'}
          </p>
        </div>
      </section>

      <section className="px-6 py-12">
        <div className="mx-auto max-w-6xl space-y-12">
          {albums.length === 0 ? (
            <div className="rounded-xl bg-white p-10 text-center shadow">
              <p className="text-gray-500">
                {locale === 'bn'
                  ? 'এখনও কোনো গ্যালারি অ্যালবাম নেই।'
                  : 'No gallery albums available yet.'}
              </p>
            </div>
          ) : (
            albums.map((album) => (
              <article
                key={album.id}
                className="rounded-2xl bg-white p-6 shadow"
              >
                <h2 className="text-2xl font-bold text-gray-900">
                  {localized(
                    locale,
                    album.title_bn,
                    album.title_en,
                  )}
                </h2>

                {(album.description_bn || album.description_en) && (
                  <p className="mt-2 text-gray-600">
                    {localized(
                      locale,
                      album.description_bn,
                      album.description_en,
                    )}
                  </p>
                )}

                {album.items && album.items.length > 0 ? (
                  <div className="mt-6 grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                    {album.items.map((item) => {
                      const imageUrl = resolveMediaUrl(
                        item.image_url || item.file_url,
                      );

                      if (!imageUrl) return null;

                      return (
                        <div
                          key={item.id}
                          className="group overflow-hidden rounded-xl bg-gray-100"
                        >
                          <img
                            src={imageUrl}
                            alt={localized(
                              locale,
                              item.title_bn,
                              item.title_en,
                              localized(
                                locale,
                                album.title_bn,
                                album.title_en,
                                'Gallery image',
                              ),
                            )}
                            className="h-64 w-full object-cover transition duration-300 group-hover:scale-105"
                          />

                          {(item.title_bn || item.title_en) && (
                            <div className="p-3">
                              <p className="font-medium text-gray-800">
                                {localized(
                                  locale,
                                  item.title_bn,
                                  item.title_en,
                                )}
                              </p>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <p className="mt-6 text-gray-500">
                    {locale === 'bn'
                      ? 'এই অ্যালবামে এখনও কোনো ছবি নেই।'
                      : 'No images in this album yet.'}
                  </p>
                )}
              </article>
            ))
          )}
        </div>
      </section>
    </main>
  );
}
