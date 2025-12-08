/**
 * Proxy middleware to protect admin routes (Next.js 16)
 * Renamed from middleware.ts to proxy.ts per Next.js 16 conventions
 */

import { auth } from "@/lib/auth";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function proxy(req: NextRequest) {
  // Allow access to login and API routes without authentication check
  // This prevents auth errors from blocking these essential routes
  const isLoginPage = req.nextUrl.pathname.startsWith("/login");
  const isApiRoute = req.nextUrl.pathname.startsWith("/api");
  const isAuthApiRoute = req.nextUrl.pathname.startsWith("/api/auth");
  
  // Always allow auth API routes and login page through
  if (isLoginPage || isAuthApiRoute) {
    return NextResponse.next();
  }
  
  // Allow other API routes through (they have their own auth checks)
  if (isApiRoute) {
    return NextResponse.next();
  }
  
  try {
    // In NextAuth v5, try to get session
    // The auth() function should work with trustHost: true in proxy context
    const session = await auth();
    const isLoggedIn = !!session;

    // Redirect to login if not authenticated
    if (!isLoggedIn) {
      return NextResponse.redirect(new URL("/login", req.url));
    }

    // If logged in, allow access
    return NextResponse.next();
  } catch (error) {
    // Handle JWT session errors (e.g., old session cookies from previous AUTH_SECRET)
    if (error instanceof Error && (
      error.message.includes('no matching decryption secret') ||
      error.message.includes('JWTSessionError') ||
      error.message.includes('decryption') ||
      error.message.includes('headers') ||
      error.message.includes('Cannot use')
    )) {
      // Clear invalid session and redirect to login
      const response = NextResponse.redirect(new URL("/login", req.url));
      // Clear any invalid session cookies
      response.cookies.delete('authjs.session-token');
      response.cookies.delete('__Secure-authjs.session-token');
      return response;
    }
    
    // Handle URL detection errors gracefully - redirect to login
    if (error instanceof Error && (error.message.includes('Invalid URL') || error.message.includes('URL'))) {
      console.warn('URL detection failed in proxy, redirecting to login:', error.message);
      return NextResponse.redirect(new URL("/login", req.url));
    }
    
    // For any other errors, redirect to login to be safe
    console.error('Auth check failed in proxy:', error);
    return NextResponse.redirect(new URL("/login", req.url));
  }
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};

