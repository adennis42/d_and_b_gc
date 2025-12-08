import { NextResponse } from 'next/server';
import { cleanupExpiredBanners } from '@/lib/banners';

/**
 * Vercel Cron Job endpoint to clean up expired banners
 * Runs daily at 2 AM UTC
 * 
 * Configure in vercel.json:
 * {
 *   "crons": [{
 *     "path": "/api/cron/cleanup-banners",
 *     "schedule": "0 2 * * *"
 *   }]
 * }
 * 
 * Security: Verify the request is from Vercel Cron using CRON_SECRET
 */
export async function GET(request: Request) {
  // Verify the request is from Vercel Cron
  const authHeader = request.headers.get('authorization');
  const cronSecret = process.env.CRON_SECRET;
  
  // In production, require CRON_SECRET to be set
  if (process.env.NODE_ENV === 'production' && cronSecret) {
    if (authHeader !== `Bearer ${cronSecret}`) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
  }

  try {
    const deletedCount = await cleanupExpiredBanners();
    return NextResponse.json({ 
      success: true, 
      deletedCount,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Cron job error:', error);
    return NextResponse.json({ 
      error: 'Failed to cleanup banners',
      message: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}

