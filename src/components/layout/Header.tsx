"use client";

import Link from "next/link";
import { MobileMenu } from "./MobileMenu";
import { trackButtonClick } from "@/lib/analytics";

/**
 * Header component - Main site navigation
 * Server Component with client-side mobile menu integration
 * Features:
 * - Sticky header that stays at top on scroll
 * - Responsive navigation with desktop links and mobile hamburger menu
 * - Professional, clean design using Tailwind CSS
 */
export function Header() {
  const companyName = process.env.NEXT_PUBLIC_BUSINESS_NAME || "Raise Design & Build";
  
  const navLinks = [
    { href: "/", label: "Home" },
    { href: "/about", label: "About" },
    { href: "/gallery", label: "Gallery" },
    { href: "/schedule", label: "Schedule" },
  ];

  return (
    <header className="sticky top-0 z-30 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <nav className="container mx-auto px-4 sm:px-6 lg:px-8" aria-label="Main navigation">
        <div className="flex h-16 items-center justify-between">
          {/* Logo/Company Name */}
          <Link
            href="/"
            className="text-xl font-bold tracking-tight hover:opacity-80 transition-opacity focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 focus:rounded-md"
            aria-label={`${companyName} - Home`}
            onClick={() => trackButtonClick("Logo", "header", "/")}
          >
            {companyName}
          </Link>

          {/* Desktop Navigation */}
          <ul className="hidden md:flex items-center gap-1" role="list">
            {navLinks.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="px-4 py-2 rounded-md text-sm font-medium hover:bg-muted transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                  onClick={() => trackButtonClick(link.label, "header-nav", link.href)}
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>

          {/* Mobile Menu */}
          <MobileMenu />
        </div>
      </nav>
    </header>
  );
}

