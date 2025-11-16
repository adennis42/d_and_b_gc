/**
 * Analytics utility functions for tracking custom events
 * 
 * These functions provide a clean API for tracking user interactions
 * throughout the application. They work with Google Analytics 4 (GA4).
 * 
 * Usage:
 * ```tsx
 * import { trackFormSubmission, trackGalleryView, trackCallToAction } from '@/lib/analytics';
 * 
 * // Track form submission
 * trackFormSubmission('contact', 'schedule');
 * 
 * // Track gallery view
 * trackGalleryView('kitchen');
 * 
 * // Track CTA click
 * trackCallToAction('hero', 'view-gallery');
 * ```
 */

/**
 * Check if analytics is available and enabled
 */
function isAnalyticsEnabled(): boolean {
  return (
    typeof window !== "undefined" &&
    process.env.NODE_ENV === "production" &&
    process.env.NEXT_PUBLIC_GA_ID !== undefined &&
    typeof window.gtag === "function"
  );
}

/**
 * Track a custom event with Google Analytics
 * @param eventName - Name of the event
 * @param eventParams - Additional event parameters
 */
function trackEvent(
  eventName: string,
  eventParams?: Record<string, string | number | boolean>
): void {
  if (!isAnalyticsEnabled()) {
    // Log in development for debugging
    if (process.env.NODE_ENV === "development") {
      console.log("[Analytics]", eventName, eventParams);
    }
    return;
  }

  try {
    window.gtag("event", eventName, eventParams);
  } catch (error) {
    // Silently fail in production, log in development
    if (process.env.NODE_ENV === "development") {
      console.error("[Analytics Error]", error);
    }
  }
}

/**
 * Track form submission events
 * 
 * @param formType - Type of form (e.g., 'contact', 'schedule', 'newsletter')
 * @param formLocation - Where the form is located (e.g., 'schedule', 'footer', 'modal')
 * @param success - Whether the submission was successful (default: true)
 */
export function trackFormSubmission(
  formType: string,
  formLocation: string,
  success: boolean = true
): void {
  trackEvent("form_submission", {
    form_type: formType,
    form_location: formLocation,
    success: success,
  });
}

/**
 * Track gallery view/interaction events
 * 
 * @param category - Project category viewed (e.g., 'kitchen', 'bathroom', 'all')
 * @param projectId - Optional project ID if viewing a specific project
 * @param action - Action taken (e.g., 'view', 'filter', 'lightbox_open')
 */
export function trackGalleryView(
  category: string,
  projectId?: string,
  action: "view" | "filter" | "lightbox_open" = "view"
): void {
  const params: Record<string, string | number | boolean> = {
    category: category,
    action: action,
  };

  if (projectId) {
    params.project_id = projectId;
  }

  trackEvent("gallery_interaction", params);
}

/**
 * Track call-to-action (CTA) clicks
 * 
 * @param ctaLocation - Where the CTA is located (e.g., 'hero', 'services', 'gallery', 'footer')
 * @param ctaText - The text/label of the CTA (e.g., 'view-gallery', 'schedule-consultation')
 * @param destination - Where the CTA leads (e.g., '/gallery', '/schedule')
 */
export function trackCallToAction(
  ctaLocation: string,
  ctaText: string,
  destination?: string
): void {
  const params: Record<string, string | number | boolean> = {
    cta_location: ctaLocation,
    cta_text: ctaText,
  };

  if (destination) {
    params.destination = destination;
  }

  trackEvent("cta_click", params);
}

/**
 * Track page view manually (usually handled automatically, but useful for SPA navigation)
 * 
 * @param path - Page path
 * @param title - Page title (optional)
 */
export function trackPageView(path: string, title?: string): void {
  if (!isAnalyticsEnabled()) {
    return;
  }

  try {
    const gaId = process.env.NEXT_PUBLIC_GA_ID;
    if (gaId) {
      window.gtag("config", gaId, {
        page_path: path,
        page_title: title,
      });
    }
  } catch (error) {
    if (process.env.NODE_ENV === "development") {
      console.error("[Analytics Error]", error);
    }
  }
}

/**
 * Track button clicks (generic)
 * 
 * @param buttonText - Text on the button
 * @param buttonLocation - Where the button is located
 * @param destination - Where the button leads (optional)
 */
export function trackButtonClick(
  buttonText: string,
  buttonLocation: string,
  destination?: string
): void {
  trackEvent("button_click", {
    button_text: buttonText,
    button_location: buttonLocation,
    destination: destination || "",
  });
}

/**
 * Track external link clicks
 * 
 * @param url - External URL clicked
 * @param linkText - Text of the link
 * @param linkLocation - Where the link is located
 */
export function trackExternalLink(
  url: string,
  linkText: string,
  linkLocation: string
): void {
  trackEvent("external_link_click", {
    link_url: url,
    link_text: linkText,
    link_location: linkLocation,
  });
}

/**
 * Track search events (if search functionality is added)
 * 
 * @param searchTerm - Search query
 * @param resultsCount - Number of results (optional)
 */
export function trackSearch(searchTerm: string, resultsCount?: number): void {
  const params: Record<string, string | number | boolean> = {
    search_term: searchTerm,
  };

  if (resultsCount !== undefined) {
    params.results_count = resultsCount;
  }

  trackEvent("search", params);
}

