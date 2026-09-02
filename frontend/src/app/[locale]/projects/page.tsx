import { api } from '@/services/api';

type Locale = 'bn' | 'en';

interface Project {
  id: string;
  title_bn?: string;
  title_en?: string;
  description_bn?: string;
  description_en?: string;
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

export default async function ProjectsPage({
  params,
}: {
  params: { locale: string };
}) {
  const locale: Locale = params.locale === 'en' ? 'en' : 'bn';

  let projects: Project[] = [];

  try {
    const response = await api.get('/projects');

    projects = Array.isArray(response.data?.data)
      ? response.data.data
      : [];
  } catch (error) {
    console.error('Projects API error:', error);
    projects = [];
  }

  return (
    <main className="min-h-screen bg-gray-50">
      <section className="bg-gray-950 px-5 py-20 text-white sm:px-8 lg:px-10">
        <div className="mx-auto max-w-7xl">
          <p className="text-sm font-bold uppercase tracking-widest text-emerald-400">
            {locale === 'bn' ? 'আমাদের কাজ' : 'Our Work'}
          </p>

          <h1 className="mt-3 text-4xl font-black sm:text-5xl">
            {locale === 'bn' ? 'প্রকল্পসমূহ' : 'Our Projects'}
          </h1>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 py-16 sm:px-8 lg:px-10">
        {projects.length === 0 ? (
          <div className="rounded-2xl border border-gray-200 bg-white p-10 text-center text-gray-500">
            {locale === 'bn'
              ? 'এই মুহূর্তে কোনো প্রকল্প নেই।'
              : 'No projects available at the moment.'}
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {projects.map((item, index) => {
              const title = localized(
                locale,
                item.title_bn,
                item.title_en,
                locale === 'bn' ? 'প্রকল্প' : 'Project',
              );

              const description = localized(
                locale,
                item.description_bn,
                item.description_en,
                '',
              );

              const imageUrl = resolveMediaUrl(
                item.cover_image_url,
              );

              return (
                <article
                  key={item.id || index}
                  className="group overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-xl"
                >
                  {imageUrl ? (
                    <img
                      src={imageUrl}
                      alt={title}
                      className="h-56 w-full object-cover transition duration-300 group-hover:scale-[1.02]"
                    />
                  ) : (
                    <div className="flex h-56 items-center justify-center bg-emerald-50 text-sm font-bold text-emerald-700">
                      {locale === 'bn'
                        ? 'ছবি নেই'
                        : 'No image'}
                    </div>
                  )}

                  <div className="p-6">
                    <h2 className="text-xl font-black text-gray-900">
                      {title}
                    </h2>

                    {description && (
                      <p className="mt-3 leading-7 text-gray-600">
                        {description}
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
