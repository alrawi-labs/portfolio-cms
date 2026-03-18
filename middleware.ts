import { NextRequest, NextResponse } from "next/server";
import createMiddleware from 'next-intl/middleware';
import { routing } from './i18n/routing';

const intlMiddleware = createMiddleware(routing);
const PROTECTED = /^\/admin(?!\/login)/;

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Admin rotaları — next-intl'e geçirme, sadece auth kontrol et
  if (pathname.startsWith("/admin")) {
    if (PROTECTED.test(pathname)) {
      const token = request.cookies.get("admin_token")?.value;
      if (!token || token !== process.env.ADMIN_SECRET) {
        const loginUrl = new URL("/admin/login", request.url);
        loginUrl.searchParams.set("from", pathname);
        return NextResponse.redirect(loginUrl);
      }
    }
    return NextResponse.next();
  }

  // Diğer tüm rotalar — next-intl middleware'e devret
  return intlMiddleware(request);
}

export const config = {
  matcher: [
    "/admin/:path*",
    "/",
    "/(tr|en|ar)/:path*",
    "/((?!_next|_vercel|api|.*\\..*).*)",
  ],
};