/**
 * Proxy middleware to protect admin routes (Next.js 16)
 * Renamed from middleware.ts to proxy.ts per Next.js 16 conventions
 */

import { auth } from "@/lib/auth";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function proxy(req: NextRequest) {
  const session = await auth();
  const isLoggedIn = !!session;
  const isLoginPage = req.nextUrl.pathname.startsWith("/login");

  // Redirect to login if not authenticated and not on login page
  if (!isLoggedIn && !isLoginPage) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  // Redirect to dashboard if logged in and on login page
  if (isLoggedIn && isLoginPage) {
    return NextResponse.redirect(new URL("/projects", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};

