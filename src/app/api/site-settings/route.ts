/**
 * API route for site settings
 * GET: Get all site settings
 * POST: Update site settings
 */

import { NextRequest, NextResponse } from 'next/server';
import { getAllSiteSettings, setSiteSetting } from '@/lib/site-settings';

export async function GET() {
  try {
    const settings = await getAllSiteSettings();
    return NextResponse.json({ settings });
  } catch (error) {
    console.error('Error fetching site settings:', error);
    return NextResponse.json(
      { error: 'Failed to fetch site settings' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { key, value, description } = body;

    if (!key || value === undefined) {
      return NextResponse.json(
        { error: 'key and value are required' },
        { status: 400 }
      );
    }

    await setSiteSetting(key, value, description);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error updating site setting:', error);
    return NextResponse.json(
      { error: 'Failed to update site setting' },
      { status: 500 }
    );
  }
}

