import type { Metadata } from "next";
import Link from "next/link";
import { Hero } from "@/components/home/Hero";
import { Services } from "@/components/home/Services";
import { CTA } from "@/components/home/CTA";

/**
 * Homepage metadata for SEO
 * Phase 2: Update with actual contractor information and optimized descriptions
 */
export const metadata: Metadata = {
  title: "High-End Residential Remodeling | Kitchen & Bathroom Contractor",
  description:
    "Professional general contractor specializing in high-end residential bathroom and kitchen remodels. Transform your home with expert craftsmanship and custom design.",
  keywords: [
    "kitchen remodeling",
    "bathroom remodeling",
    "residential contractor",
    "home renovation",
    "custom design",
  ],
  openGraph: {
    title: "High-End Residential Remodeling | Kitchen & Bathroom Contractor",
    description:
      "Professional general contractor specializing in high-end residential bathroom and kitchen remodels.",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "High-End Residential Remodeling | Kitchen & Bathroom Contractor",
    description:
      "Professional general contractor specializing in high-end residential bathroom and kitchen remodels.",
  },
};

/**
 * Homepage component
 * Phase 2: Add compelling content, hero image/video, testimonials, and enhanced CTAs
 */
export default function HomePage() {
  return (
    <main>
      {/* Hero Section */}
      <Hero />

      {/* Services Overview Section */}
      <Services />

      {/* About Preview Section */}
      <section className="py-16 md:py-24 bg-muted/30">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">
              About Our Work
            </h2>
            <p className="text-lg text-muted-foreground mb-8">
              {/* Phase 2: Add compelling contractor background and expertise */}
              We specialize in transforming high-end residential spaces with
              meticulous attention to detail and expert craftsmanship. Our team
              brings years of experience in kitchen and bathroom remodeling,
              ensuring every project meets the highest standards of quality and
              design.
            </p>
            <Link
              href="/about"
              className="inline-flex items-center justify-center rounded-md bg-primary px-6 py-3 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors"
            >
              Learn More About Us
            </Link>
          </div>
        </div>
      </section>

      {/* Call-to-Action Section */}
      <CTA />
    </main>
  );
}
