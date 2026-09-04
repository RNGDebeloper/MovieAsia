import WatchPage from '@/components/watch/watch-page';
import { buildWatchMetadata } from '@/components/watch/watch-page';

export const revalidate = 3600;

export async function generateMetadata({ params }: { params: { slug: string } }) {
  const id = params.slug.split('-')[0] ?? params.slug;
  return buildWatchMetadata({ mediaType: 'tv', id });
}

export default function Page({ params }: { params: { slug: string } }) {
  const parts = params.slug.split('-');
  return (
    <WatchPage
      mediaType="tv"
      id={parts[0] ?? params.slug}
      season={parts[1] || '1'}
      episode={parts[2] || '1'}
    />
  );
}
