/**
 * StructuredData component - JSON-LD structured data for SEO
 * 
 * Implements LocalBusiness schema with:
 * - Business name, description
 * - Address, phone, email
 * - Opening hours
 * - Service areas
 * - AggregateRating (when testimonials available)
 * 
 * This helps search engines understand your business information
 * and can enable rich snippets in search results.
 */

interface StructuredDataProps {
  /**
   * Business name (default: from siteConfig)
   */
  businessName?: string;
  /**
   * Business description (default: from siteConfig)
   */
  description?: string;
  /**
   * Business address
   */
  address?: {
    streetAddress: string;
    addressLocality: string;
    addressRegion: string;
    postalCode: string;
    addressCountry: string;
  };
  /**
   * Business phone number
   */
  telephone?: string;
  /**
   * Business email
   */
  email?: string;
  /**
   * Business website URL (default: from siteConfig)
   */
  url?: string;
  /**
   * Opening hours in ISO 8601 format
   * Example: ["Mo-Fr 08:00-17:00", "Sa 09:00-13:00"]
   */
  openingHours?: string[];
  /**
   * Service areas (cities/regions served)
   */
  serviceAreas?: string[];
  /**
   * Aggregate rating (when testimonials/reviews are available)
   */
  aggregateRating?: {
    ratingValue: number;
    reviewCount: number;
    bestRating?: number;
    worstRating?: number;
  };
  /**
   * Business logo URL
   */
  logo?: string;
  /**
   * Business image URL
   */
  image?: string;
}

/**
 * StructuredData component for LocalBusiness schema
 * 
 * Usage:
 * ```tsx
 * <StructuredData
 *   address={{
 *     streetAddress: "123 Main St",
 *     addressLocality: "New York",
 *     addressRegion: "NY",
 *     postalCode: "10001",
 *     addressCountry: "US",
 *   }}
 *   telephone="+1-555-123-4567"
 *   email="info@dbcontractorsny.com"
 *   openingHours={["Mo-Fr 08:00-17:00", "Sa 09:00-13:00"]}
 *   serviceAreas={["New York", "Long Island", "Westchester County"]}
 * />
 * ```
 */
export function StructuredData({
  businessName = "D&B General Contractors",
  description = "Professional general contractor specializing in high-end residential bathroom and kitchen remodels. Transform your home with expert craftsmanship and custom design.",
  address,
  telephone,
  email,
  url = process.env.NEXT_PUBLIC_SITE_URL || "https://dbcontractorsny.com",
  openingHours,
  serviceAreas,
  aggregateRating,
  logo,
  image,
}: StructuredDataProps) {
  // Build the LocalBusiness schema
  const localBusinessSchema: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    name: businessName,
    description: description,
    url: url,
  };

  // Add address if provided
  if (address) {
    localBusinessSchema.address = {
      "@type": "PostalAddress",
      streetAddress: address.streetAddress,
      addressLocality: address.addressLocality,
      addressRegion: address.addressRegion,
      postalCode: address.postalCode,
      addressCountry: address.addressCountry,
    };
  }

  // Add contact information
  if (telephone) {
    localBusinessSchema.telephone = telephone;
  }

  if (email) {
    localBusinessSchema.email = email;
  }

  // Add opening hours if provided
  if (openingHours && openingHours.length > 0) {
    localBusinessSchema.openingHoursSpecification = openingHours.map((hours) => {
      // Parse hours string like "Mo-Fr 08:00-17:00" or "Sa 09:00-13:00"
      const [days, timeRange] = hours.split(" ");
      const [opens, closes] = timeRange.split("-");

      // Map day abbreviations to full day names
      const dayMap: Record<string, string> = {
        Mo: "Monday",
        Tu: "Tuesday",
        We: "Wednesday",
        Th: "Thursday",
        Fr: "Friday",
        Sa: "Saturday",
        Su: "Sunday",
      };

      // Handle day ranges (e.g., "Mo-Fr") or single days (e.g., "Sa")
      const dayRange = days.includes("-")
        ? days.split("-").map((d) => dayMap[d] || d)
        : [dayMap[days] || days];

      return {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: dayRange.length === 1 ? dayRange[0] : dayRange,
        opens: opens,
        closes: closes,
      };
    });
  }

  // Add service areas if provided
  if (serviceAreas && serviceAreas.length > 0) {
    localBusinessSchema.areaServed = serviceAreas.map((area) => ({
      "@type": "City",
      name: area,
    }));
  }

  // Add aggregate rating if provided
  if (aggregateRating) {
    localBusinessSchema.aggregateRating = {
      "@type": "AggregateRating",
      ratingValue: aggregateRating.ratingValue,
      reviewCount: aggregateRating.reviewCount,
      bestRating: aggregateRating.bestRating || 5,
      worstRating: aggregateRating.worstRating || 1,
    };
  }

  // Add logo if provided
  if (logo) {
    localBusinessSchema.logo = logo.startsWith("http")
      ? logo
      : `${url}${logo}`;
  }

  // Add image if provided
  if (image) {
    localBusinessSchema.image = image.startsWith("http") ? image : `${url}${image}`;
  }

  // Add service types (based on business focus)
  localBusinessSchema.serviceType = [
    "Kitchen Remodeling",
    "Bathroom Remodeling",
    "Sunroom Construction",
    "Custom Millwork",
    "Residential Remodeling",
    "General Contracting",
  ];

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(localBusinessSchema, null, 2),
      }}
    />
  );
}

