"use client";

import Link from "next/link";
import { Instagram } from "lucide-react";
import { trackButtonClick, trackExternalLink } from "@/lib/analytics";

/**
 * Footer component - Minimalist single-column footer
 * Features:
 * - Logo/company name
 * - Instagram link (primary social)
 * - Contact information
 * - Single column, centered layout
 * - Clean, minimal design
 */
export function Footer() {
  const currentYear = new Date().getFullYear();
  const companyName = process.env.NEXT_PUBLIC_BUSINESS_NAME || "Raise Design & Build";
  const instagramUrl = process.env.NEXT_PUBLIC_INSTAGRAM_URL || "https://instagram.com";

  const links = [
    { href: "/about", label: "About" },
    { href: "/schedule", label: "Schedule" },
  ];

  return (
    <footer className="border-t bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-20">
        <div className="max-w-2xl mx-auto text-center space-y-8">
          {/* Company Name */}
          <div>
            <h3 className="text-2xl font-bold tracking-tight text-neutral-900 mb-6">
              {companyName}
            </h3>
          </div>

          {/* Links */}
          <nav aria-label="Footer navigation">
            <ul className="flex flex-wrap justify-center gap-6" role="list">
              {links.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted-foreground hover:text-neutral-900 transition-colors focus:outline-none focus:ring-2 focus:ring-neutral-900 focus:ring-offset-2 focus:rounded-md"
                    onClick={() => trackButtonClick(link.label, "footer-nav", link.href)}
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* Instagram Link */}
          <div>
            <a
              href={instagramUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-neutral-900 transition-colors focus:outline-none focus:ring-2 focus:ring-neutral-900 focus:ring-offset-2 focus:rounded-md"
              aria-label="Visit our Instagram"
              onClick={() => trackExternalLink(instagramUrl, "Instagram", "footer-social")}
            >
              <Instagram className="h-5 w-5" />
              <span>Follow us on Instagram</span>
            </a>
          </div>

          {/* Contact Information */}
          <div className="space-y-2 text-sm text-muted-foreground">
            {/* Phone */}
            {process.env.NEXT_PUBLIC_BUSINESS_PHONE && (
              <p>
                <a
                  href={`tel:${process.env.NEXT_PUBLIC_BUSINESS_PHONE.replace(/[^0-9+]/g, "")}`}
                  className="hover:text-neutral-900 transition-colors focus:outline-none focus:ring-2 focus:ring-neutral-900 focus:ring-offset-2 focus:rounded-md"
                  aria-label={`Call us at ${process.env.NEXT_PUBLIC_BUSINESS_PHONE}`}
                >
                  {process.env.NEXT_PUBLIC_BUSINESS_PHONE}
                </a>
              </p>
            )}
            {/* Email */}
            {process.env.NEXT_PUBLIC_BUSINESS_EMAIL && (
              <p>
                <a
                  href={`mailto:${process.env.NEXT_PUBLIC_BUSINESS_EMAIL}`}
                  className="hover:text-neutral-900 transition-colors focus:outline-none focus:ring-2 focus:ring-neutral-900 focus:ring-offset-2 focus:rounded-md"
                  aria-label={`Email us at ${process.env.NEXT_PUBLIC_BUSINESS_EMAIL}`}
                >
                  {process.env.NEXT_PUBLIC_BUSINESS_EMAIL}
                </a>
              </p>
            )}
            {/* Address */}
            {(process.env.NEXT_PUBLIC_BUSINESS_CITY ||
              process.env.NEXT_PUBLIC_BUSINESS_STATE ||
              process.env.NEXT_PUBLIC_BUSINESS_ZIP) && (
              <p>
                {[
                  process.env.NEXT_PUBLIC_BUSINESS_CITY,
                  process.env.NEXT_PUBLIC_BUSINESS_STATE,
                  process.env.NEXT_PUBLIC_BUSINESS_ZIP,
                ]
                  .filter(Boolean)
                  .join(", ")}
              </p>
            )}
          </div>

          {/* Copyright */}
          <div className="pt-8 border-t">
            <p className="text-xs text-muted-foreground">
              &copy; {currentYear} {companyName}. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
