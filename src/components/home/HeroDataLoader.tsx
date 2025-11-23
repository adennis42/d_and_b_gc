/**
 * Server component that loads hero settings from database
 * Fetches hero image URL, alt text, and text content, passes to Hero component
 */

import { getHeroImageUrl, getHeroImageAlt } from '@/lib/site-settings';
import { getHeroContent } from '@/lib/site-content';
import { Hero } from './Hero';

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

  // Use database content or fallback to defaults
  const headline = heroContent?.headline || 'Transform Your Home with Expert Craftsmanship';
  const subheadline = heroContent?.subheadline || 
    'Specializing in high-end kitchen and bathroom remodeling that combines exceptional craftsmanship with timeless design. Every detail matters.';
  const primaryCTA = heroContent?.primaryCTA || { text: 'View Our Work', link: '/gallery' };
  const secondaryCTA = heroContent?.secondaryCTA || { text: 'Schedule Consultation', link: '/schedule' };

  return (
    <Hero 
      imageUrl={heroImageUrl} 
      imageAlt={heroImageAlt}
      headline={headline}
      subheadline={subheadline}
      primaryCTA={primaryCTA}
      secondaryCTA={secondaryCTA}
    />
  );
}

