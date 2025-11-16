"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { trackPageView } from "@/lib/analytics";

/**
 * Analytics PageView Tracker
 * 
 * Tracks page views on route changes for better Next.js App Router integration
 * This component should be used within a Suspense boundary
 * 
 * Usage:
 * ```tsx
 * <Suspense fallback={null}>
 *   <AnalyticsPageView />
 * </Suspense>
 * ```
 */
export function AnalyticsPageView() {
  const pathname = usePathname();

  useEffect(() => {
    // Track page view on route change
    trackPageView(pathname);
  }, [pathname]);

  return null;
}

