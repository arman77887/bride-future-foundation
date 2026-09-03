import type { MetadataRoute } from 'next';

const siteUrl = 'https://brightfuturefoundation.duckdns.org';

const pages = [
  '',
  '/about',
  '/officers',
  '/vacancies',
  '/gallery',
  '/news',
  '/notices',
  '/contact',
  '/donate',
  '/apply',
];

export default function sitemap(): MetadataRoute.Sitemap {
  return pages.flatMap((page) => [
    {
      url: `${siteUrl}/en${page}`,
      lastModified: new Date(),
      changeFrequency: page === '' ? 'daily' : 'weekly',
      priority: page === '' ? 1 : 0.7,
    },
    {
      url: `${siteUrl}/bn${page}`,
      lastModified: new Date(),
      changeFrequency: page === '' ? 'daily' : 'weekly',
      priority: page === '' ? 1 : 0.7,
    },
  ]);
}
