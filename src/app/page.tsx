import { HeroDataLoader } from "@/components/home/HeroDataLoader";
import { AboutPreviewDataLoader } from "@/components/home/AboutPreviewDataLoader";
import { InstagramFeed } from "@/components/home/InstagramFeed";
import { CtaDataLoader } from "@/components/home/CtaDataLoader";
import { getHomeMetadata } from "@/lib/metadata";

/**
 * Homepage metadata for SEO
 * Generated using centralized metadata utility
 */
export const metadata = getHomeMetadata();

/**
 * Cache revalidation settings
 * Force dynamic rendering to ensure fresh hero content on every request
 * Admin dashboard can trigger immediate revalidation via API route
 */
export const dynamic = 'force-dynamic';
export const revalidate = 0;

/**
 * Homepage component - Modern minimalist design with scroll animations
 */
export default function HomePage() {
  const instagramUrl = process.env.NEXT_PUBLIC_INSTAGRAM_URL || "https://instagram.com";

  return (
    <main>
      {/* Hero Section */}
      <HeroDataLoader />

      {/* About Preview — reads from DB */}
      <AboutPreviewDataLoader />

      {/* Instagram Feed */}
      <InstagramFeed instagramUrl={instagramUrl} />

      {/* Call-to-Action */}
      <CtaDataLoader />
    </main>
  );
}
