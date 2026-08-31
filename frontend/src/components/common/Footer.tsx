'use client';

import Link from 'next/link';

export default function Footer({ locale }: { locale?: string }) {
  const currentLocale = locale === 'en' ? 'en' : 'bn';
  const isBn = currentLocale === 'bn';

  const links = [
    {
      bn: 'হোম',
      en: 'Home',
      href: `/${currentLocale}`,
    },
    {
      bn: 'আমাদের সম্পর্কে',
      en: 'About Us',
      href: `/${currentLocale}/about`,
    },
    {
      bn: 'কার্যক্রম',
      en: 'Activities',
      href: `/${currentLocale}/projects`,
    },
    {
      bn: 'কর্মকর্তাবৃন্দ',
      en: 'Officers',
      href: `/${currentLocale}/officers`,
    },
    {
      bn: 'চাকরির সুযোগ',
      en: 'Vacancies',
      href: `/${currentLocale}/vacancies`,
    },
    {
      bn: 'গ্যালারি',
      en: 'Gallery',
      href: `/${currentLocale}/gallery`,
    },
    {
      bn: 'নিউজ / ব্লগ',
      en: 'News / Blog',
      href: `/${currentLocale}/news`,
    },
    {
      bn: 'নোটিশ',
      en: 'Notices',
      href: `/${currentLocale}/notices`,
    },
    {
      bn: 'যোগাযোগ',
      en: 'Contact',
      href: `/${currentLocale}/contact`,
    },
  ];

  return (
    <footer className="bg-gray-950 text-white">
      {/* Main Footer */}
      <div className="mx-auto max-w-7xl px-6 py-16 sm:px-8 lg:px-10">
        <div className="grid gap-12 lg:grid-cols-4">

          {/* Foundation */}
          <div className="lg:col-span-2">
            <Link
              href={`/${currentLocale}`}
              className="inline-flex items-center gap-3"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-700 text-2xl font-black text-white shadow-lg">
                B
              </div>

              <div>
                <div className="text-xl font-black">
                  {isBn
                    ? 'ব্রাইড ফিউচার ফাউন্ডেশন'
                    : 'Bride Future Foundation'}
                </div>

                <div className="mt-1 text-xs font-medium text-emerald-400">
                  {isBn
                    ? 'মানুষের পাশে, ভবিষ্যতের পথে'
                    : 'Standing With People, Building the Future'}
                </div>
              </div>
            </Link>

            <p className="mt-6 max-w-xl leading-8 text-gray-400">
              {isBn
                ? 'মানুষের কল্যাণ, সামাজিক উন্নয়ন এবং একটি সুন্দর ও সম্ভাবনাময় ভবিষ্যৎ গড়ে তোলার লক্ষ্যে আমরা কাজ করি।'
                : 'We work toward human welfare, social development and building a better and more promising future for communities.'}
            </p>

            <Link
              href={`/${currentLocale}/donate`}
              className="mt-7 inline-flex items-center rounded-xl bg-emerald-700 px-6 py-3 font-bold text-white shadow-lg transition hover:-translate-y-0.5 hover:bg-emerald-600"
            >
              ❤️ {isBn ? 'সহযোগিতা করুন' : 'Support Us'}
            </Link>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-black">
              {isBn ? 'গুরুত্বপূর্ণ লিংক' : 'Quick Links'}
            </h3>

            <div className="mt-5 space-y-3">
              {links.slice(0, 5).map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="block text-sm text-gray-400 transition hover:translate-x-1 hover:text-emerald-400"
                >
                  {isBn ? item.bn : item.en}
                </Link>
              ))}
            </div>
          </div>

          {/* More */}
          <div>
            <h3 className="text-lg font-black">
              {isBn ? 'আরও দেখুন' : 'Explore'}
            </h3>

            <div className="mt-5 space-y-3">
              {links.slice(5).map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="block text-sm text-gray-400 transition hover:translate-x-1 hover:text-emerald-400"
                >
                  {isBn ? item.bn : item.en}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Bottom */}
      <div className="border-t border-white/10">
        <div className="mx-auto flex max-w-7xl flex-col gap-3 px-6 py-6 text-sm text-gray-500 sm:px-8 md:flex-row md:items-center md:justify-between lg:px-10">
          <p>
            © {new Date().getFullYear()} Bride Future Foundation.
          </p>

          <p>
            {isBn
              ? 'মানুষের পাশে • ভবিষ্যতের পথে'
              : 'Standing With People • Building the Future'}
          </p>
        </div>
      </div>
    </footer>
  );
}
