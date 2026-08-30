import React from 'react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-950 text-gray-300">

      <div className="mx-auto max-w-7xl px-6 py-12 sm:px-8 lg:px-10">

        <div className="grid gap-10 md:grid-cols-3">

          {/* Foundation */}
          <div>
            <h3 className="text-xl font-black text-white">
              Bride Future Foundation
            </h3>

            <p className="mt-4 max-w-sm text-sm leading-7 text-gray-400">
              Empowering communities, supporting people and building a better
              future through responsible social initiatives.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-bold text-white">
              Quick Links
            </h3>

            <div className="mt-4 space-y-3 text-sm">
              <a
                href="/bn"
                className="block transition hover:text-emerald-400"
              >
                Home
              </a>

              <a
                href="/bn/officers"
                className="block transition hover:text-emerald-400"
              >
                Officers
              </a>

              <a
                href="/bn/vacancies"
                className="block transition hover:text-emerald-400"
              >
                Careers
              </a>

              <a
                href="/bn/donate"
                className="block transition hover:text-emerald-400"
              >
                Donate
              </a>
            </div>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-bold text-white">
              Contact
            </h3>

            <div className="mt-4 space-y-3 text-sm text-gray-400">
              <p>📧 contact@bridefuturefoundation.org</p>
              <p>📞 +880 1XXXXXXXXX</p>
              <p>📍 Bangladesh</p>
            </div>
          </div>

        </div>

        {/* Bottom */}
        <div className="mt-12 border-t border-gray-800 pt-7">

          <div className="flex flex-col items-center justify-between gap-4 text-center text-sm sm:flex-row sm:text-left">

            <p className="text-gray-500">
              © {new Date().getFullYear()} Bride Future Foundation. All rights reserved.
            </p>

            <p className="text-gray-500">
              Designed &amp; Developed by{' '}
              <span className="font-bold text-emerald-400">
                CrypticX
              </span>
            </p>

          </div>

        </div>

      </div>

    </footer>
  );
};
