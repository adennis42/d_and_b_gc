/**
 * Admin dashboard API route for hero section content
 * GET: Get hero content
 * POST: Update hero content (requires authentication)
 */

import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { getHeroContent, setHeroContent } from '@/lib/site-content';
import { revalidateMainWebsite } from '@/lib/revalidate';

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
    const { headline, subheadline, primaryCTA } = body;

    await setHeroContent({
      headline,
      subheadline,
      primaryCTA,
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

