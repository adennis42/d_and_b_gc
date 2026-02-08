/**
 * Admin dashboard API route for hero image settings
 * GET: Get hero image configuration
 * POST: Update hero image (requires authentication)
 */

import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { sql } from '@/lib/db';
import { logger } from '@/lib/logger';

/**
 * Revalidate the main website's homepage cache
 * Called after hero image changes to ensure immediate updates
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
    // Get hero image URL
    const heroUrlResult = await sql`
      SELECT value FROM site_settings WHERE key = 'hero_image_url' LIMIT 1
    `;
    const heroUrl = heroUrlResult.length > 0 ? heroUrlResult[0].value : null;

    // Get hero image alt text
    const heroAltResult = await sql`
      SELECT value FROM site_settings WHERE key = 'hero_image_alt' LIMIT 1
    `;
    const heroAlt = heroAltResult.length > 0 ? heroAltResult[0].value : null;

    return NextResponse.json({
      url: heroUrl || '/images/hero.jpg',
      alt: heroAlt || 'Beautiful kitchen and bathroom remodeling showcase',
    });
  } catch (error) {
    console.error('Error fetching hero image settings:', error);
    return NextResponse.json(
      { error: 'Failed to fetch hero image settings' },
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
    const { url, alt } = body;

    if (!url) {
      return NextResponse.json(
        { error: 'url is required' },
        { status: 400 }
      );
    }

    // Update hero image URL
    await sql`
      INSERT INTO site_settings (key, value, description)
      VALUES ('hero_image_url', ${url}, 'Hero image URL for homepage')
      ON CONFLICT (key) 
      DO UPDATE SET 
        value = EXCLUDED.value,
        updated_at = CURRENT_TIMESTAMP
    `;

    // Update hero image alt text if provided
    if (alt !== undefined) {
      await sql`
        INSERT INTO site_settings (key, value, description)
        VALUES ('hero_image_alt', ${alt}, 'Hero image alt text for accessibility')
        ON CONFLICT (key) 
        DO UPDATE SET 
          value = EXCLUDED.value,
          updated_at = CURRENT_TIMESTAMP
      `;
    }

    // Revalidate main website cache so changes appear immediately
    await revalidateMainWebsite();

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error updating hero image settings:', error);
    return NextResponse.json(
      { error: 'Failed to update hero image settings' },
      { status: 500 }
    );
  }
}

