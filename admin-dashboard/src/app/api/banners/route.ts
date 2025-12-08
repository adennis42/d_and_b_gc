/**
 * Admin dashboard API route for promotional banners
 * GET: Get all banners
 * POST: Create new banner
 */

import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { getAllBanners, createBanner } from '@/lib/banners';

export async function GET() {
  try {
    // Check authentication
    const session = await auth();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const banners = await getAllBanners();
    return NextResponse.json(banners);
  } catch (error) {
    console.error('Error fetching banners:', error);
    return NextResponse.json(
      { error: 'Failed to fetch banners' },
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
    const {
      title,
      description,
      icon_name,
      background_color,
      text_color,
      button_text,
      button_link,
      button_color,
      start_date,
      end_date,
      is_active,
      is_dismissible,
      show_countdown,
      ttl_days,
    } = body;

    if (!title || !start_date || !end_date) {
      return NextResponse.json(
        { error: 'Title, start date, and end date are required' },
        { status: 400 }
      );
    }

    const banner = await createBanner({
      title,
      description: description || null,
      icon_name: icon_name || null,
      background_color: background_color || '#3B82F6',
      text_color: text_color || '#FFFFFF',
      button_text: button_text || null,
      button_link: button_link || null,
      button_color: button_color || '#FFFFFF',
      start_date: new Date(start_date),
      end_date: new Date(end_date),
      is_active: is_active !== undefined ? is_active : true,
      is_dismissible: is_dismissible !== undefined ? is_dismissible : true,
      show_countdown: show_countdown !== undefined ? show_countdown : false,
      ttl_days: ttl_days !== undefined ? (ttl_days === null ? null : Number(ttl_days)) : null,
    });

    return NextResponse.json(banner, { status: 201 });
  } catch (error) {
    console.error('Error creating banner:', error);
    return NextResponse.json(
      { error: 'Failed to create banner' },
      { status: 500 }
    );
  }
}

