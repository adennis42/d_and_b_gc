"use client";

import Link from "next/link";
import { trackCallToAction } from "@/lib/analytics";

/**
 * CTA component - Call-to-action section
 * Phase 2: Add compelling CTA with enhanced design, background image, and social proof
 * Features:
 * - Prominent call-to-action for scheduling consultations
 * - Secondary CTA for viewing gallery
 * - Placeholder for testimonials or trust indicators
 */
export function CTA() {
  return (
    <section className="py-16 md:py-24 bg-primary text-primary-foreground">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">
            Ready to Start Your Project?
          </h2>
          <p className="text-lg mb-8 opacity-90">
            Schedule a free consultation to discuss your remodeling vision and
            get a personalized quote for your project.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/schedule"
              className="inline-flex items-center justify-center rounded-md bg-background px-8 py-4 text-base font-medium text-foreground hover:bg-background/90 transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 focus:ring-offset-primary"
              aria-label="Schedule your free consultation"
              onClick={() => trackCallToAction("cta-section", "schedule-consultation", "/schedule")}
            >
              Schedule Your Consultation
            </Link>
            <Link
              href="/gallery"
              className="inline-flex items-center justify-center rounded-md border border-primary-foreground/20 bg-transparent px-8 py-4 text-base font-medium hover:bg-primary-foreground/10 transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 focus:ring-offset-primary"
              aria-label="Browse our portfolio gallery"
              onClick={() => trackCallToAction("cta-section", "browse-portfolio", "/gallery")}
            >
              Browse Our Portfolio
            </Link>
          </div>
          {/* Phase 2: Add trust indicators, testimonials, or contact information here */}
        </div>
      </div>
    </section>
  );
}

