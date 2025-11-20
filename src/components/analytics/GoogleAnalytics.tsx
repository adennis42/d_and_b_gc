"use client";

import { GoogleAnalytics as NextGoogleAnalytics } from "@next/third-parties/google";

/**
 * Google Analytics component using @next/third-parties
 * 
 * Features:
 * - Loads analytics script only in production
 * - Uses NEXT_PUBLIC_GA_ID from environment variables
 * - Tracks page views automatically (handled by Next.js router)
 * - Optimized loading with @next/third-parties
 * 
 * Usage:
 * Add <GoogleAnalytics /> to your root layout.tsx
 * 
 * Environment Variable:
 * NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX (Google Analytics 4 Measurement ID)
 * 
 * Note: Page view tracking is handled automatically by GA4.
 * For custom event tracking, use functions from @/lib/analytics
 */
export function GoogleAnalytics() {
  const gaId = process.env.NEXT_PUBLIC_GA_ID;

  // Only load analytics in production
  const isProduction = process.env.NODE_ENV === "production";

  // Don't render anything if not in production or GA ID not set
  if (!isProduction || !gaId) {
    return null;
  }

  return <NextGoogleAnalytics gaId={gaId} />;
}

// Extend Window interface for TypeScript
declare global {
  interface Window {
    gtag: (
      command: string,
      targetId: string | Date,
      config?: Record<string, unknown>
    ) => void;
    dataLayer: unknown[];
  }
}

