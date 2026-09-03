import type { MetadataRoute } from 'next';

const siteUrl = 'https://brightfuturefoundation.duckdns.org';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/en/admin/', '/bn/admin/', '/api/'],
    },
    sitemap: `${siteUrl}/sitemap.xml`,
  };
}
