import { MetadataRoute } from "next";
import { getAllProjects } from "@/lib/gallery-data";

/**
 * Site configuration - matches metadata.ts
 */
const siteConfig = {
  url: process.env.NEXT_PUBLIC_SITE_URL || "https://dbcontractorsny.com",
} as const;

/**
 * Generate dynamic sitemap for SEO
 * 
 * Includes:
 * - All static pages (home, about, gallery, schedule)
 * - Gallery projects (if individual project pages exist in the future)
 * 
 * Next.js automatically serves this at /sitemap.xml
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = siteConfig.url;

  // Static pages with their priorities and change frequencies
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1.0,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/gallery`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/schedule`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.7,
    },
  ];

  // Get all gallery projects for potential individual project pages
  // Currently, projects are shown in the gallery page, but we can add
  // individual project pages in the future (e.g., /gallery/[id])
  const projects = getAllProjects();
  
  // If you want to add individual project pages in the future, uncomment this:
  // const projectPages: MetadataRoute.Sitemap = projects.map((project) => ({
  //   url: `${baseUrl}/gallery/${project.id}`,
  //   lastModified: new Date(), // Update this with actual project modification date if available
  //   changeFrequency: "monthly" as const,
  //   priority: 0.6,
  // }));

  // Combine static pages with project pages (if enabled)
  return [
    ...staticPages,
    // ...projectPages, // Uncomment when individual project pages are implemented
  ];
}

