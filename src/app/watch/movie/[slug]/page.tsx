import WatchPage from '@/components/watch/watch-page';
import { buildWatchMetadata } from '@/components/watch/watch-page';

export const dynamic = 'force-dynamic';

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}) {
  const id = params.slug.split('-').pop() ?? params.slug;
  return buildWatchMetadata({ mediaType: 'movie', id });
}

export default function Page({ params }: { params: { slug: string } }) {
  const id = params.slug.split('-').pop() ?? params.slug;
  return <WatchPage mediaType="movie" id={id} />;
}
