/**
 * Server component that loads the active promotional banner
 * Fetches banner from database and passes to client component
 * 
 * Note: This component is dynamically rendered (no caching) to ensure
 * expired banners are not shown
 */

import { getActiveBanner } from '@/lib/banners';
import { PromotionalBanner } from './PromotionalBanner';

// Force dynamic rendering to prevent caching
export const dynamic = 'force-dynamic';
export const revalidate = 0;

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

    // Additional client-side check: verify banner hasn't expired
    const endDate = new Date(banner.end_date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    if (endDate < today) {
      console.log('Banner expired, not displaying:', {
        id: banner.id,
        end_date: banner.end_date,
        today: today.toISOString(),
      });
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

