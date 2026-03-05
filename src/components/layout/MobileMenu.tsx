"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import { usePathname } from "next/navigation";
import { trackButtonClick } from "@/lib/analytics";

/**
 * MobileMenu component - Handles mobile navigation with slide-in animation
 * Client component required for state management and animations
 */
export function MobileMenu() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  // Close menu when route changes
  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  // Prevent body scroll when menu is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  const instagramUrl = process.env.NEXT_PUBLIC_INSTAGRAM_URL || "https://instagram.com";
  
  const navLinks = [
    { href: "/about", label: "About" },
    { href: "/schedule", label: "Schedule" },
  ];

  return (
    <>
      {/* Hamburger Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="md:hidden p-2 rounded-md hover:bg-muted transition-colors"
        aria-label="Toggle menu"
        aria-expanded={isOpen}
      >
        {isOpen ? (
          <X className="h-6 w-6" aria-hidden="true" />
        ) : (
          <Menu className="h-6 w-6" aria-hidden="true" />
        )}
      </button>

      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={() => setIsOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Slide-in Menu */}
      <div
        className={`
          fixed top-0 right-0 h-full w-80 max-w-[85vw] border-l z-50 shadow-lg
          bg-white dark:bg-gray-950
          transform transition-transform duration-300 ease-in-out
          md:hidden
          ${isOpen ? "translate-x-0" : "translate-x-full"}
        `}
        style={{ backgroundColor: '#ffffff' }}
      >
        <div className="flex flex-col h-full bg-white dark:bg-gray-950">
          {/* Menu Header */}
          <div className="flex items-center justify-between p-6 border-b bg-white dark:bg-gray-950">
            <span className="text-xl font-bold">Menu</span>
            <button
              onClick={() => setIsOpen(false)}
              className="p-2 rounded-md hover:bg-muted transition-colors"
              aria-label="Close menu"
            >
              <X className="h-6 w-6" />
            </button>
          </div>

          {/* Navigation Links */}
          <nav className="flex-1 p-6 bg-white dark:bg-gray-950" aria-label="Mobile navigation">
            <ul className="space-y-4" role="list">
              {navLinks.map((link) => {
                const isActive = pathname === link.href;
                return (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className={`
                        block px-4 py-3 rounded-md text-lg font-medium
                        transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2
                        ${
                          isActive
                            ? "bg-primary text-primary-foreground"
                            : "hover:bg-muted"
                        }
                      `}
                      onClick={() => {
                        trackButtonClick(link.label, "mobile-menu", link.href);
                        setIsOpen(false);
                      }}
                      aria-current={isActive ? "page" : undefined}
                    >
                      {link.label}
                    </Link>
                  </li>
                );
              })}
              {/* Instagram Link */}
              <li>
                <a
                  href={instagramUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block px-4 py-3 rounded-md text-lg font-medium hover:bg-muted transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                  onClick={() => {
                    trackButtonClick("Instagram", "mobile-menu", instagramUrl);
                    setIsOpen(false);
                  }}
                >
                  Instagram
                </a>
              </li>
            </ul>
          </nav>
        </div>
      </div>
    </>
  );
}

