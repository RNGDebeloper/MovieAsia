import { redirect } from 'next/navigation';

export const revalidate = 3600;

export default function MovieDetailsRedirect({
  params,
}: {
  params: { slug: string };
}) {
  const id = params.slug.split('-').pop() ?? params.slug;
  redirect(`/watch/movie/${id}`);
}
