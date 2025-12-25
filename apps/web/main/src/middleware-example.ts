import { NextRequest, NextResponse } from 'next/server';

export function middleware(req: NextRequest) {
  const refreshToken = req.cookies.get('refresh_token')?.value;
  const providerId = req.cookies.get('provider_id')?.value;

  const { pathname } = req.nextUrl;

  const isCreateStoreOauth = pathname.startsWith('/oauth/create-store');
  const isSelectStoreOauth = pathname.startsWith('/oauth/select-store');
  const isOauthProtectedRoute = isCreateStoreOauth || isSelectStoreOauth;
  if (!refreshToken && !providerId && isOauthProtectedRoute) {
    return NextResponse.redirect(new URL('/auth/login', req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};
