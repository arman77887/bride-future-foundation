import React from 'react';
import Navbar from '@/components/common/Navbar';
import { Footer } from '@/components/common/Footer';

interface LocaleLayoutProps {
  children: React.ReactNode;
  params: {
    locale: string;
  };
}

export default function LocaleLayout({
  children,
  params,
}: LocaleLayoutProps) {
  const locale = params.locale === 'en' ? 'en' : 'bn';

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 text-gray-900">
      <Navbar locale={locale} />

      <main className="flex-1 w-full">
        {children}
      </main>

      <Footer />
    </div>
  );
}
