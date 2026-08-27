import React from 'react';
import { checkApiHealth } from '@/lib/api';

export default async function HomePage({ params: { locale } }: { params: { locale: string } }) {
  let apiStatus = 'Checking...';
  try {
    const health = await checkApiHealth();
    apiStatus = health.message;
  } catch (err) {
    apiStatus = 'API Unreachable';
  }

  const isBn = locale === 'bn';

  return (
    <div className="max-w-4xl mx-auto py-12 px-6">
      <h2 className="text-3xl font-bold mb-4">
        {isBn ? 'ব্রাইড ফিউচার ফাউন্ডেশন (বিএফএফ)' : 'Bride Future Foundation (BFF)'}
      </h2>
      <p className="text-gray-700 mb-6">
        {isBn 
          ? 'আমাদের প্ল্যাটফর্মে স্বাগতম। এটি অফিশিয়াল পোর্টাল।' 
          : 'Welcome to our platform. This is the official portal.'}
      </p>
      <div className="p-4 bg-white rounded-lg shadow border border-gray-200">
        <h3 className="font-semibold text-lg mb-2">{isBn ? 'ব্যাকএন্ড সংযোগ স্থিতি:' : 'Backend Health Status:'}</h3>
        <p className="text-sm font-mono bg-gray-100 p-2 rounded">{apiStatus}</p>
      </div>
    </div>
  );
}
