'use client';

import { useModalStore } from '@/stores/modal';
import type { Show } from '@/types';
import ShowModal from './shows-modal';
import { ShowCard } from './shows-carousel';
import { usePathname } from 'next/navigation';
import { useSearchStore } from '@/stores/search';
import ShowsSkeleton from './shows-skeleton';
import { cn } from '@/lib/utils';

interface SearchedShowsProps {
  shows: Show[];
  query?: string;
}

const ShowsGrid = ({ shows, query }: SearchedShowsProps) => {
  const pathname = usePathname();
  // modal store
  const modalStore = useModalStore();
  const searchStore = useSearchStore();

  return (
    <section
      aria-label="Grid of shows"
      className="container w-full max-w-none px-4 sm:px-6 lg:px-10">
      {modalStore.open && <ShowModal />}
      <div className="main-view mt-4 min-h-[70vh] pt-8" id="main-view">
        {query && searchStore.loading ? (
          <ShowsSkeleton classname="pl-0" />
        ) : query && !shows?.length ? (
          <div className="mx-auto max-w-xl rounded-3xl border border-white/10 bg-card/70 p-8 text-center shadow-xl">
            <p className="text-2xl font-bold">No matches for “{query}”</p>
            <p className="mt-3 text-muted-foreground">
              Try a movie, series, actor, director, or genre like comedy,
              romance, sports, or drama.
            </p>
          </div>
        ) : (
          <div
            className={cn(
              'xxs:grid-cols-2 grid w-full grid-cols-2 gap-3 xs:grid-cols-3 sm:grid-cols-3 sm:gap-4 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 2xl:grid-cols-8',
              query && 'max-sm:grid-cols-3 max-[375px]:grid-cols-2',
            )}>
            {shows.map((show: Show) => (
              <ShowCard key={show.id} show={show} pathname={pathname} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default ShowsGrid;
