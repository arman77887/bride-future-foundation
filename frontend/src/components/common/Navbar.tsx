import React from 'react';

export default function Navbar({ locale = 'bn' }: { locale: string }) {
  const isBn = locale === 'bn';

  return (
    <nav className="bg-white shadow border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <a href={`/${locale}`} className="text-xl font-bold text-emerald-700">
              {isBn ? 'ব্রাইড ফিউচার ফাউন্ডেশন' : 'Bride Future Foundation'}
            </a>
          </div>
          <div className="flex items-center space-x-4">
            <a href={`/${locale}/donate`} className="text-gray-700 hover:text-emerald-600 text-sm font-medium">
              {isBn ? 'অনুদান' : 'Donate'}
            </a>
            <a href={`/${locale}/apply`} className="text-gray-700 hover:text-emerald-600 text-sm font-medium">
              {isBn ? 'আবেদন' : 'Apply'}
            </a>
            <a
              href={locale === 'bn' ? '/en' : '/bn'}
              className="px-3 py-1 border border-gray-300 rounded text-sm text-gray-700 hover:bg-gray-50"
            >
              {locale === 'bn' ? 'English' : 'বাংলা'}
            </a>
          </div>
        </div>
      </div>
    </nav>
  );
}
