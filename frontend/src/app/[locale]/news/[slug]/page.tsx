import Link from 'next/link';
import { notFound } from 'next/navigation';
import { api } from '@/services/api';

type Locale = 'bn' | 'en';

type ContentItem = {
  id: string;
  slug: string;
  title_bn?: string | null;
  title_en?: string | null;
  content_bn?: string | null;
  content_en?: string | null;
  cover_image_url?: string | null;
  published_at?: string | null;
  start_time?: string | null;
  end_time?: string | null;
  location_bn?: string | null;
  location_en?: string | null;
  registration_link?: string | null;
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
  if (/^https?:\/\//i.test(url)) return url;

  const base =
    process.env.NEXT_PUBLIC_API_BASE_URL?.replace(/\/api\/v1\/?$/, '') ||
    'http://localhost:8000';

  return `${base}${url.startsWith('/') ? url : `/${url}`}`;
}

export default async function DetailPage({
  params,
}: {
  params: { locale: string; slug: string };
}) {
  const locale: Locale = params.locale === 'en' ? 'en' : 'bn';

  let item: ContentItem | null = null;

  try {
    const response = await api.get(
      '/news/' + encodeURIComponent(params.slug),
    );
    item = response.data?.data || null;
  } catch {
    notFound();
  }

  if (!item) notFound();

  const title = localized(
    locale,
    item.title_bn,
    item.title_en,
    locale === 'bn' ? 'নিউজ ও আপডেট' : 'News & Updates',
  );

  const content = localized(
    locale,
    item.content_bn,
    item.content_en,
  );

  const imageUrl = resolveMediaUrl(item.cover_image_url);

  const location = localized(
    locale,
    item.location_bn,
    item.location_en,
  );

  const dateValue =
    item.published_at || item.start_time || null;

  return (
    <main className="min-h-screen bg-[#f7faf9]">
      <section className="bg-gradient-to-br from-emerald-950 via-emerald-800 to-teal-700 px-5 py-14 text-white sm:px-8 lg:px-10">
        <div className="mx-auto max-w-5xl">
          <Link
            href={`/${locale}/news`}
            className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-sm font-semibold backdrop-blur transition hover:bg-white/20"
          >
            ← {locale === 'bn' ? 'সব নিউজ' : 'All News'}
          </Link>

          <p className="mt-8 text-sm font-bold uppercase tracking-widest text-emerald-200">
            {locale === 'bn' ? 'নিউজ ও আপডেট' : 'News & Updates'}
          </p>

          <h1 className="mt-3 max-w-4xl text-3xl font-black leading-tight sm:text-5xl">
            {title}
          </h1>

          {(dateValue || location) && (
            <div className="mt-6 flex flex-wrap gap-3 text-sm text-emerald-50">
              {dateValue && (
                <span className="rounded-full bg-white/10 px-4 py-2">
                  {new Date(dateValue).toLocaleDateString(
                    locale === 'bn' ? 'bn-BD' : 'en-US',
                  )}
                </span>
              )}

              {location && (
                <span className="rounded-full bg-white/10 px-4 py-2">
                  {location}
                </span>
              )}
            </div>
          )}
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-5 py-10 sm:px-8 sm:py-14">
        <article className="overflow-hidden rounded-3xl border border-gray-100 bg-white shadow-sm">
          {imageUrl && (
            <img
              src={imageUrl}
              alt={title}
              className="max-h-[620px] w-full object-cover"
            />
          )}

          <div className="p-6 sm:p-10">
            <h2 className="text-2xl font-black text-gray-900 sm:text-3xl">
              {title}
            </h2>

            {content && (
              <div className="mt-6 whitespace-pre-line text-base leading-8 text-gray-700 sm:text-lg">
                {content}
              </div>
            )}

            {item.registration_link && (
              <a
                href={item.registration_link}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-8 inline-flex rounded-xl bg-emerald-700 px-5 py-3 text-sm font-bold text-white transition hover:bg-emerald-800"
              >
                {locale === 'bn'
                  ? 'রেজিস্ট্রেশন করুন'
                  : 'Register'}
              </a>
            )}
          </div>
        </article>
      </section>
    </main>
  );
}
