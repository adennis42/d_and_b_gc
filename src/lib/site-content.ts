/**
 * Site content utilities (Main Website — read only)
 * Fetches structured content from the site_content table.
 * All writes go through the admin dashboard API.
 */

import { sql } from './db';

// ─── Types ────────────────────────────────────────────────────────────────────

export interface BusinessInfo {
  name: string;
  phone: string;
  email: string;
  instagramUrl: string;
  city: string;
  state: string;
  zip: string;
}

export interface ServiceItem {
  title: string;
  tagline: string;
  imageUrl: string | null;
  imageAlt: string;
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

export async function getHeroContent(): Promise<{
  headline?: string;
  subheadline?: string;
  primaryCTA?: { text: string; link: string };
} | null> {
  return getSiteContent('hero', 'content') as Promise<{
    headline?: string;
    subheadline?: string;
    primaryCTA?: { text: string; link: string };
  } | null>;
}

// ─── Business Info ────────────────────────────────────────────────────────────

const businessDefaults: BusinessInfo = {
  name: 'Raise Design & Build',
  phone: '',
  email: '',
  instagramUrl: '',
  city: '',
  state: '',
  zip: '',
};

export async function getBusinessInfo(): Promise<BusinessInfo> {
  const raw = (await getSiteContent('business', 'info')) as Partial<BusinessInfo> | null;
  return { ...businessDefaults, ...raw };
}

// ─── Services ─────────────────────────────────────────────────────────────────

const servicesDefaults: ServiceItem[] = [
  { title: 'Kitchen Remodeling', tagline: 'Beautiful, functional spaces', imageUrl: null, imageAlt: '' },
  { title: 'Bathroom Remodeling', tagline: 'Luxurious retreats', imageUrl: null, imageAlt: '' },
  { title: 'Millwork', tagline: 'Custom craftsmanship', imageUrl: null, imageAlt: '' },
  { title: 'Sunrooms', tagline: 'Bright, airy additions', imageUrl: null, imageAlt: '' },
];

export async function getServicesItems(): Promise<ServiceItem[]> {
  const raw = await getSiteContent('services', 'items');
  return Array.isArray(raw) ? (raw as ServiceItem[]) : servicesDefaults;
}

// ─── Instagram Posts ──────────────────────────────────────────────────────────

export async function getInstagramPosts(): Promise<InstagramPost[]> {
  const raw = await getSiteContent('instagram', 'posts');
  return Array.isArray(raw) ? (raw as InstagramPost[]) : [];
}

// ─── About Preview ────────────────────────────────────────────────────────────

const aboutDefaults: AboutPreview = {
  imageUrl: null,
  imageAlt: '',
  heading: 'Design-First Approach',
  bodyText: 'We transform high-end residential spaces with meticulous attention to detail and expert craftsmanship.',
};

export async function getAboutPreview(): Promise<AboutPreview> {
  const raw = (await getSiteContent('about', 'preview')) as Partial<AboutPreview> | null;
  return { ...aboutDefaults, ...raw };
}

// ─── CTA Content ──────────────────────────────────────────────────────────────

const ctaDefaults: CtaContent = {
  heading: 'Ready to Start Your Project?',
  bodyText: 'Schedule a free consultation to discuss your remodeling vision',
  buttonText: 'Schedule Your Consultation',
  buttonLink: '/schedule',
};

export async function getCtaContent(): Promise<CtaContent> {
  const raw = (await getSiteContent('cta', 'content')) as Partial<CtaContent> | null;
  return { ...ctaDefaults, ...raw };
}
