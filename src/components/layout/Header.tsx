"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Menu, X, ArrowRight, Instagram } from "lucide-react";
import { trackButtonClick, trackExternalLink } from "@/lib/analytics";

const NAV_LINKS: { href: string; label: string }[] = [];

/** Raise Design & Build wordmark — CSS-only, no logo file */
function Wordmark({ inverted = false }: { inverted?: boolean }) {
  const base = inverted ? "#FAF7F2" : "#1B1A17";
  return (
    <span
      style={{
        fontFamily: "var(--font-display, 'Cormorant Garamond', serif)",
        fontSize: "26px",
        lineHeight: 1,
        color: base,
        display: "inline-flex",
        alignItems: "baseline",
        gap: 0,
        letterSpacing: "0.01em",
      }}
    >
      <span style={{ fontWeight: 400 }}>Raise</span>
      <span style={{ fontWeight: 300, fontStyle: "italic", padding: "0 6px", letterSpacing: "0.01em" }}>Design</span>
      <span style={{ fontWeight: 400, fontStyle: "italic", color: "#A8804A", fontSize: "28px", padding: "0 4px" }}>&amp;</span>
      <span style={{ fontWeight: 400 }}>Build</span>
    </span>
  );
}

export function Header() {
  const instagramUrl = process.env.NEXT_PUBLIC_INSTAGRAM_URL || "https://instagram.com";
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      <motion.header
        initial={{ opacity: 0, y: -16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.64, ease: [0.25, 0.46, 0.45, 0.94] }}
        className="fixed top-0 left-0 right-0 z-50 transition-all duration-300"
        style={{
          background: scrolled ? "rgba(245, 241, 234, 0.92)" : "transparent",
          backdropFilter: scrolled ? "blur(8px)" : "none",
          borderBottom: scrolled ? "1px solid #D9D1C2" : "1px solid transparent",
        }}
      >
        <nav
          className="flex items-center justify-between"
          style={{ maxWidth: "var(--container, 1280px)", margin: "0 auto", padding: "0 max(24px, 4vw)", height: "72px" }}
          aria-label="Main navigation"
        >
          {/* Wordmark */}
          <Link
            href="/"
            aria-label="Raise Design & Build — Home"
            onClick={() => trackButtonClick("Logo", "header", "/")}
            style={{ textDecoration: "none" }}
          >
            <Wordmark />
          </Link>

          {/* Desktop nav */}
          <ul
            className="hidden md:flex items-center"
            style={{ gap: "2rem", listStyle: "none" }}
            role="list"
          >
            {NAV_LINKS.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  style={{
                    fontFamily: "var(--font-sans, 'Inter', sans-serif)",
                    fontSize: "12px",
                    fontWeight: 500,
                    letterSpacing: "0.18em",
                    textTransform: "uppercase",
                    color: "#1B1A17",
                    textDecoration: "none",
                    opacity: 0.8,
                    transition: "opacity 0.18s ease",
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.opacity = "1")}
                  onMouseLeave={(e) => (e.currentTarget.style.opacity = "0.8")}
                  onClick={() => trackButtonClick(link.label, "header-nav", link.href)}
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>

          {/* Right: Instagram + CTA */}
          <div className="hidden md:flex items-center" style={{ gap: "1.25rem" }}>
            <a
              href={instagramUrl}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Visit our Instagram"
              style={{ color: "#1B1A17", opacity: 0.6, transition: "opacity 0.18s ease" }}
              onMouseEnter={(e) => (e.currentTarget.style.opacity = "1")}
              onMouseLeave={(e) => (e.currentTarget.style.opacity = "0.6")}
              onClick={() => trackExternalLink(instagramUrl, "Instagram", "header-social")}
            >
              <Instagram size={18} strokeWidth={1.25} />
            </a>

            <Link
              href="/schedule"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "6px",
                fontFamily: "var(--font-sans, 'Inter', sans-serif)",
                fontSize: "11px",
                fontWeight: 500,
                letterSpacing: "0.18em",
                textTransform: "uppercase",
                color: "#FAF7F2",
                background: "#1B1A17",
                border: "1px solid #1B1A17",
                padding: "10px 18px",
                textDecoration: "none",
                borderRadius: "4px",
                transition: "opacity 0.18s ease",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.opacity = "0.85")}
              onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}
              onClick={() => trackButtonClick("Schedule a Visit", "header-cta", "/schedule")}
            >
              Schedule a Visit
              <ArrowRight size={14} strokeWidth={1.25} />
            </Link>
          </div>

          {/* Mobile hamburger */}
          <button
            className="md:hidden"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            style={{ background: "none", border: "none", cursor: "pointer", color: "#1B1A17", padding: "8px" }}
          >
            {menuOpen ? <X size={22} strokeWidth={1.25} /> : <Menu size={22} strokeWidth={1.25} />}
          </button>
        </nav>
      </motion.header>

      {/* Mobile menu */}
      {menuOpen && (
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.22 }}
          className="fixed inset-0 z-40 flex flex-col pt-[72px]"
          style={{ background: "#FAF7F2" }}
        >
          <nav style={{ padding: "3rem max(24px, 4vw)" }}>
            <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: "2rem" }}>
              {[
                { href: "/about",    label: "About" },
                { href: "/schedule", label: "Schedule a Visit" },
              ].map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    onClick={() => setMenuOpen(false)}
                    style={{
                      fontFamily: "var(--font-display, 'Cormorant Garamond', serif)",
                      fontSize: "2.5rem",
                      fontWeight: 400,
                      color: "#1B1A17",
                      textDecoration: "none",
                      letterSpacing: "-0.01em",
                    }}
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
            <div style={{ marginTop: "3rem", paddingTop: "2rem", borderTop: "1px solid #D9D1C2" }}>
              <Link
                href="/schedule"
                onClick={() => setMenuOpen(false)}
                style={{
                  display: "inline-flex", alignItems: "center", gap: "8px",
                  fontFamily: "var(--font-sans, 'Inter', sans-serif)",
                  fontSize: "11px", fontWeight: 500, letterSpacing: "0.18em",
                  textTransform: "uppercase", color: "#FAF7F2",
                  background: "#1B1A17", border: "1px solid #1B1A17",
                  padding: "14px 28px", textDecoration: "none", borderRadius: "4px",
                }}
              >
                Schedule a Visit <ArrowRight size={14} strokeWidth={1.25} />
              </Link>
            </div>
          </nav>
        </motion.div>
      )}
    </>
  );
}
