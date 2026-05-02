"use client";
import Link from "next/link";
import { Instagram, Facebook, MapPin, Phone, Mail } from "lucide-react";
import { trackButtonClick, trackExternalLink } from "@/lib/analytics";



const STUDIO_LINKS = [
  { href: "/about",    label: "About" },
  { href: "/schedule", label: "Schedule a Visit" },
];

function FooterWordmark() {
  return (
    <span
      style={{
        fontFamily: "var(--font-display, 'Cormorant Garamond', serif)",
        fontSize: "22px",
        lineHeight: 1,
        color: "#1B1A17",
        display: "inline-flex",
        alignItems: "baseline",
        letterSpacing: "0.01em",
      }}
    >
      <span style={{ fontWeight: 400 }}>Raise</span>
      <span style={{ fontWeight: 300, fontStyle: "italic", padding: "0 5px" }}>Design</span>
      <span style={{ fontWeight: 400, fontStyle: "italic", color: "#A8804A", fontSize: "24px", padding: "0 3px" }}>&amp;</span>
      <span style={{ fontWeight: 400 }}>Build</span>
    </span>
  );
}

import type { BusinessInfo } from "@/lib/site-content";

export function Footer({ business }: { business?: BusinessInfo }) {
  const currentYear = new Date().getFullYear();
  const instagramUrl = business?.instagramUrl || process.env.NEXT_PUBLIC_INSTAGRAM_URL || "";
  const facebookUrl = business?.facebookUrl || "";
  const pinterestUrl = business?.pinterestUrl || "";
  const phone = business?.phone || process.env.NEXT_PUBLIC_BUSINESS_PHONE || "";
  const email = business?.email || process.env.NEXT_PUBLIC_BUSINESS_EMAIL || "";
  const city = business?.city || process.env.NEXT_PUBLIC_BUSINESS_CITY || "";
  const state = business?.state || process.env.NEXT_PUBLIC_BUSINESS_STATE || "NY";
  const businessName = business?.name || "Raise Design & Build";

  const linkStyle = {
    fontFamily: "var(--font-sans, 'Inter', sans-serif)",
    fontSize: "0.875rem",
    color: "#4A4842",
    textDecoration: "none",
    lineHeight: 1.8,
    transition: "color 0.18s ease",
  };

  return (
    <footer
      style={{
        background: "var(--bone, #FAF7F2)",
        borderTop: "1px solid var(--border-warm, #D9D1C2)",
      }}
    >
      {/* Main footer grid */}
      <div
        style={{
          maxWidth: "var(--container, 1280px)",
          margin: "0 auto",
          padding: "clamp(56px, 8vw, 96px) max(24px, 4vw) clamp(40px, 6vw, 64px)",
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
          gap: "clamp(40px, 5vw, 64px)",
        }}
      >
        {/* Col 1 — Studio */}
        <div>
          <p
            style={{
              fontFamily: "var(--font-sans, 'Inter', sans-serif)",
              fontSize: "0.6875rem",
              fontWeight: 500,
              letterSpacing: "0.18em",
              textTransform: "uppercase",
              color: "#76726A",
              marginBottom: "1.25rem",
            }}
          >
            Studio
          </p>
          <nav aria-label="Studio navigation">
            <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
              {STUDIO_LINKS.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    style={linkStyle}
                    onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.color = "#A8804A")}
                    onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.color = "#4A4842")}
                    onClick={() => trackButtonClick(link.label, "footer-studio", link.href)}
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>


        {/* Col 3 — Contact */}
        <div>
          <p
            style={{
              fontFamily: "var(--font-sans, 'Inter', sans-serif)",
              fontSize: "0.6875rem",
              fontWeight: 500,
              letterSpacing: "0.18em",
              textTransform: "uppercase",
              color: "#76726A",
              marginBottom: "1.25rem",
            }}
          >
            Contact
          </p>
          <div style={{ display: "flex", flexDirection: "column", gap: "0.625rem" }}>
            {city && (
              <div style={{ display: "flex", alignItems: "flex-start", gap: "8px" }}>
                <MapPin size={14} strokeWidth={1.25} style={{ color: "#A39E94", marginTop: "3px", flexShrink: 0 }} />
                <span style={{ ...linkStyle, lineHeight: 1.5 }}>{city}, {state}</span>
              </div>
            )}
            {phone && (
              <a
                href={`tel:${phone}`}
                style={{ display: "flex", alignItems: "center", gap: "8px", ...linkStyle }}
                onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.color = "#A8804A")}
                onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.color = "#4A4842")}
              >
                <Phone size={14} strokeWidth={1.25} style={{ color: "#A39E94", flexShrink: 0 }} />
                {phone}
              </a>
            )}
            {email && (
              <a
                href={`mailto:${email}`}
                style={{ display: "flex", alignItems: "center", gap: "8px", ...linkStyle }}
                onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.color = "#A8804A")}
                onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.color = "#4A4842")}
              >
                <Mail size={14} strokeWidth={1.25} style={{ color: "#A39E94", flexShrink: 0 }} />
                {email}
              </a>
            )}
            {instagramUrl && (
              <a href={instagramUrl} target="_blank" rel="noopener noreferrer"
                style={{ display: "flex", alignItems: "center", gap: "8px", ...linkStyle }}
                onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.color = "#A8804A")}
                onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.color = "#4A4842")}
                onClick={() => trackExternalLink(instagramUrl, "Instagram", "footer-social")}
              >
                <Instagram size={14} strokeWidth={1.25} style={{ color: "#A39E94", flexShrink: 0 }} />
                Instagram
              </a>
            )}
            {facebookUrl && (
              <a href={facebookUrl} target="_blank" rel="noopener noreferrer"
                style={{ display: "flex", alignItems: "center", gap: "8px", ...linkStyle }}
                onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.color = "#A8804A")}
                onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.color = "#4A4842")}
                onClick={() => trackExternalLink(facebookUrl, "Facebook", "footer-social")}
              >
                <Facebook size={14} strokeWidth={1.25} style={{ color: "#A39E94", flexShrink: 0 }} />
                Facebook
              </a>
            )}
            {pinterestUrl && (
              <a href={pinterestUrl} target="_blank" rel="noopener noreferrer"
                style={{ display: "flex", alignItems: "center", gap: "8px", ...linkStyle }}
                onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.color = "#A8804A")}
                onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.color = "#4A4842")}
                onClick={() => trackExternalLink(pinterestUrl, "Pinterest", "footer-social")}
              >
                <span style={{ color: "#A39E94", fontSize: "14px", flexShrink: 0 }}>P</span>
                Pinterest
              </a>
            )}
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div
        style={{
          maxWidth: "var(--container, 1280px)",
          margin: "0 auto",
          padding: "1.5rem max(24px, 4vw)",
          borderTop: "1px solid var(--border-warm, #D9D1C2)",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: "1rem",
        }}
      >
        <FooterWordmark />
        <p
          style={{
            fontFamily: "var(--font-sans, 'Inter', sans-serif)",
            fontSize: "0.75rem",
            color: "#A39E94",
            margin: 0,
          }}
        >
          © {currentYear} {businessName}. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
