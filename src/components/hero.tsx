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
          <div className="absolute inset-0 z-0 h-[115vw] min-h-[560px] w-full sm:h-[62vw] lg:h-[50vw] lg:min-h-[620px]">
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
              <div className="absolute inset-x-4 bottom-[22%] top-0 z-10 flex max-w-3xl flex-col justify-end space-y-4 sm:left-[4%] sm:right-auto sm:w-[58%] lg:w-[42%]">
                <h1 className="font-heading text-4xl font-bold leading-tight sm:text-5xl lg:text-7xl">
                  {randomShow?.title ?? randomShow?.name}
                </h1>
                <div className="flex flex-wrap gap-2 text-sm font-semibold sm:text-base lg:text-xl">
                  <p className="bg-green-500/15 rounded-full px-3 py-1 text-green-300">
                    {Math.round(randomShow?.vote_average * 10) ?? '-'}% Match
                  </p>
                  {/* <p className="text-gray-300">{randomShow?.release_date ?? "-"}</p> */}
                  <p className="rounded-full bg-white/10 px-3 py-1 text-white">
                    {randomShow?.release_date ?? '-'}
                  </p>
                </div>
                {/* <p className="line-clamp-4 text-sm text-gray-300 md:text-base"> */}
                <p className="line-clamp-3 max-w-2xl text-base leading-7 text-zinc-200 sm:text-lg lg:text-xl">
                  {randomShow?.overview ?? '-'}
                </p>
                <div className="mt-2 flex flex-wrap items-center gap-3">
                  <Link
                    prefetch={false}
                    href={`/watch/${
                      randomShow.media_type === MediaType.MOVIE ? 'movie' : 'tv'
                    }/${randomShow.id}`}>
                    <Button
                      aria-label="Play video"
                      className="min-h-12 flex-shrink-0 gap-2 rounded-full px-6 text-base font-bold"
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
                    className="min-h-12 flex-shrink-0 gap-2 rounded-full border-white/30 bg-white/10 px-6 text-base font-bold text-white backdrop-blur hover:bg-white/20"
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
            <div className="absolute inset-0 right-0 z-[8] bg-gradient-to-r from-black via-black/60 to-transparent"></div>
            <div className="absolute bottom-[-1px] left-0 right-0 z-[8] h-44 bg-gradient-to-b from-background/0 via-background/60 to-background"></div>
          </div>
          <div className="relative inset-0 -z-50 mb-5 min-h-[560px] pb-[76%] sm:pb-[52%] lg:pb-[42%]"></div>
        </>
      )}
    </section>
  );
};

export default Hero;
