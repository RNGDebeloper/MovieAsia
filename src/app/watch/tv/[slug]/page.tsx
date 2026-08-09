import React from 'react';
import EmbedPlayer from '@/components/watch/embed-player';
import { buildPlayerUrl } from '@/configs/player';
import { getIdFromSlug, getNameFromShow } from '@/lib/utils';
import MovieService from '@/services/MovieService';

export const revalidate = 3600;

export default async function Page({ params }: { params: { slug: string } }) {
  const id = getIdFromSlug(params.slug);
  const show = id
    ? (await MovieService.findTvSeries(id).catch(() => null))?.data ?? null
    : null;
  const episodeInfo = show?.number_of_seasons
    ? `${show.number_of_seasons} season${
        show.number_of_seasons === 1 ? '' : 's'
      }${
        show.number_of_episodes ? ` • ${show.number_of_episodes} episodes` : ''
      }`
    : undefined;
  return (
    <EmbedPlayer
      url={buildPlayerUrl('tv', id)}
      title={getNameFromShow(show) || 'Series'}
      subtitle={episodeInfo}
    />
  );
}
