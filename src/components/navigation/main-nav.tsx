'use client';

import React from 'react';
import { type NavItem, type Show } from '@/types';
import Link from 'next/link';
import {
  cn,
  getSearchValue,
  handleDefaultSearchBtn,
  handleDefaultSearchInp,
} from '@/lib/utils';
import { siteConfig } from '@/configs/site';
import { Icons } from '@/components/icons';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { usePathname, useRouter } from 'next/navigation';
import { useSearchStore } from '@/stores/search';
import { ModeToggle as ThemeToggle } from '@/components/theme-toggle';
import { DebouncedInput } from '@/components/debounced-input';
import MovieService from '@/services/MovieService';

interface MainNavProps {
  items?: NavItem[];
}

interface SearchResult {
  results: Show[];
}

export function MainNav({ items }: MainNavProps) {
  const path = usePathname();
  const router = useRouter();
  const searchStore = useSearchStore();
  const [isScrolled, setIsScrolled] = React.useState(false);

  const handlePopstateEvent = React.useCallback(() => {
    const pathname = window.location.pathname;
    const search: string = getSearchValue('q');

    if (!search?.length || !pathname.includes('/search')) {
      searchStore.reset();
      searchStore.setOpen(false);
    } else if (search?.length) {
      searchStore.setOpen(true);
      searchStore.setLoading(true);
      searchStore.setQuery(search);
      setTimeout(() => handleDefaultSearchBtn(), 10);
      setTimeout(() => handleDefaultSearchInp(), 20);
      MovieService.searchMovies(search)
        .then((response: SearchResult) => {
          void searchStore.setShows(response.results);
        })
        .catch((e) => {
          console.error(e);
          void searchStore.setShows([]);
        })
        .finally(() => searchStore.setLoading(false));
    }
  }, [searchStore]);

  React.useEffect(() => {
    window.addEventListener('popstate', handlePopstateEvent, false);
    return () => {
      window.removeEventListener('popstate', handlePopstateEvent, false);
    };
  }, [handlePopstateEvent]);

  async function searchShowsByQuery(value: string) {
    if (!value?.trim()?.length) {
      if (path === '/search') {
        router.push('/home');
      } else {
        window.history.pushState(null, '', path);
      }
      searchStore.reset();
      return;
    }

    if (getSearchValue('q')?.trim()?.length) {
      window.history.replaceState(
        null,
        '',
        `/search?q=${encodeURIComponent(value)}`,
      );
    } else {
      window.history.pushState(
        null,
        '',
        `/search?q=${encodeURIComponent(value)}`,
      );
    }

    searchStore.setQuery(value);
    searchStore.setOpen(true);
    searchStore.setLoading(true);
    try {
      const shows = await MovieService.searchMovies(value);
      void searchStore.setShows(shows.results);
    } catch (error) {
      console.error(error);
      void searchStore.setShows([]);
    } finally {
      searchStore.setLoading(false);
    }

    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  React.useEffect(() => {
    const changeBgColor = () => setIsScrolled(window.scrollY > 0);
    changeBgColor();
    window.addEventListener('scroll', changeBgColor);
    return () => window.removeEventListener('scroll', changeBgColor);
  }, []);

  const handleChangeStatusOpen = (value: boolean): void => {
    searchStore.setOpen(value);
    if (!value) searchStore.reset();
  };

  return (
    <nav
      aria-label="Primary navigation"
      className={cn(
        'min-h-16 sticky top-0 z-50 flex w-full items-center justify-between gap-3 border-b border-white/10 px-4 py-3 backdrop-blur-xl transition-colors duration-300 sm:px-6 lg:px-10',
        isScrolled
          ? 'bg-background/95 shadow-lg shadow-black/20'
          : 'bg-background/70',
      )}>
      <div className="flex min-w-0 items-center gap-3 lg:gap-8">
        <Link
          href="/"
          className="group flex min-w-max items-center gap-3 rounded-full"
          onClick={() => handleChangeStatusOpen(false)}>
          <span className="grid h-10 w-10 place-items-center rounded-2xl bg-gradient-to-br from-orange-500 via-rose-500 to-fuchsia-600 shadow-lg shadow-orange-900/30 transition-transform group-hover:scale-105">
            <Icons.play
              className="h-5 w-5 fill-white text-white"
              aria-hidden="true"
            />
          </span>
          <span className="xxs:block hidden leading-tight">
            <span className="block font-heading text-lg tracking-tight text-foreground sm:text-xl">
              {siteConfig.name}
            </span>
            <span className="hidden text-[11px] font-medium uppercase tracking-[0.18em] text-orange-400 sm:block">
              {siteConfig.slogan}
            </span>
          </span>
          <span className="sr-only">Home</span>
        </Link>
        {items?.length ? (
          <div className="hidden items-center gap-1 rounded-full border border-white/10 bg-card/50 p-1 md:flex">
            {items.map((item, index) =>
              item.href ? (
                <Link
                  key={index}
                  href={item.href}
                  className={cn(
                    'rounded-full px-4 py-2 text-sm font-semibold text-muted-foreground transition hover:bg-orange-500/10 hover:text-foreground xl:text-base',
                    path === item.href &&
                      'bg-orange-500 text-white shadow-sm shadow-orange-950/40 hover:bg-orange-500 hover:text-white',
                    item.disabled && 'pointer-events-none opacity-50',
                  )}
                  onClick={() => handleChangeStatusOpen(false)}>
                  {item.title}
                </Link>
              ) : null,
            )}
          </div>
        ) : null}
        <div className="block md:hidden">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                className="min-h-11 rounded-full px-3 text-base font-semibold hover:bg-orange-500/10 focus-visible:ring-orange-400">
                Menu
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="start"
              sideOffset={14}
              className="w-64 rounded-2xl p-2">
              <DropdownMenuLabel className="text-center">
                <span className="block font-heading text-lg">
                  {siteConfig.name}
                </span>
                <span className="text-xs text-muted-foreground">
                  {siteConfig.slogan}
                </span>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              {items?.map((item, index) =>
                item.href ? (
                  <DropdownMenuItem
                    key={index}
                    asChild
                    className="rounded-xl p-0">
                    <Link
                      className={cn(
                        'min-h-11 w-full rounded-xl px-4 py-3 text-base font-semibold',
                        path === item.href && 'bg-orange-500 text-white',
                      )}
                      href={item.href}
                      onClick={() => handleChangeStatusOpen(false)}>
                      {item.title}
                    </Link>
                  </DropdownMenuItem>
                ) : null,
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
      <div className="flex min-w-0 flex-1 items-center justify-end gap-2 md:flex-none">
        <DebouncedInput
          id="search-input"
          open={searchStore.isOpen}
          value={searchStore.query}
          onChange={searchShowsByQuery}
          onChangeStatusOpen={handleChangeStatusOpen}
          containerClassName={cn(
            path === '/' ? 'hidden' : 'flex',
            'min-w-0 max-w-full',
          )}
        />
        <ThemeToggle />
      </div>
    </nav>
  );
}

export default MainNav;
