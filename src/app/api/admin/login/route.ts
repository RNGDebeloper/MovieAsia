import { COOKIE_NAME, signAdminSession } from '@/lib/admin';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  const form = await request.formData();
  const password = String(form.get('password') ?? '');
  const configured = process.env.ADMIN_PASSWORD;
  if (!configured || password !== configured) {
    return new NextResponse('Unauthorized', { status: 401 });
  }
  const response = NextResponse.redirect(new URL('/admin', request.url));
  response.cookies.set(COOKIE_NAME, signAdminSession(), { httpOnly: true, sameSite: 'lax', secure: process.env.NODE_ENV === 'production', path: '/', maxAge: 60 * 60 * 8 });
  return response;
}
