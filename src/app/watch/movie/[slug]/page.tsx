import WatchPage from '@/components/watch/watch-page';

export const revalidate = 3600;

export default function Page({ params }: { params: { slug: string } }) {
  const id = params.slug.split('-').pop() ?? params.slug;
  return <WatchPage mediaType="movie" id={id} />;
}
