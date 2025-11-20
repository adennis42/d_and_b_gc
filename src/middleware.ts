/**
 * Next.js middleware for analytics and cache control
 * Runs on every request before the page renders
 */

import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const isDevelopment = process.env.NODE_ENV === 'development';

export function middleware(request: NextRequest) {
  const response = NextResponse.next();

  // In development, add cache-busting headers to prevent stale code
  if (isDevelopment) {
    response.headers.set(
      'Cache-Control',
      'no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0'
    );
    response.headers.set('Pragma', 'no-cache');
    response.headers.set('Expires', '0');
    response.headers.set('X-Content-Type-Options', 'nosniff');
    // Add ETag with timestamp to force revalidation
    response.headers.set('ETag', `"dev-${Date.now()}"`);
  } else {
    // Production: Add proper cache headers for HTML pages
    if (
      !request.nextUrl.pathname.startsWith('/_next/') &&
      !request.nextUrl.pathname.startsWith('/api/') &&
      !request.nextUrl.pathname.startsWith('/images/')
    ) {
      // HTML pages: Short cache with revalidation
      response.headers.set(
        'Cache-Control',
        'public, s-maxage=60, stale-while-revalidate=300'
      );
    }
  }

  // Track page views server-side
  // Note: This is a simple implementation. For production, you might want
  // to batch requests or use a queue to avoid blocking the response.

  // Extract request metadata
  const pagePath = request.nextUrl.pathname;
  const referrer = request.headers.get('referer') || undefined;
  const userAgent = request.headers.get('user-agent') || undefined;
  const ipAddress =
    request.ip || request.headers.get('x-forwarded-for') || undefined;

  // Determine device type from user agent
  const deviceType = userAgent
    ? userAgent.match(/Mobile|Android|iPhone|iPad/)
      ? 'mobile'
      : userAgent.match(/Tablet|iPad/)
      ? 'tablet'
      : 'desktop'
    : undefined;

  // Send analytics event asynchronously (don't block response)
  if (
    request.method === 'GET' &&
    !pagePath.startsWith('/api') &&
    !pagePath.startsWith('/_next')
  ) {
    // Fire and forget - don't wait for analytics
    fetch(`${request.nextUrl.origin}/api/analytics`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        event_type: 'page_view',
        page_path: pagePath,
        referrer,
        user_agent: userAgent,
        device_type: deviceType,
        ip_address: ipAddress,
      }),
    }).catch(() => {
      // Silently fail - analytics shouldn't break the app
    });
  }

  return response;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};

