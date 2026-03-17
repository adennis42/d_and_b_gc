"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { trackCallToAction } from "@/lib/analytics";
import { ScrollReveal } from "@/components/animations/ScrollReveal";

export function CTA({
  heading = "Ready to Start Your Project?",
  bodyText = "Schedule a free consultation to discuss your remodeling vision",
  buttonText = "Schedule Your Consultation",
  buttonLink = "/schedule",
}: {
  heading?: string;
  bodyText?: string;
  buttonText?: string;
  buttonLink?: string;
}) {
  const shouldReduceMotion = useReducedMotion();

  return (
    <section className="py-20 md:py-32 bg-gradient-to-b from-background to-neutral-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <ScrollReveal direction="fade">
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-6 text-neutral-900">
              {heading}
            </h2>
          </ScrollReveal>

          <ScrollReveal direction="fade" delay={0.2}>
            <p className="text-xl md:text-2xl text-muted-foreground mb-12 font-light max-w-2xl mx-auto">
              {bodyText}
            </p>
          </ScrollReveal>

          <ScrollReveal direction="fade" delay={0.4}>
            <motion.div
              animate={shouldReduceMotion ? {} : { scale: [1, 1.02, 1] }}
              transition={shouldReduceMotion ? {} : { duration: 3, repeat: Infinity, ease: "easeInOut" }}
            >
              <Link
                href={buttonLink}
                className="inline-flex items-center justify-center rounded-lg bg-neutral-900 text-white px-10 py-6 text-lg md:text-xl font-medium hover:bg-neutral-800 transition-colors duration-300 shadow-lg hover:shadow-xl"
                aria-label={buttonText}
                onClick={() => trackCallToAction("cta-section", "schedule-consultation", buttonLink)}
              >
                {buttonText}
              </Link>
            </motion.div>
          </ScrollReveal>
        </div>
      </div>
    </section>
  );
}
