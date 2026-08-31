import React from 'react';
import { siteConfig } from '@/configs/site';
import Link from 'next/link';
import { Icons } from '@/components/icons';

const footerLinks = [
  { title: 'Home', href: '/home' },
  { title: 'Movies', href: '/movies' },
  { title: 'TV Shows', href: '/tv-shows' },
  { title: 'New & Popular', href: '/new-and-popular' },
];

const SiteFooter = () => {
  return (
    <footer
      aria-label="Footer"
      className="mt-12 w-full border-t border-white/10 bg-black/60">
      <div className="container grid w-full max-w-7xl gap-8 px-4 py-10 sm:px-6 lg:grid-cols-[1.2fr_0.8fr_1fr] lg:px-8">
        <div>
          <Link href="/home" className="inline-flex items-center gap-3">
            <span className="grid h-10 w-10 place-items-center rounded-2xl bg-red-600 shadow-lg shadow-red-950/40">
              <Icons.play
                className="h-5 w-5 fill-current text-white"
                aria-hidden="true"
              />
            </span>
            <span className="text-2xl font-black tracking-tight text-white">
              {siteConfig.name}
            </span>
          </Link>
          <p className="mt-4 max-w-md text-sm leading-6 text-zinc-400">
            {siteConfig.description}
          </p>
        </div>

        <nav aria-label="Footer navigation">
          <h2 className="text-sm font-bold uppercase tracking-[0.25em] text-zinc-300">
            Browse
          </h2>
          <ul className="mt-4 grid grid-cols-2 gap-3 text-sm text-zinc-400 sm:grid-cols-1">
            {footerLinks.map((item) => (
              <li key={item.href}>
                <Link href={item.href} className="transition hover:text-white">
                  {item.title}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div>
          <h2 className="text-sm font-bold uppercase tracking-[0.25em] text-zinc-300">
            Connect
          </h2>
          <div className="mt-4 flex flex-wrap gap-2">
            {siteConfig.socialLinks.map((item) =>
              item.href ? (
                <Link
                  key={item.title}
                  href={item.href}
                  target="_blank"
                  rel="noreferrer"
                  className="grid h-10 w-10 place-items-center rounded-full border border-white/10 bg-white/5 text-zinc-300 transition hover:border-red-500/60 hover:bg-red-600 hover:text-white">
                  {item.icon && <item.icon className="h-5 w-5" />}
                  <span className="sr-only">{item.title}</span>
                </Link>
              ) : null,
            )}
          </div>
          <p className="mt-5 text-xs leading-5 text-zinc-500">
            Ottfree does not host media files. Playback links are provided by
            third-party services; legal concerns should be directed to those
            hosts.
          </p>
        </div>
      </div>
      <div className="border-t border-white/10 px-4 py-5 text-center text-xs text-zinc-500">
        © {new Date().getFullYear()} {siteConfig.author}. All rights reserved.
      </div>
    </footer>
  );
};

export default SiteFooter;
