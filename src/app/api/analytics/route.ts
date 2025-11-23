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

    // Validate event_type matches ENUM values
    const validEventTypes = [
      'page_view',
      'image_click',
      'video_play',
      'filter_use',
      'form_submit',
      'cta_click',
      'external_link_click',
    ];
    
    const validEventType = validEventTypes.includes(event_type) 
      ? event_type 
      : 'page_view';
    
    if (!validEventTypes.includes(event_type)) {
      console.warn(`Invalid event_type: ${event_type}, defaulting to page_view`);
    }

    // Validate device_type matches ENUM values
    const validDeviceTypes = ['mobile', 'tablet', 'desktop'];
    const validDeviceType = validDeviceTypes.includes(deviceType) 
      ? deviceType 
      : 'desktop';

    // Insert event into database
    // Handle NULL values by conditionally including columns in the INSERT
    try {
      const ipAddressParam = ipAddress || null;
      const metadataParam = metadata ? JSON.stringify(metadata) : null;

      // Build query dynamically based on whether optional fields have values
      // This avoids PostgreSQL type inference issues with NULL casting
      if (ipAddressParam && metadataParam) {
        // Both optional fields provided
        await sql.unsafe(
          `INSERT INTO analytics_events (
            event_type, page_path, referrer, user_agent, device_type, browser, os, ip_address, metadata
          ) VALUES (
            $1::event_type, $2, $3, $4, $5::device_type, $6, $7, $8::inet, $9::jsonb
          )`,
          [validEventType, page_path, referrerHeader, userAgent, validDeviceType, browser, os, ipAddressParam, metadataParam]
        );
      } else if (ipAddressParam) {
        // Only IP address provided
        await sql.unsafe(
          `INSERT INTO analytics_events (
            event_type, page_path, referrer, user_agent, device_type, browser, os, ip_address
          ) VALUES (
            $1::event_type, $2, $3, $4, $5::device_type, $6, $7, $8::inet
          )`,
          [validEventType, page_path, referrerHeader, userAgent, validDeviceType, browser, os, ipAddressParam]
        );
      } else if (metadataParam) {
        // Only metadata provided
        await sql.unsafe(
          `INSERT INTO analytics_events (
            event_type, page_path, referrer, user_agent, device_type, browser, os, metadata
          ) VALUES (
            $1::event_type, $2, $3, $4, $5::device_type, $6, $7, $8::jsonb
          )`,
          [validEventType, page_path, referrerHeader, userAgent, validDeviceType, browser, os, metadataParam]
        );
      } else {
        // Neither optional field provided
        await sql.unsafe(
          `INSERT INTO analytics_events (
            event_type, page_path, referrer, user_agent, device_type, browser, os
          ) VALUES (
            $1::event_type, $2, $3, $4, $5::device_type, $6, $7
          )`,
          [validEventType, page_path, referrerHeader, userAgent, validDeviceType, browser, os]
        );
      }
    } catch (dbError: any) {
      // Log detailed error for debugging
      const errorMessage = dbError?.message || String(dbError);
      const errorCode = dbError?.code;
      
      console.error('Database insert error:', {
        error: dbError,
        message: errorMessage,
        code: errorCode,
        detail: dbError?.detail,
        event_type: validEventType,
        device_type: validDeviceType,
        stack: dbError?.stack,
      });

      // Check if it's a table/relation doesn't exist error
      if (errorMessage?.includes('does not exist') || errorCode === '42P01') {
        console.warn('⚠️  Analytics table does not exist. Run: npm run setup-db');
        // In development, return success but log warning
        // In production, we might want to fail silently or queue for retry
        if (process.env.NODE_ENV === 'development') {
          return NextResponse.json(
            { 
              success: false, 
              error: 'Analytics table not set up',
              message: 'Run "npm run setup-db" to create the analytics_events table',
            },
            { status: 503 }
          );
        }
      }

      // Re-throw to be caught by outer catch block
      throw dbError;
    }

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error: any) {
    // Log detailed error for debugging
    console.error('Analytics tracking error:', {
      message: error?.message,
      code: error?.code,
      detail: error?.detail,
      stack: error?.stack,
      name: error?.name,
    });
    
    // In development, return more detailed error info
    if (process.env.NODE_ENV === 'development') {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Failed to track event',
          details: error?.message || String(error),
          code: error?.code,
        },
        { status: 500 }
      );
    }
    
    // Don't fail the request if analytics fails in production
    return NextResponse.json(
      { success: false, error: 'Failed to track event' },
      { status: 500 }
    );
  }
}

