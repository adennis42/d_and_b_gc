import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { getInstagramPosts, setInstagramPosts } from '@/lib/site-content';
import { revalidateMainWebsite } from '@/lib/revalidate';

export async function GET() {
  try {
    const posts = await getInstagramPosts();
    return NextResponse.json(posts);
  } catch (error) {
    console.error('Error fetching instagram posts:', error);
    return NextResponse.json({ error: 'Failed to fetch instagram posts' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const body = await request.json();
    if (!Array.isArray(body)) return NextResponse.json({ error: 'Body must be an array' }, { status: 400 });
    await setInstagramPosts(body);
    await revalidateMainWebsite();
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error saving instagram posts:', error);
    return NextResponse.json({ error: 'Failed to save instagram posts' }, { status: 500 });
  }
}
