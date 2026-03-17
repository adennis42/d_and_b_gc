import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { getBusinessInfo, setBusinessInfo } from '@/lib/site-content';
import { revalidateMainWebsite } from '@/lib/revalidate';

export async function GET() {
  try {
    const info = await getBusinessInfo();
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
    const body = await request.json();
    await setBusinessInfo(body);
    await revalidateMainWebsite();
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error saving business info:', error);
    return NextResponse.json({ error: 'Failed to save business info' }, { status: 500 });
  }
}
