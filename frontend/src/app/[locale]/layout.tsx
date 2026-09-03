import React from 'react';
import type { Metadata } from 'next';
import Navbar from '@/components/common/Navbar';
import Footer from '@/components/common/Footer';

interface LocaleLayoutProps {
  children: React.ReactNode;
  params: {
    locale: string;
  };
}

const siteUrl = 'https://brightfuturefoundation.duckdns.org';

export async function generateMetadata({
  params,
}: LocaleLayoutProps): Promise<Metadata> {
  const locale = params.locale === 'bn' ? 'bn' : 'en';
  const isBn = locale === 'bn';

  const title = isBn
    ? 'ব্রাইট ফিউচার ফাউন্ডেশন'
    : 'Bright Future Foundation';

  const description = isBn
    ? 'ব্রাইট ফিউচার ফাউন্ডেশন — মানুষের জন্য কাজ করে, একটি সুন্দর ও উন্নত ভবিষ্যৎ গড়ার লক্ষ্যে সামাজিক ও জনকল্যাণমূলক উদ্যোগ পরিচালনা করে।'
    : 'Bright Future Foundation — working for people and building a better future through community development and social initiatives.';

  return {
    title,
    description,
    alternates: {
      canonical: `${siteUrl}/${locale}`,
      languages: {
        en: `${siteUrl}/en`,
        bn: `${siteUrl}/bn`,
      },
    },
    openGraph: {
      type: 'website',
      url: `${siteUrl}/${locale}`,
      title,
      description,
      siteName: 'Bright Future Foundation',
      locale: isBn ? 'bn_BD' : 'en_US',
      alternateLocale: [isBn ? 'en_US' : 'bn_BD'],
    },
  };
}

export default function LocaleLayout({
  children,
  params,
}: LocaleLayoutProps) {
  const locale = params.locale === 'bn' ? 'bn' : 'en';

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 text-gray-900">
      <Navbar locale={locale} />
      <main className="bff-public-main flex-1 w-full">{children}</main>
      <Footer locale={locale} />
    </div>
  );
}
