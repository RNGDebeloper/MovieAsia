import React from 'react';
import EmbedPlayer from '@/components/watch/embed-player';
import { buildPlayerUrl } from '@/configs/player';
import { getIdFromSlug, getNameFromShow } from '@/lib/utils';
import MovieService from '@/services/MovieService';

export const revalidate = 3600;

export default async function Page({ params }: { params: { slug: string } }) {
  const id = getIdFromSlug(params.slug);
  const show = id
    ? (await MovieService.findMovie(id).catch(() => null))?.data ?? null
    : null;
  return (
    <EmbedPlayer
      url={buildPlayerUrl('movie', id)}
      title={getNameFromShow(show) || 'Movie'}
      subtitle={
        show?.release_date ? `Released ${show.release_date}` : undefined
      }
    />
  );
}
