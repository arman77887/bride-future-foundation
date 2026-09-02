'use client';

import { useEffect, useState } from 'react';
import { api } from '@/services/api';

interface SiteLogoProps {
  locale?: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export default function SiteLogo({
  locale = 'bn',
  size = 'md',
  className = '',
}: SiteLogoProps) {
  const [logoUrl, setLogoUrl] = useState<string | null>(null);

  const isBn = locale === 'bn';

  useEffect(() => {
    let mounted = true;

    const loadLogo = async () => {
      try {
        const response = await api.get('/settings');

        const settings = Array.isArray(response?.data?.data)
          ? response.data.data
          : [];

        const logo = settings.find(
          (item: { key?: string }) => item.key === 'site.logo_media_id'
        );

        if (!mounted || !logo?.media_url) return;

        const apiBase =
          process.env.NEXT_PUBLIC_API_BASE_URL ||
          'http://127.0.0.1:8000/api/v1';

        const backendBase = apiBase.replace(/\/api\/v1\/?$/, '');

        setLogoUrl(
          logo.media_url.startsWith('http')
            ? logo.media_url
            : `${backendBase}${logo.media_url}`
        );
      } catch {
        if (mounted) {
          setLogoUrl(null);
        }
      }
    };

    loadLogo();

    return () => {
      mounted = false;
    };
  }, []);

  const sizes = {
    sm: 'h-9 w-9 rounded-lg text-lg',
    md: 'h-12 w-12 rounded-xl text-2xl',
    lg: 'h-16 w-16 rounded-2xl text-3xl',
  };

  return (
    <div
      className={`flex shrink-0 items-center justify-center overflow-hidden bg-white shadow-md ${sizes[size]} ${className}`}
    >
      {logoUrl ? (
        <img
          src={logoUrl}
          alt={isBn ? 'লোগো' : 'Logo'}
          className="h-full w-full object-contain"
        />
      ) : (
        <span className="flex h-full w-full items-center justify-center bg-emerald-800 font-black text-white">
          B
        </span>
      )}
    </div>
  );
}
