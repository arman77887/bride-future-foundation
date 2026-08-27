import React from 'react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-900 text-gray-400 py-6 mt-auto">
      <div className="max-w-7xl mx-auto px-4 text-center text-sm">
        &copy; {new Date().getFullYear()} Bride Future Foundation (BFF). All rights reserved.
      </div>
    </footer>
  );
};
