"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import { usePathname } from "next/navigation";

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

  const navLinks = [
    { href: "/", label: "Home" },
    { href: "/about", label: "About" },
    { href: "/gallery", label: "Gallery" },
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
          fixed top-0 right-0 h-full w-80 max-w-[85vw] bg-background border-l z-50
          transform transition-transform duration-300 ease-in-out
          md:hidden
          ${isOpen ? "translate-x-0" : "translate-x-full"}
        `}
      >
        <div className="flex flex-col h-full">
          {/* Menu Header */}
          <div className="flex items-center justify-between p-6 border-b">
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
          <nav className="flex-1 p-6">
            <ul className="space-y-4">
              {navLinks.map((link) => {
                const isActive = pathname === link.href;
                return (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className={`
                        block px-4 py-3 rounded-md text-lg font-medium
                        transition-colors
                        ${
                          isActive
                            ? "bg-primary text-primary-foreground"
                            : "hover:bg-muted"
                        }
                      `}
                      onClick={() => setIsOpen(false)}
                    >
                      {link.label}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>
        </div>
      </div>
    </>
  );
}

