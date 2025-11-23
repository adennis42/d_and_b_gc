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
  try {
    const banner = await getActiveBanner();

    if (!banner) {
      return null;
    }

    return <PromotionalBanner banner={banner} />;
  } catch (error) {
    // During build time, database may not be available
    // Silently fail and don't show banner
    if (process.env.NODE_ENV === 'production' && !process.env.POSTGRES_URL && !process.env.PRISMA_DATABASE_URL) {
      return null;
    }
    // In development or if database is configured, log the error
    console.error('Error loading banner:', error);
    return null;
  }
}

