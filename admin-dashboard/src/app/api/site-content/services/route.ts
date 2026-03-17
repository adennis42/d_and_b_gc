import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { getServicesItems, setServicesItems } from '@/lib/site-content';
import { revalidateMainWebsite } from '@/lib/revalidate';

export async function GET() {
  try {
    const items = await getServicesItems();
    return NextResponse.json(items);
  } catch (error) {
    console.error('Error fetching services:', error);
    return NextResponse.json({ error: 'Failed to fetch services' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const body = await request.json();
    if (!Array.isArray(body)) return NextResponse.json({ error: 'Body must be an array' }, { status: 400 });
    await setServicesItems(body);
    await revalidateMainWebsite();
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error saving services:', error);
    return NextResponse.json({ error: 'Failed to save services' }, { status: 500 });
  }
}
