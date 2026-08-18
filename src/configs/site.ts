import { Icons } from '@/components/icons';
import { env } from '@/env.mjs';

export type SiteConfig = typeof siteConfig;

export const siteConfig = {
  name: env.NEXT_PUBLIC_SITE_NAME || 'Ottfree',
  author: env.NEXT_PUBLIC_SITE_NAME || 'Ottfree',
  slogan: 'Premium movies and TV shows, free to watch.',
  description:
    'Ottfree helps you discover and watch movies and TV shows with a fast, cinematic, mobile-friendly streaming experience.',
  keywords: [
    'Ottfree',
    'watch movies',
    'movies online',
    'watch TV',
    'TV shows online',
    'stream movies',
    'stream tv',
    'watch online',
    'free streaming',
  ],
  url: env.NEXT_PUBLIC_APP_URL,
  ogImage: `${env.NEXT_PUBLIC_APP_URL}/images/hero.jpg`,
  links: {
    twitter: `${env.NEXT_PUBLIC_TWITTER}`,
    github: 'https://github.com/dragonpilee/cinegeek-beta',
    githubAccount: '',
  },
  socialLinks: [
    { title: 'Facebook', href: `${env.NEXT_PUBLIC_FACEBOOK}`, icon: Icons.facebook },
    { title: 'Instagram', href: `${env.NEXT_PUBLIC_INSTAGRAM}`, icon: Icons.instagram },
    { title: 'Twitter', href: `${env.NEXT_PUBLIC_TWITTER}`, icon: Icons.twitter },
    { title: 'Youtube', href: `${env.NEXT_PUBLIC_YOUTUBE}`, icon: Icons.youtube },
  ],
  footerItems: [] as { title: string; href: string }[],
  mainNav: [
    { title: 'Home', href: '/home' },
    { title: 'Movies', href: '/movies' },
    { title: 'TV Shows', href: '/tv-shows' },
    { title: 'New & Popular', href: '/new-and-popular' },
  ],
};
