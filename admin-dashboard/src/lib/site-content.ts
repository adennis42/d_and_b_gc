/**
 * Site content utilities (Admin Dashboard)
 * Functions to get and update structured site content stored in the
 * site_content table (section + key → JSONB value)
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
  serviceAreas: string[];
  hours: string;
}

export interface ServiceItem {
  title: string;
  description: string;
  imageUrl: string | null;
  imageAlt: string;
  href: string;
}

export interface InstagramPost {
  imageUrl: string | null;
  caption: string;
  permalink: string;
}

export interface AboutPreview {
  imageUrl: string | null;
  imageAlt: string;
  heading: string;
  bodyText: string;
}

export interface CtaContent {
  heading: string;
  bodyText: string;
  buttonText: string;
  buttonLink: string;
}

// ─── Generic helpers ──────────────────────────────────────────────────────────

export async function getSiteContent(
  section: string,
  key: string
): Promise<Record<string, unknown> | null> {
  try {
    const result = await sql`
      SELECT value FROM site_content
      WHERE section = ${section} AND key = ${key}
      LIMIT 1
    `;
    if (result.length === 0) return null;
    const val = result[0].value;
    // If stored as a double-encoded string, parse it
    if (typeof val === 'string') {
      try { return JSON.parse(val) as Record<string, unknown>; } catch { return null; }
    }
    return val as Record<string, unknown>;
  } catch (error) {
    console.error(`Error getting site content ${section}.${key}:`, error);
    return null;
  }
}

export async function setSiteContent(
  section: string,
  key: string,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  value: any,
  description?: string
): Promise<void> {
  try {
    // Pass the raw value object — postgres handles JSONB serialization.
    // Do NOT use JSON.stringify()::jsonb as that double-encodes (stores a JSON string, not object).
    await sql`
      INSERT INTO site_content (section, key, value, description)
      VALUES (${section}, ${key}, ${sql.json(value)}, ${description || null})
      ON CONFLICT (section, key)
      DO UPDATE SET
        value = EXCLUDED.value,
        description = COALESCE(EXCLUDED.description, site_content.description),
        updated_at = CURRENT_TIMESTAMP
    `;
  } catch (error) {
    console.error(`Error setting site content ${section}.${key}:`, error);
    throw error;
  }
}

// ─── Hero ─────────────────────────────────────────────────────────────────────

export async function getHeroContent(): Promise<{
  headline?: string;
  subheadline?: string;
  primaryCTA?: { text: string; link: string };
} | null> {
  return (await getSiteContent('hero', 'content')) as {
    headline?: string;
    subheadline?: string;
    primaryCTA?: { text: string; link: string };
  } | null;
}

export async function setHeroContent(content: {
  headline?: string;
  subheadline?: string;
  primaryCTA?: { text: string; link: string };
}): Promise<void> {
  await setSiteContent('hero', 'content', content, 'Hero section text content');
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
  let raw = await getSiteContent('business', 'info');
  // Guard: if raw came back as a string (double-encoded JSON), parse it
  if (typeof raw === 'string') {
    try { raw = JSON.parse(raw); } catch { raw = null; }
  }
  return { ...businessDefaults, ...(raw as Partial<BusinessInfo> | null) };
}

export async function setBusinessInfo(info: BusinessInfo): Promise<void> {
  await setSiteContent('business', 'info', info, 'Business contact and identity information');
}

// ─── Services ─────────────────────────────────────────────────────────────────

const servicesDefaults: ServiceItem[] = [
  { title: 'Kitchens',   description: 'From custom cabinetry to stone countertops.', imageUrl: null, imageAlt: '', href: '/schedule' },
  { title: 'Bathrooms',  description: 'Quiet luxury. Thoughtful details.',            imageUrl: null, imageAlt: '', href: '/schedule' },
  { title: 'Sunrooms',   description: 'Light-filled additions.',                       imageUrl: null, imageAlt: '', href: '/schedule' },
  { title: 'Millwork',   description: 'Built-ins, mantels, wainscoting.',              imageUrl: null, imageAlt: '', href: '/schedule' },
];

export async function getServicesItems(): Promise<ServiceItem[]> {
  try {
    const result = await sql`
      SELECT value FROM site_content
      WHERE section = 'services' AND key = 'items'
      LIMIT 1
    `;
    if (result.length === 0) return servicesDefaults;
    const items = result[0].value as ServiceItem[];
    return Array.isArray(items) ? items : servicesDefaults;
  } catch {
    return servicesDefaults;
  }
}

export async function setServicesItems(items: ServiceItem[]): Promise<void> {
  await setSiteContent('services', 'items', items, 'Service cards on homepage');
}

// ─── Instagram Posts ──────────────────────────────────────────────────────────

const instagramDefaults: InstagramPost[] = Array.from({ length: 6 }, () => ({
  imageUrl: null,
  caption: '',
  permalink: '',
}));

export async function getInstagramPosts(): Promise<InstagramPost[]> {
  try {
    const result = await sql`
      SELECT value FROM site_content
      WHERE section = 'instagram' AND key = 'posts'
      LIMIT 1
    `;
    if (result.length === 0) return instagramDefaults;
    const posts = result[0].value as InstagramPost[];
    return Array.isArray(posts) ? posts : instagramDefaults;
  } catch {
    return instagramDefaults;
  }
}

export async function setInstagramPosts(posts: InstagramPost[]): Promise<void> {
  await setSiteContent('instagram', 'posts', posts, 'Curated Instagram grid photos');
}

// ─── About Preview ────────────────────────────────────────────────────────────

const aboutDefaults: AboutPreview = {
  imageUrl: null,
  imageAlt: '',
  heading: 'Design-First Approach',
  bodyText: 'We transform high-end residential spaces with meticulous attention to detail and expert craftsmanship.',
};

export async function getAboutPreview(): Promise<AboutPreview> {
  const raw = await getSiteContent('about', 'preview');
  return { ...aboutDefaults, ...(raw as Partial<AboutPreview> | null) };
}

export async function setAboutPreview(preview: AboutPreview): Promise<void> {
  await setSiteContent('about', 'preview', preview, 'About preview section on homepage');
}

// ─── CTA Content ──────────────────────────────────────────────────────────────

const ctaDefaults: CtaContent = {
  heading: 'Ready to Start Your Project?',
  bodyText: 'Schedule a free consultation to discuss your remodeling vision',
  buttonText: 'Schedule Your Consultation',
  buttonLink: '/schedule',
};

export async function getCtaContent(): Promise<CtaContent> {
  const raw = await getSiteContent('cta', 'content');
  return { ...ctaDefaults, ...(raw as Partial<CtaContent> | null) };
}

export async function setCtaContent(content: CtaContent): Promise<void> {
  await setSiteContent('cta', 'content', content, 'CTA section on homepage');
}
