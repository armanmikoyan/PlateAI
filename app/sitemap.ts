import type { MetadataRoute } from 'next';

import { readSiteUrl } from '@/lib/site/url';

const PUBLIC_ROUTES = ['/', '/pricing'] as const;

export default function sitemap(): MetadataRoute.Sitemap {
  const siteUrl = readSiteUrl();

  return PUBLIC_ROUTES.map((path) => ({
    url: new URL(path, siteUrl).href,
    changeFrequency: path === '/' ? 'weekly' : 'monthly',
    priority: path === '/' ? 1 : 0.8,
  }));
}
