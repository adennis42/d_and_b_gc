import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { getAboutPreview, setAboutPreview } from '@/lib/site-content';
import { revalidateMainWebsite } from '@/lib/revalidate';

export async function GET() {
  try {
    const preview = await getAboutPreview();
    return NextResponse.json(preview);
  } catch (error) {
    console.error('Error fetching about preview:', error);
    return NextResponse.json({ error: 'Failed to fetch about preview' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const body = await request.json();
    await setAboutPreview(body);
    await revalidateMainWebsite();
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error saving about preview:', error);
    return NextResponse.json({ error: 'Failed to save about preview' }, { status: 500 });
  }
}
