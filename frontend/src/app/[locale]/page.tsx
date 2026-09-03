import Link from 'next/link';
import { api } from '@/services/api';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

type Locale = 'bn' | 'en';

interface ContentItem {
  id: string;
  title_bn: string;
  title_en: string;
  slug?: string;
  description_bn?: string;
  description_en?: string;
  content_bn?: string;
  content_en?: string;
  status?: string;
  published_at?: string | null;
  cover_media_id?: string | null;
  cover_image_url?: string | null;
  created_at?: string;
}

interface HomepageContent {
  projects: ContentItem[];
  news: ContentItem[];
  notices: ContentItem[];
}

interface HomepageSettings {
  cover_media_id?: string | null;
  cover_image_url?: string | null;
}

interface PublicStats {
  subscribers: number;
  registered_users: number;
  donations: number;
}

interface SystemSetting {
  key: string;
  value?: string | null;
  type?: string;
  media_url?: string | null;
}

interface HomepageData {
  metadata?: {
    announcement?: {
      enabled?: boolean;
      bn?: string;
      en?: string;
    };
    hero?: {
      badge_bn?: string;
      badge_en?: string;
      title_bn?: string;
      title_en?: string;
      description_bn?: string;
      description_en?: string;
      primary_text_bn?: string;
      primary_text_en?: string;
      primary_link?: string;
      secondary_text_bn?: string;
      secondary_text_en?: string;
      secondary_link?: string;
    };
    commitment?: {
      label_bn?: string;
      label_en?: string;
      title_bn?: string;
      title_en?: string;
      items?: Array<{
        bn: string;
        en: string;
      }>;
    };
    intro?: {
      label_bn?: string;
      label_en?: string;
      title_bn?: string;
      title_en?: string;
      content_bn?: string;
      content_en?: string;
    };
    impact?: {
      items?: Array<{
        number: string;
        bn: string;
        en: string;
      }>;
    };
    activities?: Array<{
      number: string;
      title_bn: string;
      title_en: string;
      text_bn: string;
      text_en: string;
      enabled?: boolean;
    }>;
    mission?: {
      label_bn?: string;
      label_en?: string;
      title_bn?: string;
      title_en?: string;
      content_bn?: string;
      content_en?: string;
    };
    vision?: {
      label_bn?: string;
      label_en?: string;
      title_bn?: string;
      title_en?: string;
      content_bn?: string;
      content_en?: string;
    };
    projects?: {
      label_bn?: string;
      label_en?: string;
      title_bn?: string;
      title_en?: string;
      limit?: number;
    };
    news?: {
      label_bn?: string;
      label_en?: string;
      title_bn?: string;
      title_en?: string;
      limit?: number;
    };
    notices?: {
      label_bn?: string;
      label_en?: string;
      title_bn?: string;
      title_en?: string;
      limit?: number;
    };
    gallery?: {
      label_bn?: string;
      label_en?: string;
      title_bn?: string;
      title_en?: string;
      button_bn?: string;
      button_en?: string;
    };
    donation?: {
      label_bn?: string;
      label_en?: string;
      title_bn?: string;
      title_en?: string;
      content_bn?: string;
      content_en?: string;
      button_bn?: string;
      button_en?: string;
      button_link?: string;
    };
  };
}

async function getHomepage(): Promise<HomepageData | null> {
  try {
    const response = await api.get('/cms-pages/homepage', {
      headers: {
        'Cache-Control': 'no-cache',
      },
    });
    return response.data?.data ?? null;
  } catch (error) {
    console.error('Homepage CMS API error:', error);
    return null;
  }
}

async function getHomepageSettings(): Promise<HomepageSettings> {
  try {
    const response = await api.get('/settings');
    const data = response?.data?.data;

    const settings: SystemSetting[] = Array.isArray(data) ? data : [];

    const cover = settings.find(
      (item) => item.key === 'homepage.cover_media_id'
    );

    return {
      cover_media_id: cover?.value ?? null,
      cover_image_url: cover?.media_url ?? null,
    };
  } catch (error) {
    console.error('Homepage settings API error:', error);
    return {
      cover_media_id: null,
      cover_image_url: null,
    };
  }
}

async function getPublicStats(): Promise<PublicStats> {
  try {
    const response = await api.get('/public/stats', {
      headers: {
        'Cache-Control': 'no-cache',
      },
    });

    return {
      subscribers: Number(response?.data?.data?.subscribers ?? 0),
      registered_users: Number(response?.data?.data?.registered_users ?? 0),
      donations: Number(response?.data?.data?.donations ?? 0),
    };
  } catch (error) {
    console.error('Public stats API error:', error);

    return {
      subscribers: 0,
      registered_users: 0,
      donations: 0,
    };
  }
}

async function getHomepageContent(): Promise<HomepageContent> {
  try {
    const [projectsRes, newsRes, noticesRes] = await Promise.all([
      api.get('/projects'),
      api.get('/news'),
      api.get('/notices'),
    ]);

    const getItems = (response: any): ContentItem[] => {
      const data = response?.data?.data;

      if (Array.isArray(data)) return data;
      if (Array.isArray(data?.data)) return data.data;

      return [];
    };

    return {
      projects: getItems(projectsRes),
      news: getItems(newsRes),
      notices: getItems(noticesRes),
    };
  } catch (error) {
    console.error('Failed to load homepage content:', error);

    return {
      projects: [],
      news: [],
      notices: [],
    };
  }
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

function localized(
  locale: Locale,
  bn?: string,
  en?: string,
  fallback = ''
) {
  return locale === 'bn'
    ? bn || en || fallback
    : en || bn || fallback;
}

export default async function HomePage({
  params,
}: {
  params: { locale: string };
}) {
  const locale: Locale = params.locale === 'en' ? 'en' : 'bn';
  const [cms, homepageContent, homepageSettings, publicStats] =
    await Promise.all([
      getHomepage(),
      getHomepageContent(),
      getHomepageSettings(),
      getPublicStats(),
    ]);

  const projectItems = homepageContent.projects.slice(
    0,
    cms?.metadata?.projects?.limit ?? 3,
  );

  const newsItems = homepageContent.news.slice(
    0,
    cms?.metadata?.news?.limit ?? 3,
  );

  const noticeItems = homepageContent.notices.slice(
    0,
    cms?.metadata?.notices?.limit ?? 3,
  );


  const metadata = cms?.metadata ?? {};

  const announcement = metadata.announcement;
  const hero = metadata.hero;
  const commitment = metadata.commitment;
  const intro = metadata.intro;
  const impact = metadata.impact;
  const activities = metadata.activities ?? [];
  const mission = metadata.mission;
  const vision = metadata.vision;
  const projects = metadata.projects;
  const news = metadata.news;
  const notices = metadata.notices;
  const gallery = metadata.gallery;
  const donation = metadata.donation;

  const coverImageUrl = homepageSettings.cover_image_url
    ? resolveMediaUrl(homepageSettings.cover_image_url)
    : null;

  return (
    <main className="bg-white text-gray-900">

      {/* ANNOUNCEMENT */}
      {announcement?.enabled !== false && (
        <div className="bg-emerald-800 text-white">
          <div className="mx-auto flex max-w-7xl items-center justify-center px-5 py-2.5 text-center text-xs font-medium sm:px-8">
            <span className="mr-2 inline-block h-1.5 w-1.5 rounded-full bg-emerald-200" />
            {localized(
              locale,
              announcement?.bn,
              announcement?.en,
              'Working together for humanity, responsibility and a better future'
            )}
          </div>
        </div>
      )}

      {/* HERO */}
      <section className="relative isolate overflow-hidden bg-gray-950 text-white">
        {/* Homepage Cover Photo */}
        {coverImageUrl && (
          <img
            src={coverImageUrl}
            alt={locale === 'bn' ? 'হোমপেজ কভার ছবি' : 'Homepage cover photo'}
            className="absolute inset-0 h-full w-full object-cover"
          />
        )}

        {/* Readability overlay */}
        <div className="absolute inset-0 bg-gray-950/55" />
        <div className="absolute inset-0 bg-gradient-to-r from-gray-950/90 via-gray-950/65 to-gray-950/35" />
        <div className="absolute inset-0 bg-gradient-to-t from-gray-950/80 via-transparent to-gray-950/20" />

        {/* Decorative glow */}
        <div className="absolute -right-32 -top-32 h-[500px] w-[500px] rounded-full bg-emerald-500/15 blur-3xl" />
        <div className="absolute -bottom-40 -left-20 h-[450px] w-[450px] rounded-full bg-teal-500/10 blur-3xl" />

        <div className="relative mx-auto max-w-7xl px-5 py-24 sm:px-8 sm:py-28 lg:px-10 lg:py-36">
          <div className="grid items-center gap-12 lg:grid-cols-[1.15fr_0.85fr]">

            {/* HERO CONTENT */}
            <div className="bff-reveal max-w-4xl">
              <div className="inline-flex items-center rounded-full border border-emerald-300/30 bg-emerald-950/40 px-4 py-2 text-xs font-bold uppercase tracking-wider text-emerald-200 shadow-lg backdrop-blur-sm">
                {localized(
                  locale,
                  hero?.badge_bn,
                  hero?.badge_en,
                  'Bright Future Foundation'
                )}
              </div>

              <h1 className="mt-7 max-w-4xl text-4xl font-black leading-[1.06] tracking-tight drop-shadow-2xl sm:text-5xl lg:text-7xl">
                {localized(
                  locale,
                  hero?.title_bn,
                  hero?.title_en,
                  'Working for People. Building a Better Future.'
                )}
              </h1>

              <p className="mt-7 max-w-2xl text-base leading-8 text-gray-200 drop-shadow-lg sm:text-lg">
                {localized(
                  locale,
                  hero?.description_bn,
                  hero?.description_en,
                  'We work toward a better and more dignified future through humanitarian support, social development and opportunities for people and communities.'
                )}
              </p>

              <div className="mt-9 flex flex-wrap gap-3">
                <Link
                  href={`/${locale}${hero?.primary_link || '/donate'}`}
                  className="bff-button rounded-xl bg-emerald-600 px-7 py-3.5 text-sm font-bold text-white shadow-xl transition-all duration-200 hover:-translate-y-0.5 hover:bg-emerald-500 active:scale-95"
                >
                  {localized(
                    locale,
                    hero?.primary_text_bn,
                    hero?.primary_text_en,
                    'Support Our Work'
                  )}
                </Link>

                <Link
                  href={`/${locale}${hero?.secondary_link || '/about'}`}
                  className="bff-button rounded-xl border border-white/25 bg-white/10 px-7 py-3.5 text-sm font-bold text-white shadow-lg backdrop-blur-sm transition-all duration-200 hover:-translate-y-0.5 hover:bg-white/20 active:scale-95"
                >
                  {localized(
                    locale,
                    hero?.secondary_text_bn,
                    hero?.secondary_text_en,
                    'Discover Our Work'
                  )}
                </Link>
              </div>
            </div>

            {/* COMMITMENT */}
            <div className="bff-scale hidden lg:block">
              <div className="relative mx-auto max-w-md">
                <div className="absolute -inset-5 rounded-[2rem] border border-white/15" />

                <div className="relative rounded-[2rem] border border-white/15 bg-gray-950/45 p-8 shadow-2xl backdrop-blur-md">
                  <div className="flex items-center justify-between border-b border-white/10 pb-6">
                    <div>
                      <p className="text-xs font-bold uppercase tracking-widest text-emerald-300">
                        {localized(
                          locale,
                          commitment?.label_bn,
                          commitment?.label_en,
                          'Our Commitment'
                        )}
                      </p>

                      <h2 className="mt-2 text-2xl font-black">
                        {localized(
                          locale,
                          commitment?.title_bn,
                          commitment?.title_en,
                          'Moving Forward Together'
                        )}
                      </h2>
                    </div>

                    <div className="flex h-12 w-12 items-center justify-center overflow-hidden rounded-2xl bg-white shadow-lg">
                      {coverImageUrl ? (
                        <img
                          src={coverImageUrl}
                          alt=""
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <span className="flex h-full w-full items-center justify-center bg-emerald-600 text-xl font-black text-white">
                          B
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="space-y-5 pt-6">
                    {(commitment?.items ?? []).map((item, index) => (
                      <div
                        key={`${item.en}-${index}`}
                        className="flex items-center gap-4"
                      >
                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-emerald-500/15 text-sm font-bold text-emerald-300">
                          0{index + 1}
                        </div>

                        <span className="font-semibold text-gray-200">
                          {localized(locale, item.bn, item.en)}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* INTRO */}
      <section className="border-b border-gray-100 bg-white">
        <div className="mx-auto max-w-7xl px-5 py-20 sm:px-8 lg:px-10 lg:py-24">
          <div className="grid gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:items-start">

            <div>
              <p className="text-xs font-black uppercase tracking-[0.2em] text-emerald-700">
                {localized(locale, intro?.label_bn, intro?.label_en, 'Who We Are')}
              </p>

              <h2 className="mt-4 text-3xl font-black leading-tight sm:text-4xl">
                {localized(
                  locale,
                  intro?.title_bn,
                  intro?.title_en,
                  'For A More Caring and Responsible Society'
                )}
              </h2>
            </div>

            <div>
              <p className="text-lg leading-8 text-gray-600">
                {localized(
                  locale,
                  intro?.content_bn,
                  intro?.content_en,
                  'Bright Future Foundation is a humanitarian and social welfare initiative.'
                )}
              </p>

              <Link
                href={`/${locale}/about`}
                className="mt-6 inline-flex items-center font-bold text-emerald-700 transition hover:text-emerald-900"
              >
                {locale === 'bn' ? 'ফাউন্ডেশন সম্পর্কে জানুন' : 'Learn more about us'}
                <span className="ml-2">→</span>
              </Link>
            </div>

          </div>
        </div>
      </section>

      {/* IMPACT */}
      <section className="bg-emerald-50">
        <div className="mx-auto max-w-7xl px-5 py-16 sm:px-8 lg:px-10">
          <div className="grid grid-cols-2 divide-x divide-emerald-200 md:grid-cols-4">
            {[
              {
                number: publicStats.subscribers,
                bn: 'সাবস্ক্রাইবার',
                en: 'Subscribers',
              },
              {
                number: publicStats.registered_users,
                bn: 'নিবন্ধিত ব্যবহারকারী',
                en: 'Registered Users',
              },
              {
                number: publicStats.donations,
                bn: 'অনুদান',
                en: 'Donations',
              },
              {
                number: impact?.items?.[3]?.number ?? '—',
                bn: 'আমাদের প্রভাব',
                en: 'Our Impact',
              },
            ].map((item, index) => (
              <div key={`${item.en}-${index}`} className="px-4 text-center md:px-8">
                <div className="text-3xl font-black text-emerald-800 sm:text-4xl">
                  {item.number}
                </div>

                <div className="mt-2 text-xs font-bold uppercase tracking-wide text-gray-600 sm:text-sm">
                  {localized(locale, item.bn, item.en)}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ACTIVITIES */}
      <section className="bg-white">
        <div className="mx-auto max-w-7xl px-5 py-20 sm:px-8 lg:px-10 lg:py-24">

          <div className="flex flex-col justify-between gap-5 md:flex-row md:items-end">
            <div className="max-w-2xl">
              <p className="text-xs font-black uppercase tracking-[0.2em] text-emerald-700">
                {locale === 'bn' ? 'আমরা কী করি' : 'What We Do'}
              </p>

              <h2 className="mt-3 text-3xl font-black sm:text-4xl">
                {locale === 'bn' ? 'আমাদের কার্যক্রম' : 'Our Areas of Work'}
              </h2>
            </div>

            <Link
              href={`/${locale}/projects`}
              className="font-bold text-emerald-700 hover:text-emerald-900"
            >
              {locale === 'bn' ? 'সব কার্যক্রম দেখুন →' : 'View all activities →'}
            </Link>
          </div>

          <div className="mt-12 grid gap-5 md:grid-cols-3">
            {activities
              .filter((item) => item.enabled !== false)
              .map((item) => (
                <div
                  key={item.number}
                  className="group rounded-2xl border border-gray-200 bg-white p-7 transition duration-300 hover:-translate-y-1 hover:border-emerald-200 hover:shadow-xl"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-black text-emerald-700">
                      {item.number}
                    </span>

                    <span className="text-xl text-gray-300 transition group-hover:text-emerald-500">
                      ↗
                    </span>
                  </div>

                  <h3 className="mt-10 text-xl font-black">
                    {localized(locale, item.title_bn, item.title_en)}
                  </h3>

                  <p className="mt-4 leading-7 text-gray-600">
                    {localized(locale, item.text_bn, item.text_en)}
                  </p>

                  <div className="mt-7 h-1 w-10 rounded-full bg-emerald-600 transition-all group-hover:w-20" />
                </div>
              ))}
          </div>

        </div>
      </section>

      {/* MISSION / VISION */}
      <section className="bg-gray-950 text-white">
        <div className="mx-auto max-w-7xl px-5 py-20 sm:px-8 lg:px-10 lg:py-24">

          <div className="grid gap-6 md:grid-cols-2">

            <div className="rounded-3xl bg-emerald-800 p-8 sm:p-10">
              <span className="text-xs font-black uppercase tracking-[0.2em] text-emerald-200">
                {localized(locale, mission?.label_bn, mission?.label_en, 'Our Mission')}
              </span>

              <h2 className="mt-5 text-2xl font-black sm:text-3xl">
                {localized(
                  locale,
                  mission?.title_bn,
                  mission?.title_en,
                  'Creating meaningful impact for people'
                )}
              </h2>

              <p className="mt-5 leading-8 text-emerald-50">
                {localized(
                  locale,
                  mission?.content_bn,
                  mission?.content_en
                )}
              </p>
            </div>

            <div className="rounded-3xl border border-white/10 bg-white/[0.05] p-8 sm:p-10">
              <span className="text-xs font-black uppercase tracking-[0.2em] text-emerald-300">
                {localized(locale, vision?.label_bn, vision?.label_en, 'Our Vision')}
              </span>

              <h2 className="mt-5 text-2xl font-black sm:text-3xl">
                {localized(
                  locale,
                  vision?.title_bn,
                  vision?.title_en,
                  'Building a future full of possibility'
                )}
              </h2>

              <p className="mt-5 leading-8 text-gray-300">
                {localized(
                  locale,
                  vision?.content_bn,
                  vision?.content_en
                )}
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* PROJECTS */}
      <section className="bg-white">
        <div className="mx-auto max-w-7xl px-5 py-20 sm:px-8 lg:px-10">
          <div className="flex items-center justify-between border-b border-gray-200 pb-5">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.2em] text-emerald-700">
                {localized(
                  locale,
                  projects?.label_bn,
                  projects?.label_en,
                  'Our Projects',
                )}
              </p>

              <h2 className="mt-2 text-2xl font-black">
                {localized(
                  locale,
                  projects?.title_bn,
                  projects?.title_en,
                  'Projects',
                )}
              </h2>
            </div>

            <Link
              href={`/${locale}/projects`}
              className="text-sm font-bold text-emerald-700"
            >
              {locale === 'bn' ? 'সব দেখুন' : 'View all'}
            </Link>
          </div>

          <div className="mt-8 grid gap-6 md:grid-cols-3">
            {projectItems.map((item) => {
              const title =
                locale === 'bn' ? item.title_bn : item.title_en;

              const description =
                locale === 'bn'
                  ? item.description_bn
                  : item.description_en;

              const imageUrl = resolveMediaUrl(item.cover_image_url);

              return (
                <Link
                  key={item.id}
                  href={`/${locale}/projects`}
                  className="group overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
                >
                  {imageUrl ? (
                    <img
                      src={imageUrl}
                      alt={title}
                      className="h-52 w-full object-cover transition duration-300 group-hover:scale-[1.02]"
                    />
                  ) : (
                    <div className="flex h-52 items-center justify-center bg-emerald-50 text-sm font-bold text-emerald-700">
                      {locale === 'bn' ? 'ছবি নেই' : 'No image'}
                    </div>
                  )}

                  <div className="p-6">
                    <h3 className="font-black text-gray-900 group-hover:text-emerald-700">
                      {title}
                    </h3>

                    {description && (
                      <p className="mt-2 line-clamp-3 text-sm leading-6 text-gray-500">
                        {description}
                      </p>
                    )}
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* NEWS + NOTICES */}
      <section className="bg-gray-50">
        <div className="mx-auto max-w-7xl px-5 py-20 sm:px-8 lg:px-10">
          <div className="grid gap-12 lg:grid-cols-2">

            {/* NEWS */}
            <div>
              <div className="flex items-center justify-between border-b border-gray-200 pb-5">
                <div>
                  <p className="text-xs font-black uppercase tracking-[0.2em] text-emerald-700">
                    {localized(
                      locale,
                      news?.label_bn,
                      news?.label_en,
                      'Latest',
                    )}
                  </p>

                  <h2 className="mt-2 text-2xl font-black">
                    {localized(
                      locale,
                      news?.title_bn,
                      news?.title_en,
                      'News & Updates',
                    )}
                  </h2>
                </div>

                <Link
                  href={`/${locale}/news`}
                  className="text-sm font-bold text-emerald-700"
                >
                  {locale === 'bn' ? 'সব দেখুন' : 'View all'}
                </Link>
              </div>

              <div className="divide-y divide-gray-100">
                {newsItems.map((item) => {
                  const title =
                    locale === 'bn' ? item.title_bn : item.title_en;

                  const content =
                    locale === 'bn'
                      ? item.content_bn
                      : item.content_en;

                  const imageUrl = resolveMediaUrl(item.cover_image_url);

                  return (
                    <Link
                      key={item.id}
                      href={`/${locale}/news`}
                      className="group flex gap-5 py-6"
                    >
                      {imageUrl ? (
                        <img
                          src={imageUrl}
                          alt={title}
                          className="h-20 w-28 shrink-0 rounded-xl object-cover"
                        />
                      ) : (
                        <div className="flex h-20 w-28 shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-[9px] font-bold text-emerald-700">
                          NEWS
                        </div>
                      )}

                      <div>
                        <h3 className="font-bold text-gray-900 group-hover:text-emerald-700">
                          {title}
                        </h3>

                        {content && (
                          <p className="mt-1 line-clamp-2 text-sm text-gray-500">
                            {content}
                          </p>
                        )}
                      </div>
                    </Link>
                  );
                })}
              </div>
            </div>

            {/* NOTICES */}
            <div>
              <div className="flex items-center justify-between border-b border-gray-200 pb-5">
                <div>
                  <p className="text-xs font-black uppercase tracking-[0.2em] text-emerald-700">
                    {localized(
                      locale,
                      notices?.label_bn,
                      notices?.label_en,
                      'Important Information',
                    )}
                  </p>

                  <h2 className="mt-2 text-2xl font-black">
                    {localized(
                      locale,
                      notices?.title_bn,
                      notices?.title_en,
                      'Notices',
                    )}
                  </h2>
                </div>

                <Link
                  href={`/${locale}/notices`}
                  className="text-sm font-bold text-emerald-700"
                >
                  {locale === 'bn' ? 'সব দেখুন' : 'View all'}
                </Link>
              </div>

              <div className="divide-y divide-gray-100">
                {noticeItems.map((item) => {
                  const title =
                    locale === 'bn' ? item.title_bn : item.title_en;

                  const content =
                    locale === 'bn'
                      ? item.content_bn
                      : item.content_en;

                  const imageUrl = resolveMediaUrl(item.cover_image_url);

                  return (
                    <Link
                      key={item.id}
                      href={`/${locale}/notices`}
                      className="group flex gap-4 py-6"
                    >
                      {imageUrl ? (
                        <img
                          src={imageUrl}
                          alt={title}
                          className="h-20 w-28 shrink-0 rounded-xl object-cover"
                        />
                      ) : (
                        <span className="mt-2 h-2 w-2 shrink-0 rounded-full bg-emerald-600" />
                      )}

                      <div>
                        <h3 className="font-bold text-gray-900 group-hover:text-emerald-700">
                          {title}
                        </h3>

                        {content && (
                          <p className="mt-2 line-clamp-2 text-sm text-gray-500">
                            {content}
                          </p>
                        )}
                      </div>
                    </Link>
                  );
                })}
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* GALLERY */}
      <section className="bg-emerald-50">
        <div className="mx-auto max-w-7xl px-5 py-16 sm:px-8 lg:px-10">
          <div className="flex flex-col justify-between gap-6 rounded-3xl border border-emerald-100 bg-white p-8 shadow-sm md:flex-row md:items-center sm:p-10">

            <div>
              <p className="text-xs font-black uppercase tracking-[0.2em] text-emerald-700">
                {localized(locale, gallery?.label_bn, gallery?.label_en, 'Our Moments')}
              </p>

              <h2 className="mt-3 text-2xl font-black sm:text-3xl">
                {localized(
                  locale,
                  gallery?.title_bn,
                  gallery?.title_en,
                  'Explore moments from our activities'
                )}
              </h2>
            </div>

            <Link
              href={`/${locale}/gallery`}
              className="shrink-0 rounded-xl bg-gray-950 px-6 py-3.5 text-center text-sm font-bold text-white transition hover:bg-emerald-800"
            >
              {localized(locale, gallery?.button_bn, gallery?.button_en, 'View Gallery')}
            </Link>

          </div>
        </div>
      </section>

      {/* DONATION */}
      <section className="bg-white">
        <div className="mx-auto max-w-7xl px-5 py-20 sm:px-8 lg:px-10 lg:py-24">

          <div className="relative overflow-hidden rounded-[2rem] bg-gradient-to-br from-emerald-900 to-teal-700 px-7 py-14 text-center text-white shadow-2xl sm:px-12 sm:py-16">

            <div className="absolute -right-24 -top-24 h-64 w-64 rounded-full bg-white/5" />
            <div className="absolute -bottom-32 -left-20 h-72 w-72 rounded-full bg-white/5" />

            <div className="relative">

              <p className="text-xs font-black uppercase tracking-[0.2em] text-emerald-200">
                {localized(locale, donation?.label_bn, donation?.label_en, 'Be Part of the Change')}
              </p>

              <h2 className="mx-auto mt-4 max-w-3xl text-3xl font-black sm:text-4xl lg:text-5xl">
                {localized(
                  locale,
                  donation?.title_bn,
                  donation?.title_en,
                  'Your support can help build a better future'
                )}
              </h2>

              <p className="mx-auto mt-5 max-w-2xl leading-8 text-emerald-50">
                {localized(
                  locale,
                  donation?.content_bn,
                  donation?.content_en
                )}
              </p>

              <Link
                href={`/${locale}${donation?.button_link || '/donate'}`}
                className="mt-8 inline-flex rounded-xl bg-white px-8 py-3.5 font-bold text-emerald-900 shadow-lg transition hover:-translate-y-0.5 hover:bg-emerald-50"
              >
                {localized(
                  locale,
                  donation?.button_bn,
                  donation?.button_en,
                  'Support the Foundation →'
                )}
              </Link>

            </div>
          </div>

        </div>
      </section>

    </main>
  );
}
