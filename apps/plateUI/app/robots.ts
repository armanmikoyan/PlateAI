import type { MetadataRoute } from 'next';

import { readSiteUrl } from '@/app/utils/site/url';

export default function robots(): MetadataRoute.Robots {
  const siteUrl = readSiteUrl();

  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/api/'],
      },
      {
        userAgent: 'Googlebot',
        allow: '/',
        disallow: ['/api/'],
      },
    ],
    sitemap: new URL('/sitemap.xml', siteUrl).href,
  };
}
