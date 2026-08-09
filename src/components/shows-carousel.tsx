'use client';

import * as React from 'react';
import { useModalStore } from '@/stores/modal';
import { MediaType, type Show } from '@/types';

import { cn, getNameFromShow, getSlug } from '@/lib/utils';
import { Icons } from '@/components/icons';
import { Button } from '@/components/ui/button';
import { usePathname } from 'next/navigation';

interface ShowsCarouselProps {
  title: string;
  shows: Show[];
}

const ShowsCarousel = ({ title, shows }: ShowsCarouselProps) => {
  const pathname = usePathname();

  const showsRef = React.useRef<HTMLDivElement>(null);
  const [isScrollable, setIsScrollable] = React.useState(false);

  // handle scroll to left and right
  const scrollToDirection = (direction: 'left' | 'right') => {
    if (!showsRef.current) return;

    setIsScrollable(true);
    const { scrollLeft, offsetWidth } = showsRef.current;
    const handleSize = offsetWidth > 1400 ? 60 : 0.04 * offsetWidth;
    const offset =
      direction === 'left'
        ? scrollLeft - (offsetWidth - 2 * handleSize)
        : scrollLeft + (offsetWidth - 2 * handleSize);
    showsRef.current.scrollTo({ left: offset, behavior: 'smooth' });

    if (scrollLeft === 0 && direction === 'left') {
      showsRef.current.scrollTo({
        left: showsRef.current.scrollWidth,
        behavior: 'smooth',
      });
    } else if (
      scrollLeft + offsetWidth === showsRef.current.scrollWidth &&
      direction === 'right'
    ) {
      showsRef.current.scrollTo({
        left: 0,
        behavior: 'smooth',
      });
    }
  };

  return (
    <section
      aria-label={`${title} carousel`}
      className="relative my-8 p-0 lg:my-12">
      {shows.length !== 0 && (
        <div className="space-y-1 sm:space-y-2.5">
          <h2 className="m-0 px-4 font-heading text-2xl font-semibold tracking-tight text-foreground sm:px-6 lg:px-10 lg:text-3xl 2xl:px-[60px]">
            {title ?? '-'}
          </h2>
          <div className="relative w-full items-center justify-center overflow-hidden">
            <Button
              aria-label="Scroll to left"
              variant="ghost"
              className={cn(
                'absolute left-0 top-0 z-10 mr-2 hidden h-full w-[4%] items-center justify-center rounded-l-none bg-black/20 py-0 text-white opacity-0 backdrop-blur transition hover:bg-black/60 hover:opacity-100 focus-visible:opacity-100 focus-visible:ring-orange-400 md:block 2xl:w-[60px]',
                isScrollable ? 'md:block' : 'md:hidden',
              )}
              onClick={() => scrollToDirection('left')}>
              <Icons.chevronLeft className="h-8 w-8" aria-hidden="true" />
            </Button>
            <div
              ref={showsRef}
              className="no-scrollbar xxs:auto-cols-[38%] m-0 grid auto-cols-[42%] grid-flow-col gap-3 overflow-x-auto overflow-y-hidden scroll-smooth px-4 py-3 duration-500 ease-in-out sm:auto-cols-[28%] sm:px-6 md:touch-pan-y lg:auto-cols-[20%] lg:px-10 xl:auto-cols-[calc((100%-5rem)/6)] 2xl:px-[60px]">
              {shows.map((show) => (
                <ShowCard key={show.id} show={show} pathname={pathname} />
              ))}
            </div>
            <Button
              aria-label="Scroll to right"
              variant="ghost"
              className="absolute right-0 top-0 z-10 m-0 ml-2 hidden h-full w-[4%] items-center justify-center rounded-r-none bg-black/20 py-0 text-white opacity-0 backdrop-blur transition hover:bg-black/60 hover:opacity-100 focus-visible:opacity-100 focus-visible:ring-orange-400 md:block 2xl:w-[60px]"
              onClick={() => scrollToDirection('right')}>
              <Icons.chevronRight className="h-8 w-8" aria-hidden="true" />
            </Button>
          </div>
        </div>
      )}
    </section>
  );
};

export default ShowsCarousel;

export const ShowCard = ({
  show,
  pathname,
}: {
  show: Show;
  pathname: string;
}) => {
  const imageOnErrorHandler = (
    event: React.SyntheticEvent<HTMLImageElement, Event>,
  ) => {
    event.currentTarget.src = '/images/grey-thumbnail.jpg';
  };

  return (
    // <picture className="relative aspect-[2/3] md:aspect-video">
    <div className="group relative aspect-[2/3] overflow-hidden rounded-2xl bg-muted shadow-sm shadow-black/20 ring-1 ring-white/10 transition duration-300 focus-within:ring-2 focus-within:ring-orange-400 md:hover:-translate-y-1 md:hover:shadow-xl md:hover:shadow-orange-950/30">
      {/* <source */}
      {/*   // srcSet={`https://image.tmdb.org/t/p/w342/${show.poster_path ?? show.backdrop_path}`} */}
      {/*   srcSet={ */}
      {/*     show.backdrop_path ?? show.poster_path */}
      {/*       ? `https://image.tmdb.org/t/p/w500/${ */}
      {/*           show.backdrop_path ?? show.poster_path */}
      {/*         }` */}
      {/*       : '/images/grey-thumbnail.jpg' */}
      {/*   } */}
      {/*   media="(min-width: 780px)" */}
      {/* /> */}
      <button
        type="button"
        className="block h-full w-full text-left"
        aria-label={`Open details for ${getNameFromShow(show)}`}
        onClick={() => {
          const name = getNameFromShow(show);
          const path: string =
            show.media_type === MediaType.TV ? 'tv-shows' : 'movies';
          window.history.pushState(
            null,
            '',
            `${path}/${getSlug(show.id, name)}`,
          );
          useModalStore.setState({
            show: show,
            open: true,
            play: true,
          });
        }}>
        <img
          src={
            show.poster_path ?? show.backdrop_path
              ? `https://image.tmdb.org/t/p/w500/${
                  show.poster_path ?? show.backdrop_path
                }`
              : '/images/grey-thumbnail.jpg'
          }
          alt={show.title ?? show.name ?? 'poster'}
          className="h-full w-full cursor-pointer object-cover transition duration-500 group-hover:scale-105"
          loading="lazy"
          onError={imageOnErrorHandler}
        />
      </button>
      <div className="pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent p-3 opacity-100">
        <p className="line-clamp-2 text-sm font-bold text-white sm:text-base">
          {getNameFromShow(show)}
        </p>
        <p className="mt-1 text-xs font-medium text-orange-200">
          {show.release_date ?? show.first_air_date ?? 'Tap for details'}
        </p>
      </div>
    </div>
  );
};
