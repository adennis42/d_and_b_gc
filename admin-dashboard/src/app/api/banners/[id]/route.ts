/**
 * Admin dashboard API route for individual banner operations
 * GET: Get banner by ID
 * PUT: Update banner
 * DELETE: Delete banner
 */

import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { getBannerById, updateBanner, deleteBanner } from '@/lib/banners';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Check authentication
    const session = await auth();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    const banner = await getBannerById(id);
    if (!banner) {
      return NextResponse.json({ error: 'Banner not found' }, { status: 404 });
    }

    return NextResponse.json(banner);
  } catch (error) {
    console.error('Error fetching banner:', error);
    return NextResponse.json(
      { error: 'Failed to fetch banner' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Check authentication
    const session = await auth();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    const body = await request.json();
    const updates: Partial<{
      title: string;
      description: string | null;
      icon_name: string | null;
      background_color: string;
      text_color: string;
      button_text: string | null;
      button_link: string | null;
      button_color: string;
      start_date: Date;
      end_date: Date;
      is_active: boolean;
      is_dismissible: boolean;
      show_countdown: boolean;
    }> = {};

    // Only include fields that are explicitly provided and not null/undefined
    if (body.title !== undefined && body.title !== null) updates.title = body.title;
    if (body.description !== undefined) updates.description = body.description || null;
    if (body.icon_name !== undefined) updates.icon_name = body.icon_name || null;
    if (body.background_color !== undefined && body.background_color !== null) updates.background_color = body.background_color;
    if (body.text_color !== undefined && body.text_color !== null) updates.text_color = body.text_color;
    if (body.button_text !== undefined) updates.button_text = body.button_text || null;
    if (body.button_link !== undefined) updates.button_link = body.button_link || null;
    if (body.button_color !== undefined && body.button_color !== null) updates.button_color = body.button_color;
    if (body.start_date !== undefined && body.start_date !== null) updates.start_date = new Date(body.start_date);
    if (body.end_date !== undefined && body.end_date !== null) updates.end_date = new Date(body.end_date);
    if (body.is_active !== undefined) {
      updates.is_active = Boolean(body.is_active);
    }
    if (body.is_dismissible !== undefined) {
      updates.is_dismissible = Boolean(body.is_dismissible);
    }
    if (body.show_countdown !== undefined) {
      updates.show_countdown = Boolean(body.show_countdown);
    }

    const banner = await updateBanner(id, updates);
    return NextResponse.json(banner);
  } catch (error) {
    console.error('Error updating banner:', error);
    const errorMessage = error instanceof Error ? error.message : 'Failed to update banner';
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Check authentication
    const session = await auth();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    await deleteBanner(id);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting banner:', error);
    return NextResponse.json(
      { error: 'Failed to delete banner' },
      { status: 500 }
    );
  }
}

