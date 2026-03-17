import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { getCtaContent, setCtaContent } from '@/lib/site-content';
import { revalidateMainWebsite } from '@/lib/revalidate';

export async function GET() {
  try {
    const content = await getCtaContent();
    return NextResponse.json(content);
  } catch (error) {
    console.error('Error fetching CTA content:', error);
    return NextResponse.json({ error: 'Failed to fetch CTA content' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const body = await request.json();
    await setCtaContent(body);
    await revalidateMainWebsite();
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error saving CTA content:', error);
    return NextResponse.json({ error: 'Failed to save CTA content' }, { status: 500 });
  }
}
