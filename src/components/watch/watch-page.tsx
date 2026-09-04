import Image from 'next/image';
import type { Metadata } from 'next';

import { WatchBackButton } from '@/components/watch/back-button';
import { getEnabledVideoServers } from '@/lib/video-servers';
import MovieService from '@/services/MovieService';
import VideoPlayer from './video-player';
import { AdUnit } from '@/components/ad-unit';

interface WatchPageProps {
  mediaType: 'movie' | 'tv';
  id: string;
  season?: string;
  episode?: string;
}

export async function buildWatchMetadata({
  mediaType,
  id,
}: Pick<WatchPageProps, 'mediaType' | 'id'>): Promise<Metadata> {
  try {
    const show = await MovieService.findMovieByIdAndType(Number(id), mediaType);
    const title = show.title ?? show.name ?? 'Watch now';
    const description =
      show.overview ?? `Watch ${title} on Ottfree.`;
    const image = show.backdrop_path ?? show.poster_path;

    return {
      title,
      description,
      alternates: { canonical: `/watch/${mediaType}/${id}` },
      openGraph: {
        title,
        description,
        type: mediaType === 'movie' ? 'video.movie' : 'video.tv_show',
        images: image ? [`https://image.tmdb.org/t/p/w1280/${image}`] : [],
      },
      twitter: { card: 'summary_large_image', title, description },
    };
  } catch {
    return {
      title: 'Watch now',
      description: 'Watch movies and TV shows on Ottfree.',
      robots: { index: false, follow: false },
    };
  }
}

export default async function WatchPage({
  mediaType,
  id,
  season,
  episode,
}: WatchPageProps) {
  const show = await MovieService.findMovieByIdAndType(Number(id), mediaType);
  const servers = getEnabledVideoServers();
  const poster = show.poster_path
    ? `https://image.tmdb.org/t/p/w500/${show.poster_path}`
    : '/images/grey-thumbnail.jpg';
  const title = show.title ?? show.name ?? 'Selected title';

  return (
    <main className="min-h-screen overflow-x-hidden bg-background text-foreground">
      <section className="mx-auto flex w-full max-w-[1800px] flex-col gap-6 px-3 py-4 sm:px-5 lg:px-8">
        <WatchBackButton />

        <AdUnit
          label="Watch page top banner"
          placement="watch-top"
          className="max-w-[1200px]"
        />

        <VideoPlayer
          servers={servers}
          media={{ type: mediaType, id, season, episode }}
          title={title}
        />

        <AdUnit
          label="VAST video demand slot"
          placement="watch-vast"
          format="vast"
          className="max-w-[1200px]"
        />

        <section
          aria-labelledby="watch-info"
          className="grid gap-5 rounded-3xl border border-zinc-800 bg-zinc-950/80 p-4 shadow-2xl shadow-black/40 sm:p-6 md:grid-cols-[180px_1fr] lg:grid-cols-[220px_1fr]">
          <div className="relative aspect-[2/3] w-full max-w-[220px] overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-900 max-md:mx-auto">
            <Image
              src={poster}
              alt={`${title} poster`}
              fill
              sizes="(max-width: 768px) 45vw, 220px"
              className="object-cover"
            />
          </div>
          <div className="flex flex-col justify-center gap-4">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.35em] text-red-500">
                Movie/TV Information
              </p>
              <h1
                id="watch-info"
                className="mt-2 text-3xl font-bold tracking-tight text-white sm:text-4xl lg:text-5xl">
                {title}
              </h1>
            </div>
            <div className="flex flex-wrap gap-2 text-sm text-zinc-300">
              <span className="rounded-full bg-zinc-900 px-3 py-1 ring-1 ring-zinc-800">
                {(show.release_date ?? show.first_air_date ?? '').slice(0, 4) ||
                  'N/A'}
              </span>
              <span className="rounded-full bg-zinc-900 px-3 py-1 ring-1 ring-zinc-800">
                {mediaType === 'movie' ? 'Movie' : 'TV Show'}
              </span>
              {show.vote_average ? (
                <span className="rounded-full bg-zinc-900 px-3 py-1 ring-1 ring-zinc-800">
                  ★ {show.vote_average.toFixed(1)}
                </span>
              ) : null}
              {mediaType === 'tv' ? (
                <span className="rounded-full bg-red-600 px-3 py-1 text-white">
                  S{season ?? 1} E{episode ?? 1}
                </span>
              ) : null}
            </div>
            <p className="max-w-5xl text-base leading-7 text-zinc-300 sm:text-lg">
              {show.overview || 'Description is not available for this title.'}
            </p>
            {show.genres?.length ? (
              <div className="flex flex-wrap gap-2">
                {show.genres.map((genre) => (
                  <span
                    key={genre.id}
                    className="rounded-full border border-zinc-700 px-3 py-1 text-sm text-zinc-200">
                    {genre.name}
                  </span>
                ))}
              </div>
            ) : null}
          </div>
        </section>
      </section>
    </main>
  );
}
