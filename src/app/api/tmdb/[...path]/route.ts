import { NextResponse } from 'next/server';

import BaseService from '@/services/BaseService/BaseService';

const TMDB_BASE_URL = 'https://api.themoviedb.org/3';
const allowedPath = new RegExp(
  '^/(?:trending/(?:movie|tv|all)/day|(?:movie|tv)/\\d+(?:/keywords)?|discover/(?:movie|tv)|search/multi|(?:movie|tv)/(?:popular|top_rated))$',
);

export async function GET(
  request: Request,
  { params }: { params: { path: string[] } },
) {
  const path = `/${params.path.join('/')}`;

  if (!allowedPath.test(path)) {
    return NextResponse.json(
      { error: 'Unsupported TMDB endpoint.' },
      { status: 400 },
    );
  }

  try {
    const response = await BaseService.axios(TMDB_BASE_URL).get(path, {
      params: Object.fromEntries(new URL(request.url).searchParams),
    });
    return NextResponse.json(response.data, {
      headers: {
        'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600',
      },
    });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : 'TMDB request failed.';
    const status = message.includes('TMDB_API_TOKEN') ? 503 : 502;
    console.error('TMDB proxy request failed:', error);
    return NextResponse.json({ error: message }, { status });
  }
}
