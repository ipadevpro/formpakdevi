import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const session = request.cookies.get("session")?.value;
  const { pathname } = request.nextUrl;

  // Paths requiring authentication
  const isDashboardRoute = pathname.startsWith("/dashboard") || pathname.startsWith("/forms");

  if (isDashboardRoute && !session) {
    // Redirect to login if unauthorized
    const loginUrl = new URL("/login", request.url);
    return NextResponse.redirect(loginUrl);
  }

  // Redirect to dashboard if logged in and visiting login/landing page (optional dashboard forwarding)
  if (pathname === "/login" && session) {
    const dashboardUrl = new URL("/dashboard", request.url);
    return NextResponse.redirect(dashboardUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/forms/:path*",
    "/login",
  ],
};
