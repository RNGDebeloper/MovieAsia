import { NextResponse, type NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const isMaintenance = process.env.MAINTENANCE_MODE === 'true';

  if (pathname === '/') {
    const url = request.nextUrl.clone();
    url.pathname = '/home';
    return NextResponse.redirect(url);
  }
  const hasAdminSession = Boolean(request.cookies.get('ottfree_admin')?.value);

  if (
    isMaintenance &&
    !hasAdminSession &&
    !pathname.startsWith('/admin') &&
    !pathname.startsWith('/api/admin') &&
    !pathname.startsWith('/maintenance') &&
    !pathname.startsWith('/_next')
  ) {
    return NextResponse.redirect(new URL('/maintenance', request.url));
  }
  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};
