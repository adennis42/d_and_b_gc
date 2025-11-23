/**
 * Server component that loads the active promotional banner
 * Fetches banner from database and passes to client component
 */

import { getActiveBanner } from '@/lib/banners';
import { PromotionalBanner } from './PromotionalBanner';

/**
 * Server component wrapper that fetches active banner
 * Only displays banner if one is active and within date range
 */
export async function BannerLoader() {
  const banner = await getActiveBanner();

  if (!banner) {
    return null;
  }

  return <PromotionalBanner banner={banner} />;
}

