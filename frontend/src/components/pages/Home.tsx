import React from 'react';
import Link from 'next/link';

export const Home: React.FC = () => {
  return (
    <div className="text-center py-16">
      <h1 className="text-4xl font-extrabold text-brand-green mb-4">
        Welcome to Bright Future Foundation
      </h1>

      <p className="text-lg text-gray-600 max-w-2xl mx-auto mb-8">
        Empowering communities, driving sustainable development, and maintaining
        transparent institutional governance.
      </p>

      <div className="flex justify-center space-x-4">
        <Link
          href="/en/officers"
          className="bg-brand-green text-white px-6 py-3 rounded-lg font-semibold shadow hover:opacity-90"
        >
          Verify Officers
        </Link>

        <Link
          href="/en/donate"
          className="bg-brand-gold text-gray-900 px-6 py-3 rounded-lg font-semibold shadow hover:opacity-90"
        >
          Support Our Cause
        </Link>
      </div>
    </div>
  );
};
