/**
 * On-demand revalidation API route
 * Allows admin dashboard to trigger cache revalidation for gallery page
 * 
 * This endpoint should be called after creating, updating, or deleting projects
 * to ensure the main website shows changes immediately.
 */

import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';

/**
 * POST /api/revalidate
 * Revalidates the gallery page cache
 * 
 * Requires a secret token to prevent unauthorized revalidation
 */
export async function POST(request: NextRequest) {
  try {
    // Check for secret token to prevent unauthorized revalidation
    const authHeader = request.headers.get('authorization');
    const secretToken = process.env.REVALIDATE_SECRET_TOKEN;
    
    if (!secretToken) {
      console.warn('REVALIDATE_SECRET_TOKEN not set - revalidation disabled for security');
      return NextResponse.json(
        { error: 'Revalidation not configured' },
        { status: 503 }
      );
    }

    if (authHeader !== `Bearer ${secretToken}`) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Revalidate the gallery page
    revalidatePath('/gallery');
    
    // Also revalidate the home page in case it shows featured projects
    revalidatePath('/');

    return NextResponse.json({ 
      revalidated: true,
      now: Date.now(),
      paths: ['/gallery', '/'],
    });
  } catch (error) {
    console.error('Error revalidating cache:', error);
    return NextResponse.json(
      { error: 'Error revalidating cache' },
      { status: 500 }
    );
  }
}

