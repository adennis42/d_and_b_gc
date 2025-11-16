"use client";

/**
 * SkipToContent component - Accessibility feature for screen readers
 * 
 * Provides a "Skip to main content" link that appears when focused via keyboard.
 * This allows users navigating with keyboard or screen readers to skip repetitive
 * navigation and jump directly to the main content.
 * 
 * Features:
 * - Hidden by default, visible on focus
 * - Keyboard accessible (Tab key)
 * - Screen reader friendly
 * - Smooth scroll to main content
 * - WCAG 2.1 AA compliant
 * 
 * Usage:
 * Add <SkipToContent /> to your root layout.tsx, typically right after <body>
 */
export function SkipToContent() {
  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    const main = document.querySelector("main");
    if (main) {
      // Focus the main element for screen readers
      main.focus();
      main.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <a
      href="#main-content"
      onClick={handleClick}
      className="absolute left-[-9999px] w-1 h-1 overflow-hidden focus:left-4 focus:top-4 focus:z-50 focus:w-auto focus:h-auto focus:px-4 focus:py-2 focus:bg-primary focus:text-primary-foreground focus:rounded-md focus:shadow-lg focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 focus:overflow-visible"
      aria-label="Skip to main content"
    >
      Skip to main content
    </a>
  );
}

