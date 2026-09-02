import { api } from '@/services/api';

type Locale = 'bn' | 'en';

interface NoticeItem {
  id: string;
  title_bn?: string;
  title_en?: string;
  content_bn?: string;
  content_en?: string;
  expires_at?: string | null;
  status?: string;
  cover_image_url?: string | null;
}

function localized(
  locale: Locale,
  bn?: string,
  en?: string,
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

  const baseUrl =
    process.env.NEXT_PUBLIC_API_BASE_URL?.replace(
      /\/api\/v1\/?$/,
      '',
    ) || 'http://localhost:8000';

  return `${baseUrl}${url.startsWith('/') ? url : `/${url}`}`;
}

export default async function NoticesPage({
  params,
}: {
  params: { locale: string };
}) {
  const locale: Locale = params.locale === 'en' ? 'en' : 'bn';

  let notices: NoticeItem[] = [];

  try {
    const response = await api.get('/notices');

    notices = Array.isArray(response.data?.data)
      ? response.data.data
      : [];
  } catch (error) {
    console.error('Notices API error:', error);
    notices = [];
  }

  return (
    <main className="min-h-screen bg-gray-50">
      <section className="bg-gray-950 px-5 py-20 text-white sm:px-8 lg:px-10">
        <div className="mx-auto max-w-7xl">
          <p className="text-sm font-bold uppercase tracking-widest text-emerald-400">
            {locale === 'bn'
              ? 'গুরুত্বপূর্ণ তথ্য'
              : 'Important Information'}
          </p>

          <h1 className="mt-3 text-4xl font-black sm:text-5xl">
            {locale === 'bn' ? 'নোটিশ' : 'Notices'}
          </h1>
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-5 py-16 sm:px-8">
        {notices.length === 0 ? (
          <div className="rounded-2xl border border-gray-200 bg-white p-10 text-center text-gray-500">
            {locale === 'bn'
              ? 'এই মুহূর্তে কোনো নোটিশ নেই।'
              : 'No notices available at the moment.'}
          </div>
        ) : (
          <div className="space-y-6">
            {notices.map((item, index) => {
              const title = localized(
                locale,
                item.title_bn,
                item.title_en,
                locale === 'bn' ? 'নোটিশ' : 'Notice',
              );

              const content = localized(
                locale,
                item.content_bn,
                item.content_en,
                '',
              );

              const imageUrl = resolveMediaUrl(
                item.cover_image_url,
              );

              return (
                <article
                  key={item.id || index}
                  className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm transition duration-300 hover:shadow-lg"
                >
                  {imageUrl ? (
                    <img
                      src={imageUrl}
                      alt={title}
                      className="h-64 w-full object-cover"
                    />
                  ) : (
                    <div className="flex h-32 items-center justify-center bg-emerald-50 text-sm font-bold text-emerald-700">
                      {locale === 'bn'
                        ? 'ছবি নেই'
                        : 'No image'}
                    </div>
                  )}

                  <div className="p-6">
                    <h2 className="text-xl font-black text-gray-900">
                      {title}
                    </h2>

                    {content && (
                      <p className="mt-3 leading-7 text-gray-600">
                        {content}
                      </p>
                    )}

                    {item.expires_at && (
                      <p className="mt-4 text-xs font-semibold text-gray-500">
                        {locale === 'bn'
                          ? `মেয়াদ: ${new Date(item.expires_at).toLocaleDateString('bn-BD')}`
                          : `Expires: ${new Date(item.expires_at).toLocaleDateString('en-US')}`}
                      </p>
                    )}
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
