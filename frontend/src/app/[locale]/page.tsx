import React from 'react';

export default async function HomePage({ params }: { params: { locale: string } }) {
  const { locale } = await params;
  const isBn = locale === 'bn';

  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-8">
      <div className="max-w-3xl text-center">
        <h1 className="text-4xl font-bold tracking-tight text-emerald-700 sm:text-6xl mb-6">
          {isBn ? 'ব্রাইড ফিউচার ফাউন্ডেশন' : 'Bride Future Foundation'}
        </h1>
        <p className="text-lg text-gray-700 mb-8">
          {isBn
            ? 'সমাজ কল্যাণ, স্বচ্ছ অনুদান ব্যবস্থাপনা এবং দক্ষ জনবল তৈরিতে আমরা প্রতিজ্ঞাবদ্ধ।'
            : 'Committed to social welfare, transparent donation management, and empowered leadership.'}
        </p>
        <div className="flex justify-center gap-4">
          <a
            href={`/${locale}/donate`}
            className="rounded-md bg-emerald-600 px-6 py-3 text-sm font-semibold text-white shadow hover:bg-emerald-500 transition"
          >
            {isBn ? 'অনুদান দিন' : 'Donate Now'}
          </a>
          <a
            href={`/${locale}/apply`}
            className="rounded-md bg-white px-6 py-3 text-sm font-semibold text-emerald-700 shadow border border-emerald-300 hover:bg-emerald-50 transition"
          >
            {isBn ? 'আবেদন করুন' : 'Apply Now'}
          </a>
        </div>
      </div>
    </main>
  );
}
