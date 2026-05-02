import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { getBusinessInfo, setBusinessInfo } from '@/lib/site-content';
import { revalidateMainWebsite } from '@/lib/revalidate';

export async function GET() {
  try {
    let info = await getBusinessInfo();
    // Final guard: ensure we never return a string to the client
    if (typeof info === 'string') {
      try { info = JSON.parse(info as unknown as string); } catch { info = {} as any; }
    }
    return NextResponse.json(info);
  } catch (error) {
    console.error('Error fetching business info:', error);
    return NextResponse.json({ error: 'Failed to fetch business info' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    let body = await request.json();
    // Guard: if body somehow arrived as a string, parse it
    if (typeof body === 'string') { try { body = JSON.parse(body); } catch { body = {}; } }
    // Guard: if body has numeric keys (spread string artifact), extract named keys only
    const isCharMap = body && typeof body === 'object' && '0' in body;
    if (isCharMap) {
      // Extract only the named BusinessInfo fields
      const { name, phone, email, city, state, zip, instagramUrl, facebookUrl, serviceAreas, hours } = body;
      body = { name, phone, email, city, state, zip, instagramUrl, facebookUrl, serviceAreas, hours };
    }
    await setBusinessInfo(body);
    await revalidateMainWebsite();
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error saving business info:', error);
    return NextResponse.json({ error: 'Failed to save business info' }, { status: 500 });
  }
}
