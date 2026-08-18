'use client';

import React, { useEffect, useState } from 'react';
import { MediaType, type Show } from '@/types';
import { useSearchStore } from '@/stores/search';
import { Button } from '@/components/ui/button';
import { Icons } from '@/components/icons';
import Image from 'next/image';
import { useModalStore } from '@/stores/modal';
import Link from 'next/link';
import { getIdFromSlug } from '@/lib/utils';
import MovieService from '@/services/MovieService';
import { type AxiosResponse } from 'axios';

interface HeroProps {
  shows: Show[];
}

const Hero = ({ shows }: HeroProps) => {
  const [randomShow, setRandomShow] = useState<Show | null>(null);
  useEffect(() => {
    const randomNumber = Math.floor(Math.random() * shows.length);
    setRandomShow(shows[randomNumber] ?? null);
  }, [shows]);

  React.useEffect(() => {
    window.addEventListener('popstate', handlePopstateEvent, false);
    return () => {
      window.removeEventListener('popstate', handlePopstateEvent, false);
    };
  }, []);

  const handlePopstateEvent = () => {
    const pathname = window.location.pathname;
    if (!/\d/.test(pathname)) {
      modalStore.reset();
    } else if (/\d/.test(pathname)) {
      const movieId: number = getIdFromSlug(pathname);
      if (!movieId) {
        return;
      }
      const findMovie: Promise<AxiosResponse<Show>> = pathname.includes(
        '/tv-shows',
      )
        ? MovieService.findTvSeries(movieId)
        : MovieService.findMovie(movieId);
      findMovie
        .then((response: AxiosResponse<Show>) => {
          const { data } = response;
          useModalStore.setState({ show: data, open: true, play: true });
        })
        .catch((error) => {
          console.log(`findMovie: `, error);
        });
    }
  };

  // stores
  const modalStore = useModalStore();
  const searchStore = useSearchStore();

  if (searchStore.query.length > 0) {
    return null;
  }

  return (
    <section aria-label="Hero" className="w-full">
      {randomShow && (
        <>
          <div className="absolute inset-0 z-0 h-[115vw] w-full overflow-hidden sm:h-[56.25vw]">
            <Image
              src={`https://image.tmdb.org/t/p/original/${
                randomShow?.backdrop_path ?? randomShow?.poster_path ?? ''
              }`}
              alt={randomShow?.title ?? 'poster'}
              className="-z-40 h-auto w-full object-cover"
              fill
              priority
            />
            <div className="absolute bottom-0 left-0 right-0 top-0">
              <div className="absolute bottom-[20%] left-[4%] top-0 z-10 flex w-[88%] flex-col justify-end space-y-3 sm:bottom-[28%] sm:w-[55%] lg:w-[42%]">
                <h1 className="text-3xl font-bold tracking-tight sm:text-[4vw] lg:text-[3vw]">
                  {randomShow?.title ?? randomShow?.name}
                </h1>
                <div className="flex flex-wrap gap-2 text-sm font-semibold text-white/85 md:text-[1.2vw]">
                  <p className="text-green-600">
                    {Math.round(randomShow?.vote_average * 10) ?? '-'}% Match
                  </p>
                  {/* <p className="text-gray-300">{randomShow?.release_date ?? "-"}</p> */}
                  <p>{randomShow?.release_date ?? '-'}</p>
                </div>
                {/* <p className="line-clamp-4 text-sm text-gray-300 md:text-base"> */}
                <p className="line-clamp-3 max-w-2xl text-sm leading-6 text-white/75 sm:text-[1.2vw]">
                  {randomShow?.overview ?? '-'}
                </p>
                <div className="mt-[1.5vw] flex items-center space-x-2">
                  <Link
                    prefetch={false}
                    href={`/watch/${
                      randomShow.media_type === MediaType.MOVIE ? 'movie' : 'tv'
                    }/${randomShow.id}`}>
                    <Button
                      aria-label="Play video"
                      className="h-auto flex-shrink-0 gap-2 rounded-xl"
                      // onClick={() => {
                      //   modalStore.setShow(randomShow);
                      //   modalStore.setOpen(true);
                      //   modalStore.setPlay(true);
                      // }}
                    >
                      <Icons.play className="fill-current" aria-hidden="true" />
                      Play
                    </Button>
                  </Link>
                  <Button
                    aria-label="Open show's details modal"
                    variant="outline"
                    className="h-auto flex-shrink-0 gap-2 rounded-xl"
                    onClick={() => {
                      modalStore.setShow(randomShow);
                      modalStore.setOpen(true);
                      modalStore.setPlay(true);
                    }}>
                    <Icons.info aria-hidden="true" />
                    More Info
                  </Button>
                </div>
              </div>
            </div>{' '}
            <div className="absolute inset-0 right-[10%] z-[8] bg-gradient-to-r from-[#05060b] via-[#05060b]/75 to-transparent"></div>
            <div className="absolute bottom-[-1px] left-0 right-0 z-[8] h-[14.7vw] bg-gradient-to-b from-background/0 from-30% via-background/30 via-50% to-background to-80%"></div>
          </div>
          <div className="relative inset-0 -z-50 mb-5 pb-[60%] sm:pb-[40%]"></div>
        </>
      )}
    </section>
  );
};

export default Hero;
