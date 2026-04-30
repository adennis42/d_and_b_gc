"use client";

import Image from "next/image";
import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { trackCallToAction } from "@/lib/analytics";

export function Hero({
  imageUrl = "/images/hero.jpg",
  imageAlt = "Raise Design & Build — high-end kitchen and bathroom remodeling on Long Island",
  headlineLine1 = "Craftsmanship",
  headlineLine2 = "at every",
  headlineLine3 = "detail.",
  primaryCTA = { text: "Schedule a Visit", link: "/schedule" },
}: {
  imageUrl?: string;
  imageAlt?: string;
  headlineLine1?: string;
  headlineLine2?: string;
  headlineLine3?: string;
  primaryCTA?: { text: string; link: string };
}) {
  const shouldReduceMotion = useReducedMotion();
  const ease: [number, number, number, number] = [0.25, 0.46, 0.45, 0.94];

  return (
    <section
      className="relative min-h-screen flex items-end overflow-hidden"
      aria-label="Hero section"
      style={{ background: "#1B1A17" }}
    >
      {/* Background image */}
      <div className="absolute inset-0 z-0">
        <Image
          src={imageUrl}
          alt={imageAlt}
          fill
          priority
          className="object-cover"
          sizes="100vw"
          quality={90}
        />
        {/* Warm brand-tinted overlay */}
        <div
          className="absolute inset-0"
          aria-hidden="true"
          style={{
            background:
              "linear-gradient(to top, rgba(27,26,23,0.82) 0%, rgba(27,26,23,0.38) 55%, rgba(27,26,23,0.12) 100%)",
          }}
        />
      </div>

      {/* Vertical credit line — architecture-monograph signature */}
      <div
        className="absolute right-6 bottom-32 z-10 hidden lg:block"
        style={{
          writingMode: "vertical-rl",
          transform: "rotate(180deg)",
          fontFamily: "var(--font-sans, 'Inter', sans-serif)",
          fontSize: "11px",
          fontWeight: 500,
          letterSpacing: "0.32em",
          textTransform: "uppercase",
          color: "rgba(250,247,242,0.45)",
        }}
        aria-hidden="true"
      >
        Long Island, New York — Est. 2003
      </div>

      {/* Content */}
      <div
        className="relative z-10 w-full"
        style={{
          maxWidth: "var(--container, 1280px)",
          margin: "0 auto",
          padding: "0 max(24px, 4vw) max(80px, 8vh)",
        }}
      >
        <div style={{ maxWidth: "820px" }}>
          {/* Eyebrow */}
          <motion.div
            initial={{ opacity: shouldReduceMotion ? 1 : 0, y: shouldReduceMotion ? 0 : 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.64, delay: 0.2, ease }}
            className="flex items-baseline"
            style={{ gap: "12px", marginBottom: "2rem" }}
          >
            <span
              style={{
                fontFamily: "var(--font-display, 'Cormorant Garamond', serif)",
                fontStyle: "italic",
                fontSize: "18px",
                color: "#A8804A",
              }}
            >
              i
            </span>
            <span
              style={{
                fontFamily: "var(--font-sans, 'Inter', sans-serif)",
                fontSize: "11px",
                fontWeight: 500,
                letterSpacing: "0.22em",
                textTransform: "uppercase",
                color: "rgba(250,247,242,0.6)",
              }}
            >
              Kitchens · Baths · Sunrooms · Millwork
            </span>
          </motion.div>

          {/* Headline */}
          <motion.h1
            initial={{ opacity: shouldReduceMotion ? 1 : 0, y: shouldReduceMotion ? 0 : 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.35, ease }}
            style={{
              fontFamily: "var(--font-display, 'Cormorant Garamond', serif)",
              fontWeight: 300,
              fontSize: "clamp(4rem, 9vw, 7.5rem)",
              lineHeight: 0.95,
              letterSpacing: "-0.025em",
              color: "#FAF7F2",
              margin: 0,
              marginBottom: "2.5rem",
              textWrap: "balance",
            }}
          >
            {headlineLine1}
            <br />
            <em style={{ fontWeight: 300 }}>{headlineLine2}</em>
            <br />
            {headlineLine3}
          </motion.h1>

          {/* CTA */}
          <motion.div
            initial={{ opacity: shouldReduceMotion ? 1 : 0, y: shouldReduceMotion ? 0 : 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.64, delay: 0.7, ease }}
          >
            <Link
              href={primaryCTA.link}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "8px",
                fontFamily: "var(--font-sans, 'Inter', sans-serif)",
                fontSize: "11px",
                fontWeight: 500,
                letterSpacing: "0.18em",
                textTransform: "uppercase",
                color: "#FAF7F2",
                background: "transparent",
                border: "1px solid rgba(250,247,242,0.45)",
                padding: "14px 28px",
                textDecoration: "none",
                borderRadius: "4px",
                transition: "all 0.32s ease",
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLElement).style.background = "#FAF7F2";
                (e.currentTarget as HTMLElement).style.color = "#1B1A17";
                (e.currentTarget as HTMLElement).style.borderColor = "#FAF7F2";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLElement).style.background = "transparent";
                (e.currentTarget as HTMLElement).style.color = "#FAF7F2";
                (e.currentTarget as HTMLElement).style.borderColor = "rgba(250,247,242,0.45)";
              }}
              onClick={() => trackCallToAction("hero", "primary-cta", primaryCTA.link)}
              aria-label={primaryCTA.text}
            >
              {primaryCTA.text}
              <ArrowRight size={14} strokeWidth={1.25} />
            </Link>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
