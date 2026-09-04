import {
  COOKIE_NAME,
  getConfiguredAdminCredentials,
  signAdminSession,
} from '@/lib/admin';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  const form = await request.formData();
  const username = String(form.get('username') ?? '');
  const password = String(form.get('password') ?? '');
  const { username: configuredUsername, password: configuredPassword } =
    getConfiguredAdminCredentials();

  if (
    !configuredUsername ||
    !configuredPassword ||
    username !== configuredUsername ||
    password !== configuredPassword
  ) {
    const url = new URL('/admin', request.url);
    url.searchParams.set('error', 'invalid-credentials');
    return NextResponse.redirect(url, 303);
  }

  // A POST must not be replayed after a successful login. The default 307
  // redirect preserves the POST method, which made browsers request POST
  // /admin (and left users unable to reach the dashboard).
  const response = NextResponse.redirect(new URL('/admin', request.url), 303);
  response.cookies.set(COOKIE_NAME, signAdminSession(username), {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: 60 * 60 * 8,
  });
  return response;
}
