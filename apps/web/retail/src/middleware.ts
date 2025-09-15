import { NextRequest, NextResponse } from 'next/server';

export function middleware(req: NextRequest) {
  const refreshToken = req.cookies.get('refresh_token');
  console.log(refreshToken);
  const isAuthPage = req.nextUrl.pathname.startsWith('/auth');
  const isDashboard = req.nextUrl.pathname.startsWith('/dashboard');
  // check if no refresh token in cookie if no -> login if yes -> dashboard
  if (!refreshToken && !isAuthPage) {
    return NextResponse.redirect(
      new URL(`${process.env.NEXT_PUBLIC_BASE_URL}/auth/login`, req.url)
    );
  }

  if (isDashboard && !refreshToken) {
    new URL(`${process.env.NEXT_PUBLIC_BASE_URL}/auth/login`, req.url);
  }

  return NextResponse.next();
}
export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};
