import type { MetadataRoute } from 'next';
import { siteConfig } from '@/configs/site';

const staticRoutes = [
  '/',
  '/home',
  '/movies',
  '/tv-shows',
  '/new-and-popular',
  '/search',
];

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  return staticRoutes.map((route) => ({
    url: new URL(route, siteConfig.url).toString(),
    lastModified: now,
    changeFrequency: route === '/' || route === '/home' ? 'daily' : 'weekly',
    priority: route === '/' || route === '/home' ? 1 : 0.8,
  }));
}
