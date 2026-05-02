/**
 * Site content utilities (Main Website — read only)
 * Fetches structured content from the site_content table.
 * All writes go through the admin dashboard API.
 *
 * RULE: Nothing content-related should be hardcoded in components.
 *       All configurable text, images, and links come from here.
 */

import { sql } from './db';

// ─── Types ────────────────────────────────────────────────────────────────────

export interface BusinessInfo {
  name: string;
  phone: string;
  email: string;
  city: string;
  state: string;
  zip: string;
  instagramUrl: string;
  facebookUrl: string;
  serviceAreas: string[];   // e.g. ["East Islip", "Bay Shore", "Islip", ...]
  hours: string;
}

export interface HeroContent {
  headlineLine1: string;
  headlineLine2: string;
  headlineLine3: string;
  eyebrow: string;          // e.g. "Kitchens · Baths · Sunrooms · Millwork"
  creditLine: string;       // vertical credit text, e.g. "Long Island, New York — Est. 2003"
  primaryCTA: { text: string; link: string };
}

export interface ServiceItem {
  title: string;
  description: string;
  imageUrl: string | null;
  imageAlt: string;
  href: string;
}

export interface AboutContent {
  imageUrl: string | null;
  imageAlt: string;
  headline: string;
  bodyParagraphs: string[];  // array of paragraphs
  teamNames: string[];       // e.g. ["Paul Sr.", "Paul Jr.", "Jessica"]
  serviceAreas: string[];    // may differ from BusinessInfo.serviceAreas
}

export interface InstagramPost {
  imageUrl: string | null;
  caption: string;
  permalink: string;
}

export interface CtaContent {
  headlinePlain: string;     // text before the brass italic emphasis
  headlineEmphasis: string;  // brass italic portion, e.g. "your space."
  primaryCTA: { text: string; link: string };
  secondaryCTA?: { text: string; link: string };
}

// ─── Generic getter ───────────────────────────────────────────────────────────

async function getSiteContent(section: string, key: string): Promise<unknown | null> {
  try {
    const result = await sql`
      SELECT value FROM site_content
      WHERE section = ${section} AND key = ${key}
      LIMIT 1
    `;
    if (result.length === 0) return null;
    const value = result[0].value;
    // Guard against double-encoded JSON strings
    if (typeof value === 'string') {
      try { return JSON.parse(value); } catch { return null; }
    }
    return value;
  } catch (error) {
    console.error(`Error getting site content ${section}.${key}:`, error);
    return null;
  }
}

// ─── Hero ─────────────────────────────────────────────────────────────────────

const heroDefaults: HeroContent = {
  headlineLine1: 'Craftsmanship',
  headlineLine2: 'at every',
  headlineLine3: 'detail.',
  eyebrow: 'Kitchens · Baths · Sunrooms · Millwork',
  creditLine: 'Long Island, New York — Est. 2003',
  primaryCTA: { text: 'Schedule a Visit', link: '/schedule' },
};

export async function getHeroContent(): Promise<HeroContent> {
  const raw = (await getSiteContent('hero', 'content')) as Partial<HeroContent> | null;
  return { ...heroDefaults, ...raw };
}

// ─── Hero Image ───────────────────────────────────────────────────────────────

export async function getHeroImageUrl(): Promise<string> {
  try {
    // Hero image is stored in site_settings table by the admin dashboard
    const result = await sql`SELECT value FROM site_settings WHERE key = 'hero_image_url' LIMIT 1`;
    return result.length > 0 && result[0].value ? String(result[0].value) : '/images/hero.jpg';
  } catch {
    return '/images/hero.jpg';
  }
}

export async function getHeroImageAlt(): Promise<string> {
  try {
    const result = await sql`SELECT value FROM site_settings WHERE key = 'hero_image_alt' LIMIT 1`;
    return result.length > 0 && result[0].value
      ? String(result[0].value)
      : 'Raise Design & Build — high-end remodeling on Long Island';
  } catch {
    return 'Raise Design & Build — high-end remodeling on Long Island';
  }
}

// ─── Business Info ────────────────────────────────────────────────────────────

const businessDefaults: BusinessInfo = {
  name: 'Raise Design & Build',
  phone: '',
  email: '',
  city: '',
  state: '',
  zip: '',
  instagramUrl: '',
  facebookUrl: '',
  serviceAreas: [],
  hours: '',
};

export async function getBusinessInfo(): Promise<BusinessInfo> {
  const raw = (await getSiteContent('business', 'info')) as Partial<BusinessInfo> | null;
  return { ...businessDefaults, ...raw };
}

// ─── Services ─────────────────────────────────────────────────────────────────

const servicesDefaults: ServiceItem[] = [
  { title: 'Kitchens',   description: 'From custom cabinetry to stone countertops — spaces built around how you live.', imageUrl: null, imageAlt: 'Kitchen remodeling', href: '/schedule' },
  { title: 'Bathrooms',  description: 'Quiet luxury. Thoughtful details. Finishes that last decades.',                  imageUrl: null, imageAlt: 'Bathroom remodeling', href: '/schedule' },
  { title: 'Sunrooms',   description: 'Light-filled additions that blur the line between indoors and out.',             imageUrl: null, imageAlt: 'Sunroom addition', href: '/schedule' },
  { title: 'Millwork',   description: 'Built-ins, mantels, wainscoting. The kind of craftsmanship you notice in twenty years.', imageUrl: null, imageAlt: 'Custom millwork', href: '/schedule' },
];

export async function getServicesItems(): Promise<ServiceItem[]> {
  const raw = await getSiteContent('services', 'items');
  return Array.isArray(raw) ? (raw as ServiceItem[]) : servicesDefaults;
}

// ─── About ────────────────────────────────────────────────────────────────────

const aboutDefaults: AboutContent = {
  imageUrl: null,
  imageAlt: 'Raise Design & Build team',
  headline: 'Craft-forward remodeling on Long Island.',
  bodyParagraphs: [
    'Raise Design & Build is a family-owned remodeling company serving Long Island homeowners since 2003.',
    'We specialize in high-end kitchens, bathrooms, sunrooms, and custom millwork — built with honesty, precision, and care.',
  ],
  teamNames: ['Paul Sr.', 'Paul Jr.', 'Jessica'],
  serviceAreas: [],
};

export async function getAboutContent(): Promise<AboutContent> {
  const raw = (await getSiteContent('about', 'content')) as Partial<AboutContent> | null;
  return { ...aboutDefaults, ...raw };
}

// Legacy alias used by older admin routes
export async function getAboutPreview(): Promise<AboutContent> {
  return getAboutContent();
}

// ─── Instagram ────────────────────────────────────────────────────────────────

export async function getInstagramPosts(): Promise<InstagramPost[]> {
  const raw = await getSiteContent('instagram', 'posts');
  return Array.isArray(raw) ? (raw as InstagramPost[]) : [];
}

// ─── CTA ──────────────────────────────────────────────────────────────────────

const ctaDefaults: CtaContent = {
  headlinePlain: 'Bring craftsmanship to',
  headlineEmphasis: 'your space.',
  primaryCTA: { text: 'Schedule a Visit', link: '/schedule' },
  secondaryCTA: { text: 'View Our Work', link: '/work' },
};

export async function getCtaContent(): Promise<CtaContent> {
  const raw = (await getSiteContent('cta', 'content')) as Partial<CtaContent> | null;
  return { ...ctaDefaults, ...raw };
}
