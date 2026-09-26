'use client';

import { useEffect, useState } from 'react';
import api from '@/services/api';

interface Setting {
  key: string;
  value: string;
}

const icons = {
  Facebook: (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="h-6 w-6 fill-current">
      <path d="M13.5 21v-7h2.5l.5-3h-3v-1.7c0-.9.3-1.5 1.5-1.5H17V5.1c-.4-.1-1.3-.1-2.2-.1-2.2 0-3.8 1.3-3.8 3.9V11H8.5v3H11v7h2.5Z" />
    </svg>
  ),
  X: (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="h-6 w-6 fill-current">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24h-6.657l-5.214-6.817-5.964 6.817H1.684l7.73-8.835L1.254 2.25H8.08l4.713 6.231 5.45-6.231Zm-1.161 17.52h1.833L7.084 4.126H5.117L17.083 19.77Z" />
    </svg>
  ),
  TikTok: (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="h-6 w-6 fill-current">
      <path d="M16.6 5.82A4.7 4.7 0 0 0 20 8.1V5.06a7.7 7.7 0 0 1-1.92-.47 4.76 4.76 0 0 1-1.48-1.05A4.76 4.76 0 0 1 15.55 2h-3.05v13.62a2.77 2.77 0 1 1-2.77-2.77c.32 0 .63.05.92.15V9.89a6.2 6.2 0 1 0 4.9 6.06V8.7a7.75 7.75 0 0 0 4.53 1.45V7.1a4.67 4.67 0 0 1-3.48-1.28Z" />
    </svg>
  ),
  YouTube: (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="h-6 w-6 fill-current">
      <path d="M23.5 6.2a3 3 0 0 0-2.1-2.1C19.55 3.5 12 3.5 12 3.5s-7.55 0-9.4.6A3 3 0 0 0 .5 6.2 31.2 31.2 0 0 0 0 12a31.2 31.2 0 0 0 .5 5.8 3 3 0 0 0 2.1 2.1c1.85.6 9.4.6 9.4.6s7.55 0 9.4-.6a3 3 0 0 0 2.1-2.1A31.2 31.2 0 0 0 24 12a31.2 31.2 0 0 0-.5-5.8ZM9.6 15.9V8.1l6.6 3.9-6.6 3.9Z" />
    </svg>
  ),
};

const defaultFacebook =
  'https://www.facebook.com/profile.php?id=61551777602468';

const brandStyles = {
  Facebook: {
    color: 'text-[#1877F2]',
    hover: 'hover:bg-[#1877F2] hover:text-white',
  },
  X: {
    color: 'text-white',
    hover: 'hover:bg-white hover:text-black',
  },
  TikTok: {
    color: 'text-[#00f2ea]',
    hover: 'hover:bg-[#00f2ea] hover:text-black',
  },
  YouTube: {
    color: 'text-[#FF0000]',
    hover: 'hover:bg-[#FF0000] hover:text-white',
  },
};

export default function SocialMedia() {
  const [links, setLinks] = useState({
    Facebook: defaultFacebook,
    X: '',
    TikTok: '',
    YouTube: '',
  });

  useEffect(() => {
    let mounted = true;

    const loadSocialSettings = async () => {
      try {
        const response = await api.get('/settings?group=social');
        const data = response?.data?.data;

        const settings: Setting[] = Array.isArray(data)
          ? data
          : Array.isArray(data?.data)
            ? data.data
            : [];

        const values = {
          Facebook:
            settings.find((item) => item.key === 'social.facebook')?.value ||
            defaultFacebook,
          X: settings.find((item) => item.key === 'social.x')?.value || '',
          TikTok:
            settings.find((item) => item.key === 'social.tiktok')?.value || '',
          YouTube:
            settings.find((item) => item.key === 'social.youtube')?.value || '',
        };

        if (mounted) {
          setLinks(values);
        }
      } catch {
        // Keep the Facebook default if the public settings request fails.
      }
    };

    loadSocialSettings();

    return () => {
      mounted = false;
    };
  }, []);

  const socialLinks = [
    {
      name: 'Facebook' as const,
      href: links.Facebook,
      label: 'Facebook',
      icon: icons.Facebook,
    },
    {
      name: 'X' as const,
      href: links.X,
      label: 'X (Twitter)',
      icon: icons.X,
    },
    {
      name: 'TikTok' as const,
      href: links.TikTok,
      label: 'TikTok',
      icon: icons.TikTok,
    },
    {
      name: 'YouTube' as const,
      href: links.YouTube,
      label: 'YouTube',
      icon: icons.YouTube,
    },
  ].filter((social) => social.href.trim() !== '');

  return (
    <div className="mt-10">
      <h3 className="text-lg font-black text-white">
        Social Media
      </h3>

      <div className="mt-5 flex flex-wrap gap-3">
        {socialLinks.map((social) => {
          const style = brandStyles[social.name];

          return (
            <a
              key={social.name}
              href={social.href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={social.label}
              title={social.label}
              className={`inline-flex h-11 w-11 items-center justify-center rounded-full border border-white/10 bg-white/5 ${style.color} ${style.hover} transition-all duration-200 hover:-translate-y-1 hover:shadow-lg`}
            >
              {social.icon}
            </a>
          );
        })}
      </div>
    </div>
  );
}
