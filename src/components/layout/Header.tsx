"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Instagram } from "lucide-react";
import { MobileMenu } from "./MobileMenu";
import { trackButtonClick, trackExternalLink } from "@/lib/analytics";

export function Header({
  businessName = "Raise Design & Build",
  instagramUrl = "https://instagram.com",
}: {
  businessName?: string;
  instagramUrl?: string;
}) {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { href: "/about", label: "About" },
    { href: "/schedule", label: "Schedule" },
  ];

  return (
    <motion.header
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className={`sticky top-0 z-50 w-full transition-all duration-300 ${
        scrolled
          ? "bg-background/95 backdrop-blur-md border-b border-neutral-200/50 shadow-sm"
          : "bg-transparent border-b border-transparent"
      }`}
    >
      <nav className="container mx-auto px-4 sm:px-6 lg:px-8" aria-label="Main navigation">
        <div className="flex h-16 md:h-20 items-center justify-between">
          {/* Logo / Company Name */}
          <Link
            href="/"
            className="text-lg md:text-xl font-bold tracking-tight text-neutral-900 hover:opacity-70 transition-opacity focus:outline-none focus:ring-2 focus:ring-neutral-900 focus:ring-offset-2 focus:rounded-md"
            aria-label={`${businessName} - Home`}
            onClick={() => trackButtonClick("Logo", "header", "/")}
          >
            {businessName}
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            <ul className="flex items-center gap-6" role="list">
              {navLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm font-medium text-neutral-700 hover:text-neutral-900 transition-colors focus:outline-none focus:ring-2 focus:ring-neutral-900 focus:ring-offset-2 focus:rounded-md"
                    onClick={() => trackButtonClick(link.label, "header-nav", link.href)}
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>

            {/* Instagram Icon */}
            {instagramUrl && (
              <a
                href={instagramUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-neutral-700 hover:text-neutral-900 transition-colors focus:outline-none focus:ring-2 focus:ring-neutral-900 focus:ring-offset-2 focus:rounded-md p-2"
                aria-label="Visit our Instagram"
                onClick={() => trackExternalLink(instagramUrl, "Instagram", "header-social")}
              >
                <Instagram className="h-5 w-5" />
              </a>
            )}
          </div>

          {/* Mobile Menu */}
          <MobileMenu instagramUrl={instagramUrl} />
        </div>
      </nav>
    </motion.header>
  );
}
