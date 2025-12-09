/**
 * On-demand revalidation API route
 * Allows admin dashboard to trigger cache revalidation for gallery page
 * 
 * This endpoint should be called after creating, updating, or deleting projects
 * to ensure the main website shows changes immediately.
 */

import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';

// Force dynamic rendering for this API route
export const dynamic = 'force-dynamic';

/**
 * POST /api/revalidate
 * Revalidates the gallery page cache
 * 
 * Requires a secret token to prevent unauthorized revalidation
 */
export async function POST(request: NextRequest) {
  const startTime = Date.now();
  
  try {
    // Check for secret token to prevent unauthorized revalidation
    const authHeader = request.headers.get('authorization');
    const secretToken = process.env.REVALIDATE_SECRET_TOKEN;
    
    console.log('[Revalidate] Request received', {
      hasAuthHeader: !!authHeader,
      hasSecretToken: !!secretToken,
      timestamp: new Date().toISOString(),
    });
    
    if (!secretToken) {
      console.warn('[Revalidate] REVALIDATE_SECRET_TOKEN not set - revalidation disabled for security');
      return NextResponse.json(
        { error: 'Revalidation not configured' },
        { status: 503 }
      );
    }

    if (authHeader !== `Bearer ${secretToken}`) {
      console.warn('[Revalidate] Unauthorized attempt', {
        providedToken: authHeader?.substring(0, 20) + '...',
        expectedPrefix: 'Bearer ',
      });
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    console.log('[Revalidate] Token validated, revalidating paths...');

    // Revalidate the gallery page
    revalidatePath('/gallery');
    console.log('[Revalidate] Revalidated /gallery');
    
    // Also revalidate the home page in case it shows featured projects
    revalidatePath('/');
    console.log('[Revalidate] Revalidated /');

    const duration = Date.now() - startTime;
    console.log('[Revalidate] Successfully completed', {
      durationMs: duration,
      timestamp: new Date().toISOString(),
    });

    return NextResponse.json({ 
      revalidated: true,
      now: Date.now(),
      paths: ['/gallery', '/'],
      durationMs: duration,
    });
  } catch (error) {
    const duration = Date.now() - startTime;
    console.error('[Revalidate] Error revalidating cache:', {
      error: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : undefined,
      durationMs: duration,
    });
    return NextResponse.json(
      { 
        error: 'Error revalidating cache',
        details: process.env.NODE_ENV === 'development' 
          ? (error instanceof Error ? error.message : String(error))
          : undefined,
      },
      { status: 500 }
    );
  }
}

