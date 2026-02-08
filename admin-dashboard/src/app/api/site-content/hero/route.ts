/**
 * Admin dashboard API route for hero section content
 * GET: Get hero content
 * POST: Update hero content (requires authentication)
 */

import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { getHeroContent, setHeroContent } from '@/lib/site-content';
import { logger } from '@/lib/logger';

/**
 * Revalidate the main website's homepage cache
 * Called after hero content changes to ensure immediate updates
 */
async function revalidateMainWebsite() {
  const revalidateSecret = process.env.REVALIDATE_SECRET_TOKEN;
  const mainSiteUrl = process.env.MAIN_SITE_URL || 'https://dbcontractorsny.com';
  
  if (!revalidateSecret) {
    logger.warn('REVALIDATE_SECRET_TOKEN not set - skipping cache revalidation');
    return;
  }

  try {
    const response = await fetch(`${mainSiteUrl}/api/revalidate`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${revalidateSecret}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      logger.warn('Failed to revalidate main website cache', {
        metadata: {
          status: response.status,
          statusText: response.statusText,
        },
      });
    } else {
      logger.info('Successfully revalidated main website cache');
    }
  } catch (error) {
    logger.warn('Error calling revalidation endpoint', {
      metadata: {
        error: error instanceof Error ? error.message : String(error),
      },
    });
  }
}

export async function GET() {
  try {
    const content = await getHeroContent();
    return NextResponse.json(content || {
      headline: '',
      subheadline: '',
      primaryCTA: { text: '', link: '' },
      secondaryCTA: { text: '', link: '' },
    });
  } catch (error) {
    console.error('Error fetching hero content:', error);
    return NextResponse.json(
      { error: 'Failed to fetch hero content' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    // Check authentication
    const session = await auth();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { headline, subheadline, primaryCTA, secondaryCTA } = body;

    await setHeroContent({
      headline,
      subheadline,
      primaryCTA,
      secondaryCTA,
    });

    // Revalidate main website cache so changes appear immediately
    await revalidateMainWebsite();

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error updating hero content:', error);
    return NextResponse.json(
      { error: 'Failed to update hero content' },
      { status: 500 }
    );
  }
}

