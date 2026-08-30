'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Navbar({ locale = 'bn' }: { locale?: string }) {
  const pathname = usePathname();
  const isBn = locale === 'bn';

  const navItems = [
    {
      href: `/${locale}`,
      bn: 'হোম',
      en: 'Home',
    },
    {
      href: `/${locale}/officers`,
      bn: 'কর্মকর্তা',
      en: 'Officers',
    },
    {
      href: `/${locale}/vacancies`,
      bn: 'ক্যারিয়ার',
      en: 'Careers',
    },
    {
      href: `/${locale}/donate`,
      bn: 'অনুদান',
      en: 'Donate',
    },
    {
      href: `/${locale}/apply`,
      bn: 'আবেদন',
      en: 'Apply',
    },
  ];

  return (
    <header className="sticky top-0 z-50 border-b border-gray-200 bg-white/95 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">

        {/* Logo */}
        <Link
          href={`/${locale}`}
          className="flex items-center gap-3"
        >
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-700 text-lg font-bold text-white">
            B
          </div>

          <div className="hidden sm:block">
            <div className="text-sm font-bold leading-tight text-emerald-800">
              {isBn ? 'ব্রাইড ফিউচার ফাউন্ডেশন' : 'Bride Future Foundation'}
            </div>

            <div className="text-[10px] font-medium uppercase tracking-wider text-gray-500">
              {isBn ? 'মানবসেবা ও উন্নয়ন' : 'Humanity & Development'}
            </div>
          </div>
        </Link>

        {/* Navigation */}
        <nav className="hidden items-center gap-1 lg:flex">
          {navItems.map((item) => {
            const active =
              item.href === `/${locale}`
                ? pathname === item.href
                : pathname?.startsWith(item.href);

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`rounded-lg px-3 py-2 text-sm font-medium transition ${
                  active
                    ? 'bg-emerald-50 text-emerald-700'
                    : 'text-gray-700 hover:bg-gray-50 hover:text-emerald-700'
                }`}
              >
                {isBn ? item.bn : item.en}
              </Link>
            );
          })}
        </nav>

        {/* Right actions */}
        <div className="flex items-center gap-2">

          <Link
            href={locale === 'bn' ? '/en' : '/bn'}
            className="rounded-lg border border-gray-300 px-3 py-2 text-xs font-semibold text-gray-700 transition hover:bg-gray-50"
          >
            {locale === 'bn' ? 'EN' : 'বাংলা'}
          </Link>

          <Link
            href={`/${locale}/login`}
            className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-emerald-700"
          >
            {isBn ? 'সাইন ইন' : 'Sign In'}
          </Link>

        </div>
      </div>

      {/* Mobile navigation */}
      <div className="border-t border-gray-100 lg:hidden">
        <div className="mx-auto flex max-w-7xl gap-1 overflow-x-auto px-4 py-2">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="whitespace-nowrap rounded-md px-3 py-1.5 text-xs font-medium text-gray-600 hover:bg-emerald-50 hover:text-emerald-700"
            >
              {isBn ? item.bn : item.en}
            </Link>
          ))}
        </div>
      </div>
    </header>
  );
}
