"use client";

import Link from "next/link";
import { Instagram } from "lucide-react";
import { trackButtonClick, trackExternalLink } from "@/lib/analytics";

export function Footer({
  businessName = "Raise Design & Build",
  instagramUrl = "",
  phone = "",
  email = "",
  city = "",
  state = "",
  zip = "",
}: {
  businessName?: string;
  instagramUrl?: string;
  phone?: string;
  email?: string;
  city?: string;
  state?: string;
  zip?: string;
}) {
  const currentYear = new Date().getFullYear();

  const links = [
    { href: "/about", label: "About" },
    { href: "/schedule", label: "Schedule" },
  ];

  const locationLine = [city, state, zip].filter(Boolean).join(", ");

  return (
    <footer className="border-t bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-20">
        <div className="max-w-2xl mx-auto text-center space-y-8">
          {/* Company Name */}
          <h3 className="text-2xl font-bold tracking-tight text-neutral-900">
            {businessName}
          </h3>

          {/* Nav Links */}
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

          {/* Instagram */}
          {instagramUrl && (
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
          )}

          {/* Contact */}
          {(phone || email || locationLine) && (
            <div className="space-y-2 text-sm text-muted-foreground">
              {phone && (
                <p>
                  <a
                    href={`tel:${phone.replace(/[^0-9+]/g, "")}`}
                    className="hover:text-neutral-900 transition-colors"
                    aria-label={`Call us at ${phone}`}
                  >
                    {phone}
                  </a>
                </p>
              )}
              {email && (
                <p>
                  <a
                    href={`mailto:${email}`}
                    className="hover:text-neutral-900 transition-colors"
                    aria-label={`Email us at ${email}`}
                  >
                    {email}
                  </a>
                </p>
              )}
              {locationLine && <p>{locationLine}</p>}
            </div>
          )}

          {/* Copyright */}
          <div className="pt-8 border-t">
            <p className="text-xs text-muted-foreground">
              &copy; {currentYear} {businessName}. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
