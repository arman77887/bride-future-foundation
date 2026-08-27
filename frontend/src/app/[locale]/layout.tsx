import React from 'react';
import '../globals.css';

export default function LocaleLayout({
  children,
  params: { locale },
}: {
  children: React.ReactNode;
  params: { locale: string };
}) {
  return (
    <html lang={locale}>
      <body className="bg-gray-50 text-gray-900 antialiased">
        <header className="bg-white border-b border-gray-200 py-4 px-6 flex justify-between items-center">
          <h1 className="font-bold text-xl text-primary-700">Bride Future Foundation</h1>
          <nav className="space-x-4">
            <a href="/bn" className="hover:underline">বাংলা</a>
            <a href="/en" className="hover:underline">English</a>
          </nav>
        </header>
        <main className="min-h-screen">
          {children}
        </main>
      </body>
    </html>
  );
}
