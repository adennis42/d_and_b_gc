"use client";

import Image from "next/image";
import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { trackCallToAction } from "@/lib/analytics";
import { Parallax } from "@/components/animations/Parallax";

/**
 * Hero component - Modern minimalist full-screen hero with scroll animations
 * Features:
 * - Full-screen hero with large, bold typography (80-120px desktop)
 * - Single prominent CTA button
 * - Fade-in animations with staggered delays
 * - Parallax background effect
 * - Minimalist design focused on visual impact
 * - Mobile responsive with proper text sizing
 */
export function Hero({
  imageUrl = "/images/hero.jpg",
  imageAlt = "Beautiful kitchen and bathroom remodeling showcase",
  headline = "Transform Your Home with Expert Craftsmanship",
  subheadline = "Specializing in high-end kitchen and bathroom remodeling that combines exceptional craftsmanship with timeless design. Every detail matters.",
  primaryCTA = { text: "Schedule Consultation", link: "/schedule" },
}: {
  imageUrl?: string;
  imageAlt?: string;
  headline?: string;
  subheadline?: string;
  primaryCTA?: { text: string; link: string };
}) {
  const heroImageSrc = imageUrl;
  const shouldReduceMotion = useReducedMotion();

  return (
    <section
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
      aria-label="Hero section"
    >
      {/* Background Image with Parallax */}
      <div className="absolute inset-0 z-0">
        {/* Gradient fallback background */}
        <div
          className="absolute inset-0 bg-gradient-to-br from-neutral-900/30 via-neutral-800/20 to-background"
          aria-hidden="true"
        />
        {/* Parallax Background Image */}
        <Parallax speed={0.3}>
          <Image
            src={heroImageSrc}
            alt={imageAlt}
            fill
            priority
            className="object-cover"
            sizes="100vw"
            quality={90}
          />
        </Parallax>
        {/* Subtle overlay for text readability */}
        <div
          className="absolute inset-0 bg-black/30"
          aria-hidden="true"
        />
      </div>

      {/* Content with Animations */}
      <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-32">
        <div className="max-w-5xl mx-auto text-center">
          {/* Headline - Fade in with delay */}
          <motion.h1
            initial={{ opacity: shouldReduceMotion ? 1 : 0, y: shouldReduceMotion ? 0 : 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: shouldReduceMotion ? 0 : 0.8, delay: shouldReduceMotion ? 0 : 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl xl:text-[120px] font-bold tracking-tight text-white mb-8 md:mb-12 leading-[1.1] drop-shadow-2xl"
          >
            {headline}
          </motion.h1>

          {/* Subheadline - Slide up with delay */}
          <motion.p
            initial={{ opacity: shouldReduceMotion ? 1 : 0, y: shouldReduceMotion ? 0 : 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: shouldReduceMotion ? 0 : 0.8, delay: shouldReduceMotion ? 0 : 0.7, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="text-xl sm:text-2xl md:text-3xl lg:text-4xl text-white/90 mb-12 md:mb-16 max-w-4xl mx-auto leading-relaxed font-light drop-shadow-lg"
          >
            {subheadline}
          </motion.p>

          {/* Single CTA Button - Fade + scale with delay */}
          <motion.div
            initial={{ opacity: shouldReduceMotion ? 1 : 0, scale: shouldReduceMotion ? 1 : 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: shouldReduceMotion ? 0 : 0.6, delay: shouldReduceMotion ? 0 : 0.9, ease: [0.25, 0.46, 0.45, 0.94] }}
          >
            <Button
              asChild
              size="lg"
              className="text-lg sm:text-xl px-10 py-7 h-auto shadow-2xl bg-white text-neutral-900 hover:bg-white/95 hover:scale-105 transition-transform duration-300 font-medium"
            >
              <Link
                href={primaryCTA.link}
                aria-label={primaryCTA.text}
                onClick={() => trackCallToAction("hero", "primary-cta", primaryCTA.link)}
              >
                {primaryCTA.text}
              </Link>
            </Button>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
