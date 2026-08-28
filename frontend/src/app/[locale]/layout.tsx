import React from 'react';
import '@/styles/globals.css';

export const metadata = {
  title: 'Bride Future Foundation',
  description: 'Empowering futures and securing community growth.',
};

interface RootLayoutProps {
  children: React.ReactNode;
  params: {
    locale: string;
  };
}

export default async function RootLayout({
  children,
  params,
}: RootLayoutProps) {
  const { locale } = await params;
  return (
    <html lang={locale || 'bn'}>
      <body className="bg-gray-50 text-gray-900 antialiased">
        <div id="app-root">{children}</div>
      </body>
    </html>
  );
}
