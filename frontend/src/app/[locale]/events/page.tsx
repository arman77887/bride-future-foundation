import Link from 'next/link';
import { api } from '@/services/api';

type Locale = 'bn' | 'en';

interface EventItem {
  id: string;
  slug: string;
  title_bn?: string | null;
  title_en?: string | null;
  location_bn?: string | null;
  location_en?: string | null;
  start_time?: string | null;
  end_time?: string | null;
  cover_image_url?: string | null;
}

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

  const baseUrl =
    process.env.NEXT_PUBLIC_API_BASE_URL?.replace(
      /\/api\/v1\/?$/,
      '',
    ) || 'http://localhost:8000';

  return `${baseUrl}${url.startsWith('/') ? url : `/${url}`}`;
}

export default async function EventsPage({
  params,
}: {
  params: { locale: string };
}) {
  const locale: Locale = params.locale === 'en' ? 'en' : 'bn';

  let events: EventItem[] = [];

  try {
    const response = await api.get('/events');
    events = Array.isArray(response.data?.data)
      ? response.data.data
      : [];
  } catch (error) {
    console.error('Events API error:', error);
  }

  return (
    <main className="min-h-screen bg-gray-50">
      <section className="bg-gray-950 px-5 py-20 text-white sm:px-8 lg:px-10">
        <div className="mx-auto max-w-7xl">
          <p className="text-sm font-bold uppercase tracking-widest text-emerald-400">
            {locale === 'bn' ? 'আমাদের কার্যক্রম' : 'Our Activities'}
          </p>

          <h1 className="mt-3 text-4xl font-black sm:text-5xl">
            {locale === 'bn' ? 'ইভেন্টসমূহ' : 'Events'}
          </h1>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 py-16 sm:px-8 lg:px-10">
        {events.length === 0 ? (
          <div className="rounded-2xl border border-gray-200 bg-white p-10 text-center text-gray-500">
            {locale === 'bn'
              ? 'এই মুহূর্তে কোনো ইভেন্ট নেই।'
              : 'No events available at the moment.'}
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {events.map((item) => {
              const title = localized(
                locale,
                item.title_bn,
                item.title_en,
                locale === 'bn' ? 'ইভেন্ট' : 'Event',
              );

              const location = localized(
                locale,
                item.location_bn,
                item.location_en,
              );

              const imageUrl = resolveMediaUrl(
                item.cover_image_url,
              );

              const href = `/${locale}/events/${item.slug}`;

              return (
                <article
                  key={item.id}
                  className="group overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-xl"
                >
                  <Link href={href} className="block">
                    {imageUrl ? (
                      <img
                        src={imageUrl}
                        alt={title}
                        className="h-56 w-full object-cover transition duration-300 group-hover:scale-[1.02]"
                      />
                    ) : (
                      <div className="flex h-56 items-center justify-center bg-emerald-50 text-sm font-bold text-emerald-700">
                        {locale === 'bn' ? 'ছবি নেই' : 'No image'}
                      </div>
                    )}
                  </Link>

                  <div className="p-6">
                    {item.start_time && (
                      <p className="text-xs font-bold uppercase tracking-wider text-emerald-700">
                        {new Date(item.start_time).toLocaleDateString(
                          locale === 'bn' ? 'bn-BD' : 'en-US',
                        )}
                      </p>
                    )}

                    <h2 className="mt-3 text-xl font-black text-gray-900">
                      <Link
                        href={href}
                        className="transition hover:text-emerald-700"
                      >
                        {title}
                      </Link>
                    </h2>

                    {location && (
                      <p className="mt-3 text-sm font-medium text-gray-500">
                        {location}
                      </p>
                    )}

                    <Link
                      href={href}
                      className="mt-5 inline-flex font-bold text-emerald-700 transition hover:text-emerald-900"
                    >
                      {locale === 'bn'
                        ? 'বিস্তারিত দেখুন →'
                        : 'View details →'}
                    </Link>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </section>
    </main>
  );
}
