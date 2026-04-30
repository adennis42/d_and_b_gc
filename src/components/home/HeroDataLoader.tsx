/**
 * Server component that loads hero settings from database
 * Fetches hero image URL, alt text, and text content, passes to Hero component
 */

import { getHeroImageUrl, getHeroImageAlt } from '@/lib/site-settings';
import { getHeroContent } from '@/lib/site-content';
import { Hero } from './Hero';

/**
 * Force dynamic rendering to prevent caching
 * This ensures fresh hero content on every request
 */
export const dynamic = 'force-dynamic';

/**
 * Server component wrapper that fetches hero settings
 * This allows us to use async database queries while keeping
 * the Hero component as a client component for interactivity
 */
export async function HeroDataLoader() {
  // Fetch hero settings from database
  const [heroImageUrl, heroImageAlt, heroContent] = await Promise.all([
    getHeroImageUrl(),
    getHeroImageAlt(),
    getHeroContent(),
  ]);

  // Debug logging (remove in production)
  if (process.env.NODE_ENV === 'development') {
    console.log('[HeroDataLoader] Hero content from database:', JSON.stringify(heroContent, null, 2));
  }

  const primaryCTA = heroContent?.primaryCTA || { text: 'Schedule a Visit', link: '/schedule' };

  return (
    <Hero 
      imageUrl={heroImageUrl} 
      imageAlt={heroImageAlt}
      primaryCTA={primaryCTA}
    />
  );
}

