import { redirect } from 'next/navigation';

export const revalidate = 3600;

export default function TvDetailsRedirect({
  params,
}: {
  params: { slug: string };
}) {
  const id = params.slug.split('-').pop() ?? params.slug;
  redirect(`/watch/tv/${id}`);
}
