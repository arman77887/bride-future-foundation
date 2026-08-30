'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useParams, usePathname, useRouter } from 'next/navigation';
import { useAuthStore } from '../../../store/useAuthStore';

interface MenuItem {
  labelBn: string;
  labelEn: string;
  href: string;
}

const menuItems: MenuItem[] = [
  {
    labelBn: 'ড্যাশবোর্ড',
    labelEn: 'Dashboard',
    href: 'dashboard',
  },
  {
    labelBn: 'অনুদান',
    labelEn: 'Donations',
    href: 'donations',
  },
  {
    labelBn: 'অনুদানের মাধ্যম',
    labelEn: 'Donation Methods',
    href: 'donation-methods',
  },
  {
    labelBn: 'আবেদন',
    labelEn: 'Applications',
    href: 'applications',
  },
  {
    labelBn: 'অফিসার',
    labelEn: 'Officers',
    href: 'officers',
  },
  {
    labelBn: 'চাকরির বিজ্ঞপ্তি',
    labelEn: 'Vacancies',
    href: 'vacancies',
  },
  {
    labelBn: 'সংবাদ',
    labelEn: 'News',
    href: 'news',
  },
  {
    labelBn: 'নোটিশ',
    labelEn: 'Notices',
    href: 'notices',
  },
  {
    labelBn: 'ইভেন্ট',
    labelEn: 'Events',
    href: 'events',
  },
  {
    labelBn: 'প্রজেক্ট',
    labelEn: 'Projects',
    href: 'projects',
  },
  {
    labelBn: 'CMS',
    labelEn: 'CMS Pages',
    href: 'cms',
  },
  {
    labelBn: 'গ্যালারি',
    labelEn: 'Gallery',
    href: 'gallery',
  },
  {
    labelBn: 'ডকুমেন্ট',
    labelEn: 'Documents',
    href: 'documents',
  },
  {
    labelBn: 'মিডিয়া',
    labelEn: 'Media',
    href: 'media',
  },
  {
    labelBn: 'ইউজার ও রোল',
    labelEn: 'Users & Roles',
    href: 'users',
  },
  {
    labelBn: 'অডিট লগ',
    labelEn: 'Audit Logs',
    href: 'audit-logs',
  },
  {
    labelBn: 'সেটিংস',
    labelEn: 'Settings',
    href: 'settings',
  },
];

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const params = useParams();
  const pathname = usePathname();
  const router = useRouter();

  const locale = params?.locale === 'en' ? 'en' : 'bn';
  const isBn = locale === 'bn';

  const { user, isAuthenticated, isLoading, restore, logout } =
    useAuthStore();

  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    restore();
  }, [restore]);

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.replace(`/${locale}/login`);
    }
  }, [isLoading, isAuthenticated, locale, router]);

  const handleLogout = async () => {
    await logout();
    router.replace(`/${locale}/login`);
  };

  if (isLoading || !isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="rounded-xl bg-white px-8 py-6 shadow">
          <p className="text-gray-600">
            {isBn ? 'লোড হচ্ছে...' : 'Loading...'}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="flex min-h-screen">

        {/* Sidebar */}
        <aside
          className={`
            fixed inset-y-0 left-0 z-50 w-72 bg-gray-900 text-white
            transform transition-transform duration-200
            lg:static lg:translate-x-0
            ${mobileOpen ? 'translate-x-0' : '-translate-x-full'}
          `}
        >
          <div className="flex h-full flex-col">

            {/* Logo */}
            <div className="border-b border-gray-800 px-6 py-5">
              <div className="text-xl font-bold text-emerald-400">
                Bride Future Foundation
              </div>

              <div className="mt-1 text-xs text-gray-400">
                {isBn ? 'অ্যাডমিন প্যানেল' : 'Admin Panel'}
              </div>
            </div>

            {/* Navigation */}
            <nav className="flex-1 overflow-y-auto px-3 py-4">
              <div className="space-y-1">
                {menuItems.map((item) => {
                  const href = `/${locale}/admin/${item.href}`;
                  const active =
                    pathname === href ||
                    pathname.startsWith(`${href}/`);

                  return (
                    <Link
                      key={item.href}
                      href={href}
                      onClick={() => setMobileOpen(false)}
                      className={`
                        block rounded-lg px-4 py-3 text-sm font-medium
                        transition
                        ${
                          active
                            ? 'bg-emerald-600 text-white'
                            : 'text-gray-300 hover:bg-gray-800 hover:text-white'
                        }
                      `}
                    >
                      {isBn ? item.labelBn : item.labelEn}
                    </Link>
                  );
                })}
              </div>
            </nav>

            {/* User */}
            <div className="border-t border-gray-800 p-4">
              <div className="mb-3">
                <p className="truncate text-sm font-semibold">
                  {user?.name || 'Admin'}
                </p>

                <p className="truncate text-xs text-gray-400">
                  {user?.email || ''}
                </p>
              </div>

              <button
                onClick={handleLogout}
                className="w-full rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-700"
              >
                {isBn ? 'লগআউট' : 'Logout'}
              </button>
            </div>
          </div>
        </aside>

        {/* Mobile overlay */}
        {mobileOpen && (
          <button
            aria-label="Close menu"
            className="fixed inset-0 z-40 bg-black/50 lg:hidden"
            onClick={() => setMobileOpen(false)}
          />
        )}

        {/* Main */}
        <div className="flex min-w-0 flex-1 flex-col">

          {/* Header */}
          <header className="sticky top-0 z-30 border-b border-gray-200 bg-white">
            <div className="flex h-16 items-center justify-between px-4 sm:px-6">

              <button
                type="button"
                onClick={() => setMobileOpen(true)}
                className="rounded-lg border border-gray-300 px-3 py-2 text-gray-700 lg:hidden"
              >
                ☰
              </button>

              <div className="hidden lg:block">
                <h1 className="text-lg font-semibold text-gray-900">
                  {isBn ? 'অ্যাডমিন প্যানেল' : 'Administration'}
                </h1>
              </div>

              <div className="flex items-center gap-4">
                <Link
                  href={`/${locale}`}
                  className="text-sm font-medium text-gray-600 hover:text-emerald-600"
                >
                  {isBn ? 'ওয়েবসাইট দেখুন' : 'View Website'}
                </Link>

                <span className="hidden text-sm text-gray-500 sm:block">
                  {user?.name || 'Admin'}
                </span>
              </div>
            </div>
          </header>

          {/* Content */}
          <main className="flex-1 p-4 sm:p-6 lg:p-8">
            <div className="mx-auto max-w-7xl">
              {children}
            </div>
          </main>

        </div>
      </div>
    </div>
  );
}
