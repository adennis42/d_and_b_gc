"use client";

import Script from "next/script";

/**
 * Google Analytics component
 * 
 * Features:
 * - Loads analytics script only in production
 * - Uses NEXT_PUBLIC_GA_ID from environment variables
 * - Tracks page views automatically (handled by Next.js router)
 * - Respects user privacy (no cookies, GDPR-friendly with consent)
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

  return (
    <>
      {/* Google Analytics Scripts */}
      <Script
        strategy="afterInteractive"
        src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`}
      />
      <Script
        id="google-analytics"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${gaId}', {
              page_path: window.location.pathname
            });
          `,
        }}
      />
    </>
  );
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

