/**
 * Site content utilities
 * Functions to get and update structured site content (hero, services, CTA, etc.)
 */

import { sql } from './db';

export interface SiteContent {
  id: string;
  section: string;
  key: string;
  value: Record<string, unknown>;
  description: string | null;
  created_at: Date;
  updated_at: Date;
}

/**
 * Get content for a specific section and key
 */
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
    
    if (result.length === 0) {
      return null;
    }
    
    return result[0].value as Record<string, unknown>;
  } catch (error) {
    console.error(`Error getting site content ${section}.${key}:`, error);
    return null;
  }
}

/**
 * Set content for a specific section and key
 */
export async function setSiteContent(
  section: string,
  key: string,
  value: Record<string, unknown>,
  description?: string
): Promise<void> {
  try {
    await sql`
      INSERT INTO site_content (section, key, value, description)
      VALUES (${section}, ${key}, ${JSON.stringify(value)}::jsonb, ${description || null})
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

/**
 * Get all content for a specific section
 */
export async function getSectionContent(section: string): Promise<SiteContent[]> {
  try {
    return await sql`
      SELECT * FROM site_content 
      WHERE section = ${section}
      ORDER BY key
    `;
  } catch (error) {
    console.error(`Error getting section content ${section}:`, error);
    return [];
  }
}

/**
 * Get all site content
 */
export async function getAllSiteContent(): Promise<SiteContent[]> {
  try {
    return await sql`
      SELECT * FROM site_content 
      ORDER BY section, key
    `;
  } catch (error) {
    console.error('Error getting all site content:', error);
    return [];
  }
}

/**
 * Delete content for a specific section and key
 */
export async function deleteSiteContent(section: string, key: string): Promise<void> {
  try {
    await sql`
      DELETE FROM site_content 
      WHERE section = ${section} AND key = ${key}
    `;
  } catch (error) {
    console.error(`Error deleting site content ${section}.${key}:`, error);
    throw error;
  }
}

// Hero section helpers
export async function getHeroContent(): Promise<{
  headline?: string;
  subheadline?: string;
  primaryCTA?: { text: string; link: string };
  secondaryCTA?: { text: string; link: string };
} | null> {
  return (await getSiteContent('hero', 'content')) as {
    headline?: string;
    subheadline?: string;
    primaryCTA?: { text: string; link: string };
    secondaryCTA?: { text: string; link: string };
  } | null;
}

export async function setHeroContent(content: {
  headline?: string;
  subheadline?: string;
  primaryCTA?: { text: string; link: string };
  secondaryCTA?: { text: string; link: string };
}): Promise<void> {
  await setSiteContent('hero', 'content', content, 'Hero section text content');
}

// Services section helpers
export async function getServicesContent(): Promise<{
  title?: string;
  description?: string;
  services?: Array<{
    title: string;
    description: string;
    features: string[];
    icon?: string;
  }>;
} | null> {
  return (await getSiteContent('services', 'content')) as {
    title?: string;
    description?: string;
    services?: Array<{
      title: string;
      description: string;
      features: string[];
      icon?: string;
    }>;
  } | null;
}

export async function setServicesContent(content: {
  title?: string;
  description?: string;
  services?: Array<{
    title: string;
    description: string;
    features: string[];
    icon?: string;
  }>;
}): Promise<void> {
  await setSiteContent('services', 'content', content, 'Services section content');
}

// CTA section helpers
export async function getCTAContent(): Promise<{
  title?: string;
  description?: string;
  primaryCTA?: { text: string; link: string };
  secondaryCTA?: { text: string; link: string };
} | null> {
  return (await getSiteContent('cta', 'content')) as {
    title?: string;
    description?: string;
    primaryCTA?: { text: string; link: string };
    secondaryCTA?: { text: string; link: string };
  } | null;
}

export async function setCTAContent(content: {
  title?: string;
  description?: string;
  primaryCTA?: { text: string; link: string };
  secondaryCTA?: { text: string; link: string };
}): Promise<void> {
  await setSiteContent('cta', 'content', content, 'CTA section content');
}

// About section helpers (homepage)
export async function getAboutContent(): Promise<{
  title?: string;
  description?: string;
  ctaText?: string;
  ctaLink?: string;
} | null> {
  return (await getSiteContent('about', 'homepage')) as {
    title?: string;
    description?: string;
    ctaText?: string;
    ctaLink?: string;
  } | null;
}

export async function setAboutContent(content: {
  title?: string;
  description?: string;
  ctaText?: string;
  ctaLink?: string;
}): Promise<void> {
  await setSiteContent('about', 'homepage', content, 'About section on homepage');
}

