'use client';

import Link from 'next/link';
import { useState } from 'react';

export default function Navbar({
  locale,
}: {
  locale: string;
}) {
  const [open, setOpen] = useState(false);

  const isBn = locale === 'bn';

  const menu = [
    {
      bn: 'হোম',
      en: 'Home',
      href: `/${locale}`,
    },
    {
      bn: 'আমাদের সম্পর্কে',
      en: 'About Us',
      href: `/${locale}/about`,
    },
    {
      bn: 'কার্যক্রম',
      en: 'Activities',
      href: `/${locale}/projects`,
    },
    {
      bn: 'কর্মকর্তাবৃন্দ',
      en: 'Officers',
      href: `/${locale}/officers`,
    },
    {
      bn: 'চাকরির সুযোগ',
      en: 'Vacancies',
      href: `/${locale}/vacancies`,
    },
    {
      bn: 'গ্যালারি',
      en: 'Gallery',
      href: `/${locale}/gallery`,
    },
    {
      bn: 'নিউজ / ব্লগ',
      en: 'News / Blog',
      href: `/${locale}/news`,
    },
    {
      bn: 'নোটিশ',
      en: 'Notice',
      href: `/${locale}/notices`,
    },
    {
      bn: 'যোগাযোগ',
      en: 'Contact',
      href: `/${locale}/contact`,
    },
  ];

  return (
    <>
      <header className="sticky top-0 z-50 border-b border-gray-200 bg-white/95 shadow-sm backdrop-blur">
        <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-5 sm:px-8 lg:px-10">

          {/* LOGO */}
          <Link
            href={`/${locale}`}
            onClick={() => setOpen(false)}
            className="flex items-center gap-3"
          >
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-700 text-2xl text-white shadow-md">
              B
            </div>

            <div>
              <div className="text-lg font-black leading-tight text-gray-900 sm:text-xl">
                {isBn ? 'ব্রাইড ফিউচার ফাউন্ডেশন' : 'Bride Future Foundation'}
              </div>

              <div className="text-xs font-medium text-emerald-700">
                {isBn
                  ? 'মানুষের পাশে, ভবিষ্যতের পথে'
                  : 'Standing With People, Building the Future'}
              </div>
            </div>
          </Link>

          {/* DESKTOP NAV */}
          <nav className="hidden items-center gap-6 lg:flex">
            {menu.slice(0, 6).map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="text-sm font-semibold text-gray-700 transition hover:text-emerald-700"
              >
                {isBn ? item.bn : item.en}
              </Link>
            ))}

            <Link
              href={`/${locale}/donate`}
              className="rounded-xl bg-emerald-700 px-5 py-2.5 text-sm font-bold text-white shadow-md transition hover:-translate-y-0.5 hover:bg-emerald-800"
            >
              {isBn ? 'অনুদান দিন' : 'Donate'}
            </Link>

            <Link
              href={locale === 'bn' ? '/en' : '/bn'}
              className="rounded-lg border border-gray-300 px-3 py-2 text-sm font-bold text-gray-700 hover:border-emerald-500 hover:text-emerald-700"
            >
              {locale === 'bn' ? 'EN' : 'বাংলা'}
            </Link>
          </nav>

          {/* MOBILE BUTTON */}
          <button
            type="button"
            aria-label={open ? 'Close menu' : 'Open menu'}
            onClick={() => setOpen(!open)}
            className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-700 text-white shadow-md lg:hidden"
          >
            {open ? (
              <span className="text-3xl leading-none">×</span>
            ) : (
              <span className="text-2xl leading-none">☰</span>
            )}
          </button>
        </div>
      </header>

      {/* MOBILE SIDE MENU */}
      {open && (
        <div className="fixed inset-0 z-[60] lg:hidden">

          {/* Overlay */}
          <button
            aria-label="Close menu"
            onClick={() => setOpen(false)}
            className="absolute inset-0 bg-black/40"
          />

          {/* Drawer */}
          <aside className="absolute right-0 top-0 h-full w-[88%] max-w-md overflow-y-auto bg-white shadow-2xl">

            {/* Drawer Header */}
            <div className="flex h-20 items-center justify-between border-b border-gray-200 px-5">
              <Link
                href={`/${locale}`}
                onClick={() => setOpen(false)}
                className="flex items-center gap-3"
              >
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-700 font-black text-xl text-white">
                  B
                </div>

                <div>
                  <div className="font-black text-gray-900">
                    {isBn
                      ? 'ব্রাইড ফিউচার ফাউন্ডেশন'
                      : 'Bride Future Foundation'}
                  </div>

                  <div className="text-xs text-emerald-700">
                    {isBn ? 'মানুষের পাশে' : 'Building the Future'}
                  </div>
                </div>
              </Link>

              <button
                onClick={() => setOpen(false)}
                className="text-4xl font-light text-gray-500 hover:text-gray-900"
              >
                ×
              </button>
            </div>

            {/* Menu */}
            <div className="px-7 py-7">
              <nav className="space-y-1">
                {menu.map((item, index) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setOpen(false)}
                    className={`block border-b border-gray-100 py-4 text-xl font-semibold transition ${
                      index === 0
                        ? 'text-emerald-700'
                        : 'text-gray-800 hover:pl-2 hover:text-emerald-700'
                    }`}
                  >
                    {isBn ? item.bn : item.en}
                  </Link>
                ))}
              </nav>

              {/* Donate */}
              <Link
                href={`/${locale}/donate`}
                onClick={() => setOpen(false)}
                className="mt-8 flex items-center justify-center rounded-xl bg-emerald-700 px-6 py-4 text-lg font-bold text-white shadow-lg transition hover:bg-emerald-800"
              >
                ❤️ {isBn ? 'অনুদান দিন' : 'Donate Now'}
              </Link>

              {/* Language */}
              <div className="mt-5 grid grid-cols-2 overflow-hidden rounded-xl border border-gray-200">
                <Link
                  href={`/bn`}
                  onClick={() => setOpen(false)}
                  className={`py-4 text-center font-bold ${
                    locale === 'bn'
                      ? 'bg-emerald-100 text-emerald-800'
                      : 'bg-white text-gray-700'
                  }`}
                >
                  বাংলা
                </Link>

                <Link
                  href={`/en`}
                  onClick={() => setOpen(false)}
                  className={`border-l border-gray-200 py-4 text-center font-bold ${
                    locale === 'en'
                      ? 'bg-emerald-100 text-emerald-800'
                      : 'bg-white text-gray-700'
                  }`}
                >
                  EN
                </Link>
              </div>
            </div>
          </aside>
        </div>
      )}
    </>
  );
}
