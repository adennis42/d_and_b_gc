import Link from "next/link";
import Image from "next/image";
import { HeroDataLoader } from "@/components/home/HeroDataLoader";
import { Services } from "@/components/home/Services";
import { InstagramFeed } from "@/components/home/InstagramFeed";
import { CTA } from "@/components/home/CTA";
import { getHomeMetadata } from "@/lib/metadata";
import { ScrollReveal } from "@/components/animations/ScrollReveal";

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

      {/* Services Section */}
      <Services />

      {/* Instagram Feed Section */}
      <InstagramFeed instagramUrl={instagramUrl} />

      {/* About Preview Section - Split Screen Layout */}
      <section className="py-20 md:py-32 bg-background overflow-hidden">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            {/* Image Side */}
            <ScrollReveal direction="right" className="order-2 lg:order-1">
              <div className="relative aspect-[4/3] rounded-lg overflow-hidden">
                {/* Placeholder - replace with actual image */}
                <div className="absolute inset-0 bg-gradient-to-br from-neutral-200 to-neutral-300 flex items-center justify-center">
                  <span className="text-neutral-400 text-sm">About Image</span>
                </div>
                {/* When image is available, uncomment:
                <Image
                  src="/images/about-preview.jpg"
                  alt="About our work"
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                />
                */}
              </div>
            </ScrollReveal>

            {/* Text Side */}
            <ScrollReveal direction="left" className="order-1 lg:order-2">
              <div className="space-y-6">
                <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-neutral-900">
                  Design-First Approach
                </h2>
                <p className="text-xl md:text-2xl text-muted-foreground leading-relaxed font-light">
                  We transform high-end residential spaces with meticulous attention to detail and expert craftsmanship.
                </p>
                <p className="text-lg text-muted-foreground leading-relaxed">
                  Every project begins with understanding your vision, then bringing it to life through thoughtful design and precision execution.
                </p>
                <Link
                  href="/about"
                  className="inline-block text-lg font-medium text-neutral-900 border-b-2 border-neutral-900 pb-1 hover:opacity-70 transition-opacity"
                >
                  Learn More About Us
                </Link>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* Call-to-Action Section */}
      <CTA />
    </main>
  );
}
