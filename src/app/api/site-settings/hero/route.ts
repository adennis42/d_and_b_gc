/**
 * API route for hero image settings
 * GET: Get hero image configuration
 * POST: Update hero image (requires authentication)
 */

import { NextRequest, NextResponse } from 'next/server';
import { getHeroImageUrl, getHeroImageAlt, setSiteSetting } from '@/lib/site-settings';

export async function GET() {
  try {
    const [url, alt] = await Promise.all([
      getHeroImageUrl(),
      getHeroImageAlt(),
    ]);

    return NextResponse.json({
      url,
      alt,
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
    const body = await request.json();
    const { url, alt } = body;

    if (!url) {
      return NextResponse.json(
        { error: 'url is required' },
        { status: 400 }
      );
    }

    // Update hero image URL
    await setSiteSetting(
      'hero_image_url',
      url,
      'Hero image URL for homepage'
    );

    // Update hero image alt text if provided
    if (alt) {
      await setSiteSetting(
        'hero_image_alt',
        alt,
        'Hero image alt text for accessibility'
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error updating hero image settings:', error);
    return NextResponse.json(
      { error: 'Failed to update hero image settings' },
      { status: 500 }
    );
  }
}

