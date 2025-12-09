/**
 * Admin dashboard API route for individual banner operations
 * GET: Get banner by ID
 * PUT: Update banner
 * DELETE: Delete banner
 */

import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { getBannerById, updateBanner, deleteBanner } from '@/lib/banners';
import { logger } from '@/lib/logger';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const startTime = Date.now();
  let userId: string | undefined;
  let userEmail: string | undefined;
  let bannerId: string | undefined;

  try {
    // Check authentication
    const session = await auth();
    if (!session) {
      logger.warn('Banner fetch attempted without authentication');
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    userId = session.user?.id;
    userEmail = session.user?.email;
    const { id } = await params;
    bannerId = id;

    logger.operationStart('fetch banner', {
      userId,
      userEmail,
      resourceId: bannerId,
    });

    const banner = await getBannerById(id);
    if (!banner) {
      logger.warn('Banner not found', {
        userId,
        userEmail,
        resourceId: bannerId,
      });
      return NextResponse.json({ error: 'Banner not found' }, { status: 404 });
    }

    const duration = Date.now() - startTime;
    logger.operationSuccess('fetch banner', {
      userId,
      userEmail,
      resourceId: bannerId,
      metadata: {
        bannerId,
        title: banner.title,
        isActive: banner.is_active,
        durationMs: duration,
      },
    });

    return NextResponse.json(banner);
  } catch (error) {
    const duration = Date.now() - startTime;
    const err = error instanceof Error ? error : new Error(String(error));
    
    logger.operationFailure('fetch banner', err, {
      userId,
      userEmail,
      resourceId: bannerId,
      metadata: { durationMs: duration },
    });

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
  const startTime = Date.now();
  let userId: string | undefined;
  let userEmail: string | undefined;
  let bannerId: string | undefined;

  try {
    // Check authentication
    const session = await auth();
    if (!session) {
      logger.warn('Banner update attempted without authentication');
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    userId = session.user?.id;
    userEmail = session.user?.email;
    const { id } = await params;
    bannerId = id;

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

    logger.operationStart('update banner', {
      userId,
      userEmail,
      resourceId: bannerId,
      metadata: {
        fieldsToUpdate: Object.keys(updates),
        hasTitle: 'title' in updates,
        hasDates: 'start_date' in updates || 'end_date' in updates,
        isActiveChange: 'is_active' in updates ? updates.is_active : undefined,
      },
    });

    const banner = await updateBanner(id, updates);

    const duration = Date.now() - startTime;
    logger.operationSuccess('update banner', {
      userId,
      userEmail,
      resourceId: bannerId,
      metadata: {
        bannerId,
        title: banner.title,
        isActive: banner.is_active,
        durationMs: duration,
      },
    });

    return NextResponse.json(banner);
  } catch (error) {
    const duration = Date.now() - startTime;
    const err = error instanceof Error ? error : new Error(String(error));
    
    logger.operationFailure('update banner', err, {
      userId,
      userEmail,
      resourceId: bannerId,
      metadata: { durationMs: duration },
    });

    const errorMessage = err.message;
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
  const startTime = Date.now();
  let userId: string | undefined;
  let userEmail: string | undefined;
  let bannerId: string | undefined;

  try {
    // Check authentication
    const session = await auth();
    if (!session) {
      logger.warn('Banner deletion attempted without authentication');
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    userId = session.user?.id;
    userEmail = session.user?.email;
    const { id } = await params;
    bannerId = id;

    // Get banner info before deletion for logging
    const banner = await getBannerById(id);

    logger.operationStart('delete banner', {
      userId,
      userEmail,
      resourceId: bannerId,
      metadata: {
        bannerTitle: banner?.title,
        isActive: banner?.is_active,
      },
    });

    if (!banner) {
      logger.warn('Banner not found for deletion', {
        userId,
        userEmail,
        resourceId: bannerId,
      });
      return NextResponse.json({ error: 'Banner not found' }, { status: 404 });
    }

    await deleteBanner(id);

    const duration = Date.now() - startTime;
    logger.operationSuccess('delete banner', {
      userId,
      userEmail,
      resourceId: bannerId,
      metadata: {
        bannerId,
        bannerTitle: banner.title,
        durationMs: duration,
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    const duration = Date.now() - startTime;
    const err = error instanceof Error ? error : new Error(String(error));
    
    logger.operationFailure('delete banner', err, {
      userId,
      userEmail,
      resourceId: bannerId,
      metadata: { durationMs: duration },
    });

    return NextResponse.json(
      { error: 'Failed to delete banner' },
      { status: 500 }
    );
  }
}

