/**
 * Next.js middleware for analytics and other cross-cutting concerns
 * Runs on every request before the page renders
 */

import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // Track page views server-side
  // Note: This is a simple implementation. For production, you might want
  // to batch requests or use a queue to avoid blocking the response.
  
  // Only track in production and for GET requests
  if (
    process.env.NODE_ENV === 'production' &&
    request.method === 'GET' &&
    !request.nextUrl.pathname.startsWith('/api') &&
    !request.nextUrl.pathname.startsWith('/_next')
  ) {
    // Fire and forget - don't wait for analytics
    fetch(`${request.nextUrl.origin}/api/analytics`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-forwarded-for': request.headers.get('x-forwarded-for') || '',
        'user-agent': request.headers.get('user-agent') || '',
        'referer': request.headers.get('referer') || '',
      },
      body: JSON.stringify({
        event_type: 'page_view',
        page_path: request.nextUrl.pathname,
        referrer: request.headers.get('referer') || null,
      }),
    }).catch(() => {
      // Silently fail - analytics shouldn't break the app
    });
  }

  return NextResponse.next();
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

