/**
 * Admin dashboard API route for promotional banners
 * GET: Get all banners
 * POST: Create new banner
 */

import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { getAllBanners, createBanner } from '@/lib/banners';
import { logger } from '@/lib/logger';

export async function GET() {
  const startTime = Date.now();
  let userId: string | undefined;
  let userEmail: string | undefined;

  try {
    // Check authentication
    const session = await auth();
    if (!session) {
      logger.warn('Banner list fetch attempted without authentication');
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    userId = session.user?.id;
    userEmail = session.user?.email;

    logger.operationStart('fetch banners list', { userId, userEmail });

    const banners = await getAllBanners();

    const duration = Date.now() - startTime;
    logger.operationSuccess('fetch banners list', {
      userId,
      userEmail,
      metadata: {
        bannerCount: banners.length,
        durationMs: duration,
      },
    });

    return NextResponse.json(banners);
  } catch (error) {
    const duration = Date.now() - startTime;
    const err = error instanceof Error ? error : new Error(String(error));
    
    logger.operationFailure('fetch banners list', err, {
      userId,
      userEmail,
      metadata: { durationMs: duration },
    });

    return NextResponse.json(
      { error: 'Failed to fetch banners' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  const startTime = Date.now();
  let userId: string | undefined;
  let userEmail: string | undefined;
  let bannerId: string | undefined;

  try {
    // Check authentication
    const session = await auth();
    if (!session) {
      logger.warn('Banner creation attempted without authentication');
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    userId = session.user?.id;
    userEmail = session.user?.email;

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

    logger.operationStart('create banner', {
      userId,
      userEmail,
      metadata: {
        title,
        isActive: is_active !== undefined ? is_active : true,
        hasButton: !!button_text,
        ttlDays: ttl_days,
      },
    });

    if (!title || !start_date || !end_date) {
      logger.warn('Banner creation failed: missing required fields', {
        userId,
        userEmail,
        metadata: {
          hasTitle: !!title,
          hasStartDate: !!start_date,
          hasEndDate: !!end_date,
        },
      });
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

    bannerId = banner.id;
    const duration = Date.now() - startTime;
    logger.operationSuccess('create banner', {
      userId,
      userEmail,
      resourceId: bannerId,
      metadata: {
        bannerId,
        title,
        isActive: banner.is_active,
        durationMs: duration,
      },
    });

    return NextResponse.json(banner, { status: 201 });
  } catch (error) {
    const duration = Date.now() - startTime;
    const err = error instanceof Error ? error : new Error(String(error));
    
    logger.operationFailure('create banner', err, {
      userId,
      userEmail,
      resourceId: bannerId,
      metadata: { durationMs: duration },
    });

    return NextResponse.json(
      { error: 'Failed to create banner' },
      { status: 500 }
    );
  }
}

