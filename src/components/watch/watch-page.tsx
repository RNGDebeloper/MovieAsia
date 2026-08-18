import Image from 'next/image';
import { getEnabledVideoServers } from '@/lib/video-servers';
import MovieService from '@/services/MovieService';
import { MediaType } from '@/types';
import VideoPlayer from './video-player';

interface WatchPageProps {
  mediaType: 'movie' | 'tv';
  id: string;
  season?: string;
  episode?: string;
}

export default async function WatchPage({ mediaType, id, season, episode }: WatchPageProps) {
  const show = await MovieService.findMovieByIdAndType(Number(id), mediaType);
  const servers = getEnabledVideoServers();
  const poster = show.poster_path
    ? `https://image.tmdb.org/t/p/w500/${show.poster_path}`
    : '/images/grey-thumbnail.jpg';

  return (
    <main className="min-h-screen bg-[#05060b] text-white">
      <section className="mx-auto flex w-full max-w-[1800px] flex-col gap-8 px-3 py-4 sm:px-5 lg:px-8">
        <VideoPlayer
          servers={servers}
          media={{ type: mediaType, id, season, episode }}
          title={show.title ?? show.name ?? 'Selected title'}
        />

        <section aria-labelledby="watch-info" className="grid gap-5 rounded-3xl border border-white/10 bg-white/[0.04] p-4 shadow-2xl shadow-black/30 sm:p-6 md:grid-cols-[180px_1fr] lg:grid-cols-[220px_1fr]">
          <div className="relative aspect-[2/3] w-full max-w-[220px] overflow-hidden rounded-2xl bg-white/10 max-md:mx-auto">
            <Image src={poster} alt={`${show.title ?? show.name ?? 'Title'} poster`} fill sizes="(max-width: 768px) 45vw, 220px" className="object-cover" />
          </div>
          <div className="flex flex-col justify-center gap-4">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.35em] text-cyan-300">Now streaming on Ottfree</p>
              <h1 id="watch-info" className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl">{show.title ?? show.name}</h1>
            </div>
            <div className="flex flex-wrap gap-2 text-sm text-white/75">
              <span className="rounded-full bg-white/10 px-3 py-1">{(show.release_date ?? show.first_air_date ?? '').slice(0, 4) || 'N/A'}</span>
              <span className="rounded-full bg-white/10 px-3 py-1">{mediaType === 'movie' ? 'Movie' : 'TV Show'}</span>
              {show.vote_average ? <span className="rounded-full bg-white/10 px-3 py-1">★ {show.vote_average.toFixed(1)}</span> : null}
              {mediaType === 'tv' ? <span className="rounded-full bg-white/10 px-3 py-1">S{season ?? 1} E{episode ?? 1}</span> : null}
            </div>
            <p className="max-w-5xl text-base leading-7 text-white/75 sm:text-lg">{show.overview || 'Description is not available for this title.'}</p>
            {show.genres?.length ? <div className="flex flex-wrap gap-2">{show.genres.map((genre) => <span key={genre.id} className="rounded-full border border-white/15 px-3 py-1 text-sm text-white/80">{genre.name}</span>)}</div> : null}
          </div>
        </section>
      </section>
    </main>
  );
}
