/**
 * Analytics API route for server-side event tracking
 * Stores events in PostgreSQL database for custom analytics dashboard
 */

import { NextRequest, NextResponse } from 'next/server';
import { sql } from '@/lib/db';
import { headers } from 'next/headers';

// Parse user agent to extract device/browser info
function parseUserAgent(userAgent: string | null): {
  deviceType: 'mobile' | 'tablet' | 'desktop';
  browser: string | null;
  os: string | null;
} {
  if (!userAgent) {
    return { deviceType: 'desktop', browser: null, os: null };
  }

  const ua = userAgent.toLowerCase();
  
  // Detect device type
  let deviceType: 'mobile' | 'tablet' | 'desktop' = 'desktop';
  if (/mobile|android|iphone|ipod|blackberry|iemobile|opera mini/i.test(ua)) {
    deviceType = 'mobile';
  } else if (/tablet|ipad|playbook|silk/i.test(ua)) {
    deviceType = 'tablet';
  }

  // Detect browser
  let browser: string | null = null;
  if (ua.includes('chrome') && !ua.includes('edg')) browser = 'Chrome';
  else if (ua.includes('firefox')) browser = 'Firefox';
  else if (ua.includes('safari') && !ua.includes('chrome')) browser = 'Safari';
  else if (ua.includes('edg')) browser = 'Edge';
  else if (ua.includes('opera') || ua.includes('opr')) browser = 'Opera';

  // Detect OS
  let os: string | null = null;
  if (ua.includes('windows')) os = 'Windows';
  else if (ua.includes('mac os')) os = 'macOS';
  else if (ua.includes('linux')) os = 'Linux';
  else if (ua.includes('android')) os = 'Android';
  else if (ua.includes('ios') || ua.includes('iphone') || ua.includes('ipad')) os = 'iOS';

  return { deviceType, browser, os };
}

/**
 * POST /api/analytics
 * Track an analytics event
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      event_type,
      page_path,
      referrer,
      metadata,
    }: {
      event_type: string;
      page_path: string;
      referrer?: string;
      metadata?: Record<string, unknown>;
    } = body;

    // Get headers for user agent and IP
    const headersList = await headers();
    const userAgent = headersList.get('user-agent');
    const forwardedFor = headersList.get('x-forwarded-for');
    const realIp = headersList.get('x-real-ip');
    const ipAddress = forwardedFor?.split(',')[0] || realIp || null;

    // Parse user agent
    const { deviceType, browser, os } = parseUserAgent(userAgent);

    // Get referrer from request or headers
    const referrerHeader = headersList.get('referer') || referrer || null;

    // Insert event into database
    await sql`
      INSERT INTO analytics_events (
        event_type,
        page_path,
        referrer,
        user_agent,
        device_type,
        browser,
        os,
        ip_address,
        metadata
      ) VALUES (
        ${event_type}::event_type,
        ${page_path},
        ${referrerHeader},
        ${userAgent},
        ${deviceType}::device_type,
        ${browser},
        ${os},
        ${ipAddress ? `${ipAddress}::inet` : null},
        ${metadata ? JSON.stringify(metadata) : null}::jsonb
      )
    `;

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error('Analytics tracking error:', error);
    // Don't fail the request if analytics fails
    return NextResponse.json(
      { success: false, error: 'Failed to track event' },
      { status: 500 }
    );
  }
}

