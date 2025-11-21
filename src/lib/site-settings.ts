/**
 * Site settings utilities
 * Functions to get and update site-wide configuration
 */

import { sql } from './db';

export interface SiteSetting {
  id: string;
  key: string;
  value: string | null;
  description: string | null;
  created_at: Date;
  updated_at: Date;
}

/**
 * Get a site setting by key
 */
export async function getSiteSetting(key: string): Promise<string | null> {
  try {
    const result = await sql`
      SELECT value FROM site_settings WHERE key = ${key} LIMIT 1
    `;
    
    if (result.length === 0) {
      return null;
    }
    
    return result[0].value;
  } catch (error) {
    console.error(`Error getting site setting ${key}:`, error);
    return null;
  }
}

/**
 * Set a site setting (creates if doesn't exist, updates if exists)
 */
export async function setSiteSetting(
  key: string,
  value: string,
  description?: string
): Promise<void> {
  try {
    await sql`
      INSERT INTO site_settings (key, value, description)
      VALUES (${key}, ${value}, ${description || null})
      ON CONFLICT (key) 
      DO UPDATE SET 
        value = EXCLUDED.value,
        description = COALESCE(EXCLUDED.description, site_settings.description),
        updated_at = CURRENT_TIMESTAMP
    `;
  } catch (error) {
    console.error(`Error setting site setting ${key}:`, error);
    throw error;
  }
}

/**
 * Get all site settings
 */
export async function getAllSiteSettings(): Promise<SiteSetting[]> {
  try {
    return await sql`
      SELECT * FROM site_settings ORDER BY key
    `;
  } catch (error) {
    console.error('Error getting all site settings:', error);
    return [];
  }
}

/**
 * Get hero image URL (with fallback)
 */
export async function getHeroImageUrl(): Promise<string> {
  const heroImage = await getSiteSetting('hero_image_url');
  return heroImage || '/images/hero.jpg'; // Fallback to default
}

/**
 * Get hero image alt text (with fallback)
 */
export async function getHeroImageAlt(): Promise<string> {
  const heroAlt = await getSiteSetting('hero_image_alt');
  return heroAlt || 'Beautiful kitchen and bathroom remodeling showcase';
}

