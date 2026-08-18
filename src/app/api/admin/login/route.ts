import { COOKIE_NAME, signAdminSession } from '@/lib/admin';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  const form = await request.formData();
  const username = String(form.get('username') ?? '');
  const password = String(form.get('password') ?? '');
  const configuredUsername = process.env.ADMIN_USERNAME;
  const configuredPassword = process.env.ADMIN_PASSWORD;

  if (
    !configuredUsername ||
    !configuredPassword ||
    username !== configuredUsername ||
    password !== configuredPassword
  ) {
    return new NextResponse('Unauthorized', { status: 401 });
  }

  const response = NextResponse.redirect(new URL('/admin', request.url));
  response.cookies.set(COOKIE_NAME, signAdminSession(username), {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: 60 * 60 * 8,
  });
  return response;
}
