import { getHeroImageUrl, getHeroImageAlt, getHeroContent } from '@/lib/site-content';
import { Hero } from './Hero';

export const dynamic = 'force-dynamic';

export async function HeroDataLoader() {
  const [heroImageUrl, heroImageAlt, heroContent] = await Promise.all([
    getHeroImageUrl(),
    getHeroImageAlt(),
    getHeroContent(),
  ]);

  return (
    <Hero
      imageUrl={heroImageUrl}
      imageAlt={heroImageAlt}
      headlineLine1={heroContent.headlineLine1}
      headlineLine2={heroContent.headlineLine2}
      headlineLine3={heroContent.headlineLine3}
      eyebrow={heroContent.eyebrow}
      creditLine={heroContent.creditLine}
      primaryCTA={heroContent.primaryCTA}
    />
  );
}
