/**
 * Server component that loads hero image settings from database
 * Fetches hero image URL and alt text, passes to Hero component
 */

import { getHeroImageUrl, getHeroImageAlt } from '@/lib/site-settings';
import { Hero } from './Hero';

/**
 * Server component wrapper that fetches hero image settings
 * This allows us to use async database queries while keeping
 * the Hero component as a client component for interactivity
 */
export async function HeroDataLoader() {
  // Fetch hero image settings from database
  const [heroImageUrl, heroImageAlt] = await Promise.all([
    getHeroImageUrl(),
    getHeroImageAlt(),
  ]);

  return <Hero imageUrl={heroImageUrl} imageAlt={heroImageAlt} />;
}

