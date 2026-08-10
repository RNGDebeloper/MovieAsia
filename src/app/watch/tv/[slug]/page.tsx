import React from 'react';
import EmbedPlayer from '@/components/watch/embed-player';

export const revalidate = 3600;

export default function Page({
  params,
}: {
  params: { slug: string };
}) {
  // Example slug:
  // 79744-1-1
  //
  // 79744 = TMDB ID
  // 1     = Season
  // 1     = Episode

  const parts = params.slug.split('-');

  const id = parts[0];
  const season = parts[1] || '1';
  const episode = parts[2] || '1';

  const embedUrl = `https://vidsrc.sbs/embed/tv/${id}/${season}/${episode}`;

  return <EmbedPlayer url={embedUrl} />;
}
