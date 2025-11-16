import { MetadataRoute } from "next";

/**
 * Site configuration - matches metadata.ts
 */
const siteConfig = {
  url: process.env.NEXT_PUBLIC_SITE_URL || "https://dbcontractorsny.com",
} as const;

/**
 * Generate robots.txt for SEO crawler instructions
 * 
 * Allows all crawlers and links to sitemap
 * Next.js automatically serves this at /robots.txt
 */
export default function robots(): MetadataRoute.Robots {
  const baseUrl = siteConfig.url;

  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: [
          "/api/", // Disallow API routes
          "/_next/", // Disallow Next.js internal files
          "/admin/", // Disallow admin pages if they exist
        ],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}

