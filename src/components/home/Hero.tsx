import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";

/**
 * Hero component - Full-height hero section with background image
 * Features:
 * - Full-height hero with optimized background image using next/image
 * - Compelling headline and subheadline
 * - Two CTAs using Shadcn Button components
 * - Subtle overlay for text readability
 * - Mobile responsive with proper text sizing
 * - Semantic HTML and ARIA labels for accessibility
 */
export function Hero() {
  // Phase 2: Replace with actual hero image path
  // Recommended: Use a high-quality kitchen or bathroom remodeling image
  // Image should be optimized (WebP format, ~1920x1080px for desktop)
  // For now, using a gradient background as fallback until image is added
  const heroImageSrc = "/images/hero.jpg"; // Update with your hero image path

  return (
    <section
      className="relative min-h-screen flex items-center justify-center"
      aria-label="Hero section"
    >
      {/* Background Image with Fallback Gradient */}
      <div className="absolute inset-0 z-0">
        {/* Gradient fallback background - shows if image is missing */}
        <div
          className="absolute inset-0 bg-gradient-to-br from-primary/20 via-primary/10 to-background"
          aria-hidden="true"
        />
        {/* Background Image - Add your hero image to /public/images/hero.jpg */}
        {/* For now, the gradient will show until you add the image */}
        <Image
          src={heroImageSrc}
          alt="Beautiful kitchen and bathroom remodeling showcase"
          fill
          priority
          className="object-cover"
          sizes="100vw"
          quality={90}
        />
        {/* Subtle overlay for text readability */}
        <div
          className="absolute inset-0 bg-black/40"
          aria-hidden="true"
        />
      </div>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-32">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight text-white mb-6 drop-shadow-lg">
            Transform Your Home with Expert Craftsmanship
          </h1>
          <p className="text-lg sm:text-xl md:text-2xl lg:text-3xl text-white/95 mb-10 max-w-3xl mx-auto drop-shadow-md leading-relaxed">
            Specializing in high-end kitchen and bathroom remodeling that
            combines exceptional craftsmanship with timeless design. Every
            detail matters.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button
              asChild
              size="lg"
              className="text-base sm:text-lg px-8 py-6 h-auto shadow-lg"
            >
              <Link href="/gallery" aria-label="View our portfolio gallery">
                View Our Work
              </Link>
            </Button>
            <Button
              asChild
              variant="outline"
              size="lg"
              className="text-base sm:text-lg px-8 py-6 h-auto bg-white/10 backdrop-blur-sm border-white/30 text-white hover:bg-white/20 shadow-lg"
            >
              <Link href="/schedule" aria-label="Schedule a free consultation">
                Schedule Consultation
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
