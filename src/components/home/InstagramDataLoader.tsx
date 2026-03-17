import { getInstagramPosts, getBusinessInfo } from '@/lib/site-content';
import { InstagramFeed } from './InstagramFeed';

export const dynamic = 'force-dynamic';

export async function InstagramDataLoader() {
  const [posts, business] = await Promise.all([getInstagramPosts(), getBusinessInfo()]);
  return <InstagramFeed posts={posts} instagramUrl={business.instagramUrl || 'https://instagram.com'} />;
}
