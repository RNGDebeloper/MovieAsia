import { COOKIE_NAME } from '@/lib/admin';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  const response = NextResponse.redirect(new URL('/admin', request.url), 303);
  response.cookies.delete(COOKIE_NAME);
  return response;
}
