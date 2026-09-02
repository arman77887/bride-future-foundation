import React from 'react';
import '@/styles/globals.css';

export const metadata = {
  title: 'Bright Further Foundation',
  description: 'Empowering futures and securing community growth.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html>
      <body className="bg-gray-50 text-gray-900 antialiased">
        {children}
      </body>
    </html>
  );
}
