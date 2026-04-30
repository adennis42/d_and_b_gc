"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { trackCallToAction } from "@/lib/analytics";

export function CTA() {
  const ease: [number, number, number, number] = [0.25, 0.46, 0.45, 0.94];

  return (
    <section
      style={{
        background: "var(--paper-2, #EDE6DA)",
        padding: "clamp(80px, 12vw, 160px) max(24px, 4vw)",
        textAlign: "center",
      }}
    >
      <div style={{ maxWidth: "var(--container-narrow, 880px)", margin: "0 auto" }}>
        {/* Eyebrow */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.64, ease }}
          className="flex items-baseline justify-center"
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
            v
          </span>
          <span className="eyebrow">Start a conversation</span>
        </motion.div>

        {/* Headline */}
        <motion.h2
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.9, delay: 0.1, ease }}
          style={{
            fontFamily: "var(--font-display, 'Cormorant Garamond', serif)",
            fontWeight: 400,
            fontSize: "clamp(2.75rem, 6vw, 5rem)",
            lineHeight: 1.05,
            letterSpacing: "-0.02em",
            color: "#1B1A17",
            margin: "0 0 3rem",
            textWrap: "balance",
          }}
        >
          Bring craftsmanship to{" "}
          <em
            style={{
              fontWeight: 300,
              color: "#A8804A",
            }}
          >
            your space.
          </em>
        </motion.h2>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.64, delay: 0.25, ease }}
          style={{ display: "flex", gap: "1rem", justifyContent: "center", flexWrap: "wrap" }}
        >
          <Link
            href="/schedule"
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
              background: "#1B1A17",
              border: "1px solid #1B1A17",
              padding: "14px 28px",
              textDecoration: "none",
              borderRadius: "4px",
              transition: "opacity 0.18s ease",
            }}
            onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.opacity = "0.85")}
            onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.opacity = "1")}
            onClick={() => trackCallToAction("cta-section", "schedule", "/schedule")}
          >
            Schedule a Visit
            <ArrowRight size={14} strokeWidth={1.25} />
          </Link>

          <Link
            href="/work"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "8px",
              fontFamily: "var(--font-sans, 'Inter', sans-serif)",
              fontSize: "11px",
              fontWeight: 500,
              letterSpacing: "0.18em",
              textTransform: "uppercase",
              color: "#1B1A17",
              background: "transparent",
              border: "1px solid #1B1A17",
              padding: "14px 28px",
              textDecoration: "none",
              borderRadius: "4px",
              transition: "all 0.18s ease",
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLElement).style.background = "#1B1A17";
              (e.currentTarget as HTMLElement).style.color = "#FAF7F2";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLElement).style.background = "transparent";
              (e.currentTarget as HTMLElement).style.color = "#1B1A17";
            }}
            onClick={() => trackCallToAction("cta-section", "view-work", "/work")}
          >
            View Our Work
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
