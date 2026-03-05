"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { trackCallToAction } from "@/lib/analytics";
import { ScrollReveal } from "@/components/animations/ScrollReveal";

/**
 * CTA component - Simplified single CTA with subtle animations
 * Features:
 * - Single prominent CTA button
 * - Large, centered text
 * - Minimal background (white or subtle gradient)
 * - Fade-in text animation
 * - Subtle button pulse (breathing effect)
 * - Focus on conversion
 */
export function CTA() {
  const shouldReduceMotion = useReducedMotion();
  
  return (
    <section className="py-20 md:py-32 bg-gradient-to-b from-background to-neutral-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          {/* Heading */}
          <ScrollReveal direction="fade">
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-6 text-neutral-900">
              Ready to Start Your Project?
            </h2>
          </ScrollReveal>

          {/* Description */}
          <ScrollReveal direction="fade" delay={0.2}>
            <p className="text-xl md:text-2xl text-muted-foreground mb-12 font-light max-w-2xl mx-auto">
              Schedule a free consultation to discuss your remodeling vision
            </p>
          </ScrollReveal>

          {/* Single CTA Button */}
          <ScrollReveal direction="fade" delay={0.4}>
            <motion.div
              animate={shouldReduceMotion ? {} : {
                scale: [1, 1.02, 1],
              }}
              transition={shouldReduceMotion ? {} : {
                duration: 3,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            >
              <Link
                href="/schedule"
                className="inline-flex items-center justify-center rounded-lg bg-neutral-900 text-white px-10 py-6 text-lg md:text-xl font-medium hover:bg-neutral-800 transition-colors duration-300 shadow-lg hover:shadow-xl"
                aria-label="Schedule your free consultation"
                onClick={() => trackCallToAction("cta-section", "schedule-consultation", "/schedule")}
              >
                Schedule Your Consultation
              </Link>
            </motion.div>
          </ScrollReveal>
        </div>
      </div>
    </section>
  );
}

