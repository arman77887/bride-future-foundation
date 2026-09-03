import React from 'react';
import type { Metadata } from 'next';
import '@/styles/globals.css';

const siteUrl = 'https://brightfuturefoundation.duckdns.org';

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: 'Bright Future Foundation',
    template: '%s | Bright Future Foundation',
  },
  description:
    'Bright Future Foundation — working for people, building a better future through community development and social initiatives.',
  applicationName: 'Bright Future Foundation',
  keywords: [
    'Bright Future Foundation',
    'BFF',
    'Bangladesh NGO',
    'Bangladesh Foundation',
    'social development',
    'community development',
    'charity Bangladesh',
  ],
  authors: [{ name: 'Bright Future Foundation' }],
  creator: 'Bright Future Foundation',
  publisher: 'Bright Future Foundation',
  alternates: {
    languages: {
      en: '/en',
      bn: '/bn',
    },
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
    },
  },
  openGraph: {
    type: 'website',
    siteName: 'Bright Future Foundation',
    title: 'Bright Future Foundation',
    description:
      'Working for people, building a better future through community development and social initiatives.',
    url: siteUrl,
    locale: 'en_US',
    alternateLocale: ['bn_BD'],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html>
      <body className="bg-gray-50 text-gray-900 antialiased">{children}</body>
    </html>
  );
}
