"use client";

import Link from "next/link";
import { Facebook, Star } from "lucide-react";
import { trackButtonClick, trackExternalLink } from "@/lib/analytics";

/**
 * Footer component - Site footer with contact info, social links, and navigation
 * Features:
 * - Company contact information placeholders
 * - Social media icons using @radix-ui/react-icons
 * - Quick links to main pages
 * - Responsive grid layout (stacks on mobile, multi-column on desktop)
 * - Professional design matching Header aesthetic
 */
export function Footer() {
  const currentYear = new Date().getFullYear();
  const companyName = process.env.NEXT_PUBLIC_BUSINESS_NAME || "D&B General Contractors";

  const quickLinks = [
    { href: "/", label: "Home" },
    { href: "/about", label: "About" },
    { href: "/gallery", label: "Gallery" },
    { href: "/schedule", label: "Schedule" },
  ];

  const socialLinks = [
    {
      name: "Facebook",
      href: "#", // Update with actual Facebook page URL
      icon: Facebook,
      ariaLabel: "Visit our Facebook page",
    },
    {
      name: "Yelp",
      href: "https://www.yelp.com/biz/artisan-interior-millwork-bay-shore",
      icon: Star,
      ariaLabel: "Visit our Yelp page",
    },
  ];

  return (
    <footer className="border-t bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          {/* Company Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold tracking-tight">
              {companyName}
            </h3>
            <div className="space-y-2 text-sm text-muted-foreground">
              {/* Street Address */}
              {process.env.NEXT_PUBLIC_BUSINESS_STREET && (
                <p className="flex items-start">
                  <span className="sr-only">Address</span>
                  <span>{process.env.NEXT_PUBLIC_BUSINESS_STREET}</span>
                </p>
              )}
              {/* City, State, ZIP */}
              {(process.env.NEXT_PUBLIC_BUSINESS_CITY ||
                process.env.NEXT_PUBLIC_BUSINESS_STATE ||
                process.env.NEXT_PUBLIC_BUSINESS_ZIP) && (
                <p className="flex items-start">
                  <span className="sr-only">City and State</span>
                  <span>
                    {[
                      process.env.NEXT_PUBLIC_BUSINESS_CITY,
                      process.env.NEXT_PUBLIC_BUSINESS_STATE,
                      process.env.NEXT_PUBLIC_BUSINESS_ZIP,
                    ]
                      .filter(Boolean)
                      .join(", ")}
                  </span>
                </p>
              )}
              {/* Phone */}
              {process.env.NEXT_PUBLIC_BUSINESS_PHONE && (
                <p>
                  <a
                    href={`tel:${process.env.NEXT_PUBLIC_BUSINESS_PHONE.replace(/[^0-9+]/g, "")}`}
                    className="hover:text-foreground transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 focus:rounded-md"
                    aria-label={`Call us at ${process.env.NEXT_PUBLIC_BUSINESS_PHONE}`}
                  >
                    <span className="sr-only">Phone: </span>
                    {process.env.NEXT_PUBLIC_BUSINESS_PHONE}
                  </a>
                </p>
              )}
              {/* Email */}
              {process.env.NEXT_PUBLIC_BUSINESS_EMAIL && (
                <p>
                  <a
                    href={`mailto:${process.env.NEXT_PUBLIC_BUSINESS_EMAIL}`}
                    className="hover:text-foreground transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 focus:rounded-md"
                    aria-label={`Email us at ${process.env.NEXT_PUBLIC_BUSINESS_EMAIL}`}
                  >
                    <span className="sr-only">Email: </span>
                    {process.env.NEXT_PUBLIC_BUSINESS_EMAIL}
                  </a>
                </p>
              )}
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold tracking-tight">
              Quick Links
            </h3>
            <ul className="space-y-2" role="list">
              {quickLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 focus:rounded-md"
                    onClick={() => trackButtonClick(link.label, "footer-nav", link.href)}
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold tracking-tight">Services</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>Kitchen Remodeling</li>
              <li>Bathroom Remodeling</li>
              <li>Custom Design</li>
              <li>Consultation</li>
            </ul>
          </div>

          {/* Social Media */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold tracking-tight">Follow Us</h3>
            <div className="flex gap-4">
              {socialLinks.map((social) => {
                const Icon = social.icon;
                return (
                  <a
                    key={social.name}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-muted-foreground hover:text-foreground transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 focus:rounded-md"
                    aria-label={social.ariaLabel}
                    onClick={() => trackExternalLink(social.href, social.name, "footer-social")}
                  >
                    <Icon className="h-5 w-5" aria-hidden="true" />
                    <span className="sr-only">{social.name}</span>
                  </a>
                );
              })}
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-12 pt-8 border-t">
          <p className="text-center text-sm text-muted-foreground">
            &copy; {currentYear} {companyName}. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
