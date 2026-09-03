'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { api } from '../../services/api';
import { useAuthStore } from '../../store/useAuthStore';

export default function Navbar({
  locale,
}: {
  locale: string;
}) {
  const [open, setOpen] = useState(false);
  const [activitiesOpen, setActivitiesOpen] = useState(false);
  const [logoUrl, setLogoUrl] = useState<string | null>(null);

  const user = useAuthStore((state) => state.user);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const isLoading = useAuthStore((state) => state.isLoading);
  const restore = useAuthStore((state) => state.restore);
  const logout = useAuthStore((state) => state.logout);

  useEffect(() => {
    restore();
  }, [restore]);

  useEffect(() => {
    let mounted = true;

    const loadLogo = async () => {
      try {
        const response = await api.get('/settings');
        const settings = Array.isArray(response?.data?.data)
          ? response.data.data
          : [];

        const logo = settings.find(
          (item: { key?: string }) => item.key === 'site.logo_media_id'
        );

        if (!mounted || !logo?.media_url) return;

        const apiBase =
          process.env.NEXT_PUBLIC_API_BASE_URL ||
          'http://127.0.0.1:8000/api/v1';

        const backendBase = apiBase.replace(/\/api\/v1\/?$/, '');

        setLogoUrl(
          logo.media_url.startsWith('http')
            ? logo.media_url
            : `${backendBase}${logo.media_url}`
        );
      } catch {
        if (mounted) {
          setLogoUrl(null);
        }
      }
    };

    loadLogo();

    return () => {
      mounted = false;
    };
  }, []);

  const roles = user?.roles ?? [];
  const adminRoles = [
    'developer',
    'president',
    'super_admin',
    'account_manager',
    'recruitment_manager',
    'secretary',
    'media_manager',
    'officer',
    'auditor',
  ];
  const isAdmin = roles.some((role) => adminRoles.includes(role));

  const currentLocale = locale === 'en' ? 'en' : 'bn';
  const isBn = currentLocale === 'bn';

  const mainMenu = [
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
      bn: 'গ্যালারি',
      en: 'Gallery',
      href: `/${currentLocale}/gallery`,
    },
    {
      bn: 'নিউজ',
      en: 'News',
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

  const activityMenu = [
    {
      bn: 'আমাদের প্রকল্প',
      en: 'Our Projects',
      href: `/${currentLocale}/projects`,
    },
    {
      bn: 'সামাজিক কার্যক্রম',
      en: 'Social Activities',
      href: `/${currentLocale}/projects`,
    },
    {
      bn: 'মানবিক সহায়তা',
      en: 'Humanitarian Support',
      href: `/${currentLocale}/projects`,
    },
  ];

  return (
    <>
      {/* TOP BAR */}
      <div className="hidden bg-emerald-950 text-emerald-50 md:block">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-2 text-xs sm:px-8 lg:px-10">
          <div className="flex items-center gap-5">
            <span>
              {isBn
                ? 'মানুষের পাশে, ভবিষ্যতের পথে'
                : 'Standing With People, Building the Future'}
            </span>

            <span className="hidden h-3 w-px bg-white/20 sm:block" />

            <a
              href="mailto:contact@brightfuturefoundation.org"
              className="hidden transition hover:text-white sm:block"
            >
              contact@brightfuturefoundation.org
            </a>
          </div>

          <div className="flex items-center gap-4">
            <span>{isBn ? 'সামাজিক কল্যাণমূলক উদ্যোগ' : 'Social Welfare Initiative'}</span>
          </div>
        </div>
      </div>

      {/* MAIN HEADER */}
      <header className="sticky top-0 z-50 border-b border-gray-200 bg-white shadow-sm">
        <div className="mx-auto flex min-h-[76px] max-w-7xl items-center justify-between px-5 sm:px-8 lg:px-10">

          {/* BRAND */}
          <Link
            href={`/${currentLocale}`}
            onClick={() => setOpen(false)}
            className="flex min-w-0 items-center gap-3"
          >
            <div className="flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-2xl bg-white shadow-md">
              {logoUrl ? (
                <img
                  src={logoUrl}
                  alt={isBn ? 'লোগো' : 'Logo'}
                  className="h-full w-full object-contain"
                />
              ) : (
                <span className="flex h-full w-full items-center justify-center bg-emerald-800 text-2xl font-black text-white">
                  B
                </span>
              )}
            </div>

            <div className="min-w-0">
              <div className="truncate text-base font-black leading-tight text-gray-950 sm:text-lg lg:text-xl">
                {isBn
                  ? 'ব্রাইট ফিউচার ফাউন্ডেশন'
                  : 'Bright Future Foundation'}
              </div>

              <div className="mt-0.5 truncate text-[10px] font-semibold uppercase tracking-wide text-emerald-700 sm:text-xs">
                {isBn
                  ? 'মানুষের পাশে • ভবিষ্যতের পথে'
                  : 'People • Community • Future'}
              </div>
            </div>
          </Link>

          {/* DESKTOP NAVIGATION */}
          <nav className="hidden items-center gap-1 xl:flex">

            {mainMenu.slice(0, 2).map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="bff-nav-link rounded-lg px-3 py-2.5 text-sm font-semibold text-gray-700 transition-all duration-200 hover:bg-emerald-50 hover:text-emerald-800 active:scale-95"
              >
                {isBn ? item.bn : item.en}
              </Link>
            ))}

            {/* ACTIVITIES DROPDOWN */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setActivitiesOpen(!activitiesOpen)}
                className="flex items-center gap-1 rounded-lg px-3 py-2.5 text-sm font-semibold text-gray-700 transition hover:bg-emerald-50 hover:text-emerald-800"
              >
                {isBn ? 'কার্যক্রম' : 'Activities'}

                <svg
                  className={`h-4 w-4 transition-transform ${
                    activitiesOpen ? 'rotate-180' : ''
                  }`}
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  aria-hidden="true"
                >
                  <path
                    fillRule="evenodd"
                    d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>

              {activitiesOpen && (
                <div className="bff-dropdown absolute left-0 top-full mt-2 w-64 overflow-hidden rounded-xl border border-gray-200 bg-white p-2 shadow-xl">
                  {activityMenu.map((item) => (
                    <Link
                      key={item.bn}
                      href={item.href}
                      onClick={() => setActivitiesOpen(false)}
                      className="block rounded-lg px-4 py-3 text-sm font-medium text-gray-700 transition hover:bg-emerald-50 hover:text-emerald-800"
                    >
                      {isBn ? item.bn : item.en}
                    </Link>
                  ))}
                </div>
              )}
            </div>

            {mainMenu.slice(2).map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="bff-nav-link rounded-lg px-3 py-2.5 text-sm font-semibold text-gray-700 transition-all duration-200 hover:bg-emerald-50 hover:text-emerald-800 active:scale-95"
              >
                {isBn ? item.bn : item.en}
              </Link>
            ))}

            {/* LANGUAGE */}
            <Link
              href={currentLocale === 'bn' ? '/en' : '/bn'}
              className="bff-button ml-2 rounded-lg border border-gray-300 px-3 py-2 text-xs font-black text-gray-700 hover:border-emerald-600 hover:text-emerald-700"
            >
              {currentLocale === 'bn' ? 'EN' : 'বাংলা'}
            </Link>

            {/* AUTH */}
            {!isLoading && !isAuthenticated && (
              <>
                <Link
                  href={`/${currentLocale}/login`}
                  className="bff-button ml-2 rounded-lg border border-emerald-700 px-4 py-2.5 text-sm font-bold text-emerald-800 hover:bg-emerald-50"
                >
                  {isBn ? 'লগইন' : 'Login'}
                </Link>

                <Link
                  href={`/${currentLocale}/register`}
                  className="bff-button rounded-lg bg-emerald-700 px-4 py-2.5 text-sm font-bold text-white shadow-md hover:bg-emerald-800"
                >
                  {isBn ? 'রেজিস্টার' : 'Register'}
                </Link>
              </>
            )}

            {!isLoading && isAuthenticated && (
              <>
                <Link
                  href={`/${currentLocale}/${isAdmin ? 'admin/dashboard' : 'profile'}`}
                  className="bff-button ml-2 rounded-lg border border-emerald-700 px-4 py-2.5 text-sm font-bold text-emerald-800 hover:bg-emerald-50"
                >
                  {isAdmin
                    ? isBn ? 'ড্যাশবোর্ড' : 'Dashboard'
                    : isBn ? 'প্রোফাইল' : 'Profile'}
                </Link>

                <button
                  type="button"
                  onClick={() => logout()}
                  className="bff-button rounded-lg bg-gray-800 px-4 py-2.5 text-sm font-bold text-white shadow-md hover:bg-gray-900"
                >
                  {isBn ? 'লগআউট' : 'Logout'}
                </button>
              </>
            )}

            {/* DONATE */}
            <Link
              href={`/${currentLocale}/donate`}
              className="bff-button ml-1 rounded-lg bg-emerald-800 px-5 py-2.5 text-sm font-bold text-white shadow-md hover:bg-emerald-900"
            >
              {isBn ? 'সহযোগিতা করুন' : 'Donate'}
            </Link>
          </nav>

          {/* TABLET / MOBILE */}
          <div className="flex items-center gap-2 xl:hidden">

            <Link
              href={currentLocale === 'bn' ? '/en' : '/bn'}
              className="hidden rounded-lg border border-gray-300 px-3 py-2 text-xs font-black text-gray-700 sm:block"
            >
              {currentLocale === 'bn' ? 'EN' : 'বাংলা'}
            </Link>

            <button
              type="button"
              aria-label={open ? 'Close menu' : 'Open menu'}
              aria-expanded={open}
              onClick={() => setOpen(!open)}
              className="bff-button flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-800 text-white shadow-md"
            >
              {open ? (
                <span className="text-3xl leading-none">×</span>
              ) : (
                <span className="text-xl leading-none">☰</span>
              )}
            </button>
          </div>
        </div>
      </header>

      {/* MOBILE MENU */}
      {open && (
        <div className="fixed inset-0 z-[70] xl:hidden">

          {/* Overlay */}
          <button
            type="button"
            aria-label="Close menu"
            onClick={() => setOpen(false)}
            className="bff-mobile-overlay absolute inset-0 bg-black/50"
          />

          {/* Drawer */}
          <aside className="bff-mobile-drawer absolute right-0 top-0 h-full w-[90%] max-w-sm overflow-y-auto bg-white shadow-2xl">

            {/* Drawer header */}
            <div className="flex items-center justify-between border-b border-gray-200 px-5 py-5">
              <Link
                href={`/${currentLocale}`}
                onClick={() => setOpen(false)}
                className="flex items-center gap-3"
              >
                <div className="flex h-11 w-11 items-center justify-center overflow-hidden rounded-xl bg-white shadow-sm">
                  {logoUrl ? (
                    <img
                      src={logoUrl}
                      alt={isBn ? 'লোগো' : 'Logo'}
                      className="h-full w-full object-contain"
                    />
                  ) : (
                    <span className="bg-emerald-800 text-xl font-black text-white">
                      B
                    </span>
                  )}
                </div>

                <div>
                  <div className="text-sm font-black text-gray-950">
                    {isBn
                      ? 'ব্রাইট ফিউচার ফাউন্ডেশন'
                      : 'Bright Future Foundation'}
                  </div>

                  <div className="text-[10px] font-semibold text-emerald-700">
                    {isBn ? 'মানুষের পাশে' : 'Building the Future'}
                  </div>
                </div>
              </Link>

              <button
                type="button"
                onClick={() => setOpen(false)}
                aria-label="Close menu"
                className="flex h-10 w-10 items-center justify-center rounded-lg text-3xl text-gray-500 hover:bg-gray-100 hover:text-gray-900"
              >
                ×
              </button>
            </div>

            {/* Drawer navigation */}
            <nav className="px-5 py-5">

              {mainMenu.slice(0, 2).map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className="block border-b border-gray-100 px-2 py-4 text-base font-semibold text-gray-800 transition hover:text-emerald-700"
                >
                  {isBn ? item.bn : item.en}
                </Link>
              ))}

              {/* Mobile Activities */}
              <div className="border-b border-gray-100">
                <button
                  type="button"
                  onClick={() => setActivitiesOpen(!activitiesOpen)}
                  className="flex w-full items-center justify-between px-2 py-4 text-left text-base font-semibold text-gray-800"
                >
                  {isBn ? 'কার্যক্রম' : 'Activities'}

                  <svg
                    className={`h-4 w-4 transition-transform ${
                      activitiesOpen ? 'rotate-180' : ''
                    }`}
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 1.04l-4.25-4.5a.75.75 0 01.02-1.06z"
                      clipRule="evenodd"
                    />
                  </svg>
                </button>

                {activitiesOpen && (
                  <div className="bff-mobile-submenu mb-2 ml-2 border-l-2 border-emerald-100 pl-3">
                    {activityMenu.map((item) => (
                      <Link
                        key={item.bn}
                        href={item.href}
                        onClick={() => setOpen(false)}
                        className="block px-3 py-3 text-sm font-medium text-gray-600 hover:text-emerald-700"
                      >
                        {isBn ? item.bn : item.en}
                      </Link>
                    ))}
                  </div>
                )}
              </div>

              {mainMenu.slice(2).map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className="block border-b border-gray-100 px-2 py-4 text-base font-semibold text-gray-800 transition hover:text-emerald-700"
                >
                  {isBn ? item.bn : item.en}
                </Link>
              ))}

              {/* Authentication */}
              {!isLoading && !isAuthenticated && (
                <div className="mt-6 grid grid-cols-2 gap-3">
                  <Link
                    href={`/${currentLocale}/login`}
                    onClick={() => setOpen(false)}
                    className="flex items-center justify-center rounded-xl border border-emerald-700 px-4 py-3 text-sm font-bold text-emerald-800 transition hover:bg-emerald-50 active:scale-95"
                  >
                    {isBn ? 'লগইন' : 'Login'}
                  </Link>

                  <Link
                    href={`/${currentLocale}/register`}
                    onClick={() => setOpen(false)}
                    className="flex items-center justify-center rounded-xl bg-emerald-700 px-4 py-3 text-sm font-bold text-white shadow-md transition hover:bg-emerald-800 active:scale-95"
                  >
                    {isBn ? 'রেজিস্টার' : 'Register'}
                  </Link>
                </div>
              )}

              {!isLoading && isAuthenticated && (
                <div className="mt-6 grid grid-cols-2 gap-3">
                  <Link
                    href={`/${currentLocale}/${isAdmin ? 'admin/dashboard' : 'profile'}`}
                    onClick={() => setOpen(false)}
                    className="flex items-center justify-center rounded-xl border border-emerald-700 px-4 py-3 text-sm font-bold text-emerald-800 transition hover:bg-emerald-50 active:scale-95"
                  >
                    {isAdmin
                      ? isBn ? 'ড্যাশবোর্ড' : 'Dashboard'
                      : isBn ? 'প্রোফাইল' : 'Profile'}
                  </Link>

                  <button
                    type="button"
                    onClick={async () => {
                      setOpen(false);
                      await logout();
                    }}
                    className="flex items-center justify-center rounded-xl bg-gray-800 px-4 py-3 text-sm font-bold text-white transition hover:bg-gray-900 active:scale-95"
                  >
                    {isBn ? 'লগআউট' : 'Logout'}
                  </button>
                </div>
              )}

              {/* Donate */}
              <Link
                href={`/${currentLocale}/donate`}
                onClick={() => setOpen(false)}
                className="mt-7 flex items-center justify-center rounded-xl bg-emerald-800 px-6 py-4 text-base font-bold text-white shadow-lg"
              >
                {isBn ? 'সহযোগিতা করুন' : 'Donate Now'}
              </Link>

              {/* Language */}
              <div className="mt-4 grid grid-cols-2 overflow-hidden rounded-xl border border-gray-200">
                <Link
                  href="/bn"
                  onClick={() => setOpen(false)}
                  className={`py-3 text-center text-sm font-bold ${
                    currentLocale === 'bn'
                      ? 'bg-emerald-100 text-emerald-800'
                      : 'text-gray-700'
                  }`}
                >
                  বাংলা
                </Link>

                <Link
                  href="/en"
                  onClick={() => setOpen(false)}
                  className={`border-l border-gray-200 py-3 text-center text-sm font-bold ${
                    currentLocale === 'en'
                      ? 'bg-emerald-100 text-emerald-800'
                      : 'text-gray-700'
                  }`}
                >
                  English
                </Link>
              </div>
            </nav>
          </aside>
        </div>
      )}
    </>
  );
}
