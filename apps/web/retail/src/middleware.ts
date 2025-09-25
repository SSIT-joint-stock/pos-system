import { NextRequest, NextResponse } from 'next/server';

export function middleware(req: NextRequest) {
  const refreshToken = req.cookies.get('refresh_token');
  const { pathname } = req.nextUrl;

  const isDashboard = pathname.startsWith('/dashboard');

  // Nếu chưa đăng nhập mà vào dashboard → redirect về login
  if (!refreshToken && process.env.NEXT_PUBLIC_BASE_URL && isDashboard) {
    return NextResponse.redirect(
      new URL(`${process.env.NEXT_PUBLIC_MAIN_URL}/auth/login`, req.url)
    );
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};
