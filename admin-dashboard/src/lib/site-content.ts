/**
 * Site content utilities (Admin Dashboard)
 * Functions to get and update structured site content
 * Uses the same database as the main website
 */

import { sql } from './db';

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

