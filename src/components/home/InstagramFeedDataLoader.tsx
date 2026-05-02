import { getInstagramPosts, getBusinessInfo } from '@/lib/site-content';
import { InstagramFeed } from './InstagramFeed';

export const dynamic = 'force-dynamic';

export async function InstagramFeedDataLoader() {
  const [posts, business] = await Promise.all([
    getInstagramPosts(),
    getBusinessInfo(),
  ]);

  const instagramUrl = business.instagramUrl || process.env.NEXT_PUBLIC_INSTAGRAM_URL || 'https://instagram.com';

  return <InstagramFeed posts={posts} instagramUrl={instagramUrl} />;
}
