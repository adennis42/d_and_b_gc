import Link from "next/link";

/**
 * Hero component - Homepage hero section
 * Phase 2: Add compelling headline, subheadline, CTA button, and background image/video
 * Features:
 * - Large, impactful headline
 * - Supporting subheadline
 * - Primary CTA button linking to schedule page
 * - Placeholder for hero image/video background
 */
export function Hero() {
  return (
    <section className="relative py-20 md:py-32 lg:py-40 bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto text-center">
          {/* Phase 2: Add hero background image/video here */}
          
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-6">
            Transform Your Home with Expert Remodeling
          </h1>
          <p className="text-xl md:text-2xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Specializing in high-end kitchen and bathroom renovations that
            combine exceptional craftsmanship with timeless design.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/schedule"
              className="inline-flex items-center justify-center rounded-md bg-primary px-8 py-4 text-base font-medium text-primary-foreground hover:bg-primary/90 transition-colors"
            >
              Schedule a Consultation
            </Link>
            <Link
              href="/gallery"
              className="inline-flex items-center justify-center rounded-md border border-border bg-background px-8 py-4 text-base font-medium hover:bg-muted transition-colors"
            >
              View Our Work
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

