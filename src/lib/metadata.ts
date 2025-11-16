import type { Metadata } from "next";

/**
 * Site configuration constants
 * Update these with your actual site information
 */
const siteConfig = {
  name: "D&B General Contractors",
  description:
    "Professional general contractor specializing in high-end residential bathroom and kitchen remodels. Transform your home with expert craftsmanship and custom design.",
  url: process.env.NEXT_PUBLIC_SITE_URL || "https://dbcontractorsny.com/",
  ogImage: "/images/og-image.jpg", // Default Open Graph image
  twitterHandle: "@yourhandle", // Optional: Your Twitter handle
  locale: "en_US",
} as const;

/**
 * Default metadata for all pages
 * Provides consistent base metadata across the site
 */
export const defaultMetadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: siteConfig.name,
    template: `%s | ${siteConfig.name}`,
  },
  description: siteConfig.description,
  keywords: [
    "kitchen remodeling",
    "bathroom remodeling",
    "residential contractor",
    "home renovation",
    "custom design",
    "high-end remodeling",
    "general contractor",
    "sunroom construction",
  ],
  authors: [{ name: siteConfig.name }],
  creator: siteConfig.name,
  openGraph: {
    type: "website",
    locale: siteConfig.locale,
    url: siteConfig.url,
    siteName: siteConfig.name,
    title: siteConfig.name,
    description: siteConfig.description,
    images: [
      {
        url: siteConfig.ogImage,
        width: 1200,
        height: 630,
        alt: siteConfig.name,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: siteConfig.name,
    description: siteConfig.description,
    images: [siteConfig.ogImage],
    ...(siteConfig.twitterHandle && { creator: siteConfig.twitterHandle }),
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    // Add your verification codes here when available
    // google: "your-google-verification-code",
    // yandex: "your-yandex-verification-code",
    // yahoo: "your-yahoo-verification-code",
  },
};

/**
 * Generate page-specific metadata
 * Merges page-specific metadata with default metadata
 * 
 * @param options - Page-specific metadata options
 * @returns Complete metadata object
 */
export function generateMetadata(options: {
  title: string;
  description: string;
  path?: string;
  image?: string;
  keywords?: string[];
  noIndex?: boolean;
}): Metadata {
  const {
    title,
    description,
    path = "",
    image = siteConfig.ogImage,
    keywords = [],
    noIndex = false,
  } = options;

  const url = `${siteConfig.url}${path}`;
  const fullTitle = title.includes("|") ? title : `${title} | ${siteConfig.name}`;

  return {
    ...defaultMetadata,
    title: fullTitle,
    description,
    keywords: [...(defaultMetadata.keywords || []), ...keywords],
    openGraph: {
      ...defaultMetadata.openGraph,
      title: fullTitle,
      description,
      url,
      images: [
        {
          url: image.startsWith("http") ? image : `${siteConfig.url}${image}`,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
    },
    twitter: {
      ...defaultMetadata.twitter,
      title: fullTitle,
      description,
      images: [image.startsWith("http") ? image : `${siteConfig.url}${image}`],
    },
    robots: noIndex
      ? {
          index: false,
          follow: false,
        }
      : defaultMetadata.robots,
    alternates: {
      canonical: url,
    },
  };
}

/**
 * Generate metadata for the homepage
 * Title: 50-60 chars (optimized for search results)
 * Description: 150-160 chars (compelling and keyword-rich)
 */
export function getHomeMetadata(): Metadata {
  return generateMetadata({
    title: "Kitchen & Bathroom Remodeling | D&B Contractors",
    description:
      "Expert kitchen and bathroom remodeling contractor. Transform your home with custom design, premium materials, and exceptional craftsmanship. Free consultations.",
    path: "/",
    image: "/images/hero.jpg", // Use hero image for homepage OG
    keywords: [
      "kitchen remodeling",
      "bathroom remodeling",
      "residential contractor",
      "home renovation",
      "custom design",
      "high-end remodeling",
      "kitchen renovation",
      "bathroom renovation",
    ],
  });
}

/**
 * Generate metadata for the about page
 * Title: 50-60 chars (optimized for search results)
 * Description: 150-160 chars (compelling and keyword-rich)
 */
export function getAboutMetadata(): Metadata {
  return generateMetadata({
    title: "About D&B Contractors | Expert Remodeling Team",
    description:
      "Learn about our expert team, proven 4-step process, and commitment to excellence in high-end kitchen and bathroom remodeling. Award-winning craftsmanship.",
    path: "/about",
    image: "/images/about-og.jpg", // Page-specific OG image
    keywords: [
      "about",
      "team",
      "process",
      "experience",
      "contractor",
      "award-winning",
      "craftsmanship",
      "service areas",
    ],
  });
}

/**
 * Generate metadata for the gallery page
 * Title: 50-60 chars (optimized for search results)
 * Description: 150-160 chars (compelling and keyword-rich)
 */
export function getGalleryMetadata(): Metadata {
  return generateMetadata({
    title: "Project Gallery | Kitchen & Bathroom Remodels",
    description:
      "Browse our portfolio of completed kitchen and bathroom remodeling projects. See before and after photos showcasing high-end residential work and expert craftsmanship.",
    path: "/gallery",
    image: "/images/gallery-og.jpg", // Page-specific OG image
    keywords: [
      "gallery",
      "portfolio",
      "projects",
      "before and after",
      "remodeling examples",
      "kitchen gallery",
      "bathroom gallery",
      "completed projects",
    ],
  });
}

/**
 * Generate metadata for the schedule page
 * Title: 50-60 chars (optimized for search results)
 * Description: 150-160 chars (compelling and keyword-rich)
 */
export function getScheduleMetadata(): Metadata {
  return generateMetadata({
    title: "Schedule Free Consultation | D&B Contractors",
    description:
      "Schedule a free consultation for your kitchen or bathroom remodeling project. Book online or contact us directly. Expert guidance and custom design solutions.",
    path: "/schedule",
    image: "/images/schedule-og.jpg", // Page-specific OG image
    keywords: [
      "schedule",
      "consultation",
      "appointment",
      "contact",
      "free consultation",
      "book consultation",
      "remodeling consultation",
      "project estimate",
    ],
  });
}

