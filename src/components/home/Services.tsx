"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowDownRight } from "lucide-react";

// Services data comes from DB via ServicesDataLoader — no hardcoding here

function ServiceCard({ service, index }: { service: ServiceItem; index: number }) {
  const ease: [number, number, number, number] = [0.25, 0.46, 0.45, 0.94];

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.64, delay: index * 0.08, ease }}
      whileHover={{ y: -4 }}
      style={{ transition: "box-shadow 0.48s ease, transform 0.48s ease" }}
    >
      <Link
        href={service.href || '/schedule'}
        style={{ display: "block", textDecoration: "none" }}
        aria-label={`View ${service.title} work`}
      >
        {/* 4:5 portrait image */}
        <div
          style={{
            position: "relative",
            aspectRatio: "4/5",
            overflow: "hidden",
            borderRadius: "4px",
            background: "#E2D8C6",
            boxShadow: "0 2px 8px rgba(27,26,23,0.06), 0 1px 2px rgba(27,26,23,0.04)",
          }}
          className="service-card-image"
        >
          <Image
            src={service.imageUrl || '/images/placeholder.jpg'}
            alt={service.imageAlt || service.title}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 25vw"
          />
          <div
            style={{
              position: "absolute",
              inset: 0,
              background: "linear-gradient(to top, rgba(27,26,23,0.25) 0%, transparent 50%)",
            }}
          />
        </div>

        {/* Card text */}
        <div style={{ padding: "16px 2px 0" }}>
          <div className="flex items-start justify-between">
            <h3
              style={{
                fontFamily: "var(--font-display, 'Cormorant Garamond', serif)",
                fontSize: "2.25rem",
                fontWeight: 400,
                lineHeight: 1.2,
                letterSpacing: "-0.01em",
                color: "#1B1A17",
                margin: 0,
                transition: "color 0.32s ease",
              }}
              className="service-card-title"
            >
              {service.title}
            </h3>
            <ArrowDownRight
              size={20}
              strokeWidth={1.25}
              style={{ color: "#A39E94", flexShrink: 0, marginTop: "6px", transition: "color 0.32s ease" }}
              className="service-card-arrow"
            />
          </div>
          <p
            style={{
              fontFamily: "var(--font-sans, 'Inter', sans-serif)",
              fontSize: "0.875rem",
              lineHeight: 1.6,
              color: "#76726A",
              margin: "8px 0 0",
            }}
          >
            {service.description}
          </p>
        </div>
      </Link>

      <style>{`
        .service-card-image { }
        a:hover .service-card-title { color: #A8804A; }
        a:hover .service-card-arrow { color: #A8804A; }
        a:hover .service-card-image { box-shadow: 0 12px 32px rgba(27,26,23,0.08), 0 4px 8px rgba(27,26,23,0.04); }
      `}</style>
    </motion.div>
  );
}

import type { ServiceItem } from '@/lib/site-content';

export function Services({ services = [] }: { services?: ServiceItem[] }) {
  return (
    <section
      style={{
        background: "var(--paper, #F5F1EA)",
        padding: "clamp(64px, 10vw, 128px) max(24px, 4vw)",
      }}
    >
      <div style={{ maxWidth: "var(--container, 1280px)", margin: "0 auto" }}>
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.64, ease: [0.25, 0.46, 0.45, 0.94] }}
          style={{ marginBottom: "clamp(48px, 6vw, 80px)" }}
        >
          <div className="flex items-baseline" style={{ gap: "12px", marginBottom: "1.25rem" }}>
            <span
              style={{
                fontFamily: "var(--font-display, 'Cormorant Garamond', serif)",
                fontStyle: "italic",
                fontSize: "18px",
                color: "#A8804A",
              }}
            >
              ii
            </span>
            <span className="eyebrow">Services</span>
          </div>
          <h2
            style={{
              fontFamily: "var(--font-display, 'Cormorant Garamond', serif)",
              fontWeight: 400,
              fontSize: "clamp(2.25rem, 4vw, 3.25rem)",
              lineHeight: 1.05,
              letterSpacing: "-0.02em",
              color: "#1B1A17",
              maxWidth: "520px",
              margin: 0,
            }}
          >
            Where we spend<br />
            <em style={{ fontWeight: 300 }}>our time.</em>
          </h2>
        </motion.div>

        {/* 4-column grid */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))",
            gap: "clamp(24px, 3vw, 40px)",
          }}
        >
          {services.map((service, i) => (
            <ServiceCard key={service.title} service={service} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
