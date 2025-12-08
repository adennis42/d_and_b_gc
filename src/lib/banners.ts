/**
 * Promotional banners utilities
 * Functions to get and manage promotional banners
 */

import { sql } from './db';

export interface PromotionalBanner {
  id: string;
  title: string;
  description: string | null;
  icon_name: string | null;
  background_color: string;
  text_color: string;
  button_text: string | null;
  button_link: string | null;
  button_color: string;
  start_date: Date;
  end_date: Date;
  is_active: boolean;
  is_dismissible: boolean;
  show_countdown: boolean;
  ttl_days: number | null; // Number of days after end_date to automatically delete the banner
  created_at: Date;
  updated_at: Date;
}

/**
 * Get the currently active banner (if any)
 * Returns the most recent active banner that is within its date range
 * Filters out expired banners (end_date < current date)
 * Uses date-only comparison to avoid timezone issues
 */
export async function getActiveBanner(): Promise<PromotionalBanner | null> {
  try {
    // Get current date in YYYY-MM-DD format for comparison
    const today = new Date().toISOString().split('T')[0];
    
    const result = await sql`
      SELECT * FROM promotional_banners
      WHERE is_active = true
        AND start_date::date <= ${today}::date
        AND end_date::date >= ${today}::date
      ORDER BY created_at DESC
      LIMIT 1
    `;
    
    if (result.length === 0) {
      return null;
    }
    
    const banner = result[0] as PromotionalBanner;
    
    // Double-check expiration on the application side as well
    const endDate = new Date(banner.end_date);
    const todayDate = new Date();
    todayDate.setHours(0, 0, 0, 0); // Reset to start of day
    
    // If banner has expired (end_date is before today), don't return it
    if (endDate < todayDate) {
      console.log('Banner expired:', {
        id: banner.id,
        end_date: banner.end_date,
        today: todayDate.toISOString(),
      });
      return null;
    }
    
    return banner;
  } catch (error) {
    console.error('Error getting active banner:', error);
    return null;
  }
}

/**
 * Get all banners (for admin dashboard)
 */
export async function getAllBanners(): Promise<PromotionalBanner[]> {
  try {
    return await sql`
      SELECT * FROM promotional_banners
      ORDER BY created_at DESC
    `;
  } catch (error) {
    console.error('Error getting all banners:', error);
    return [];
  }
}

/**
 * Get a banner by ID
 */
export async function getBannerById(id: string): Promise<PromotionalBanner | null> {
  try {
    const result = await sql`
      SELECT * FROM promotional_banners
      WHERE id = ${id}::uuid
      LIMIT 1
    `;
    
    if (result.length === 0) {
      return null;
    }
    
    return result[0] as PromotionalBanner;
  } catch (error) {
    console.error('Error getting banner by ID:', error);
    return null;
  }
}

/**
 * Create a new banner
 */
export async function createBanner(banner: Omit<PromotionalBanner, 'id' | 'created_at' | 'updated_at'>): Promise<PromotionalBanner> {
  try {
    const result = await sql`
      INSERT INTO promotional_banners (
        title, description, icon_name, background_color, text_color,
        button_text, button_link, button_color, start_date, end_date,
        is_active, is_dismissible, show_countdown, ttl_days
      )
      VALUES (
        ${banner.title},
        ${banner.description || null},
        ${banner.icon_name || null},
        ${banner.background_color},
        ${banner.text_color},
        ${banner.button_text || null},
        ${banner.button_link || null},
        ${banner.button_color},
        ${banner.start_date.toISOString().split('T')[0]}::date,
        ${banner.end_date.toISOString().split('T')[0]}::date,
        ${banner.is_active},
        ${banner.is_dismissible},
        ${banner.show_countdown ?? false},
        ${banner.ttl_days ?? null}
      )
      RETURNING *
    `;
    
    return result[0] as PromotionalBanner;
  } catch (error) {
    console.error('Error creating banner:', error);
    throw error;
  }
}

/**
 * Update a banner
 */
export async function updateBanner(
  id: string,
  updates: Partial<Omit<PromotionalBanner, 'id' | 'created_at' | 'updated_at'>>
): Promise<PromotionalBanner> {
  try {
    // Build dynamic UPDATE query
    const setClauses: string[] = [];
    const values: (string | number | boolean | null)[] = [];
    let paramIndex = 1;
    
    // Only include fields that are explicitly provided (not undefined)
    if (updates.title !== undefined && updates.title !== null) {
      setClauses.push(`title = $${paramIndex}`);
      values.push(String(updates.title));
      paramIndex++;
    }
    if (updates.description !== undefined) {
      setClauses.push(`description = $${paramIndex}`);
      values.push(updates.description === null || updates.description === '' ? null : String(updates.description));
      paramIndex++;
    }
    if (updates.icon_name !== undefined) {
      setClauses.push(`icon_name = $${paramIndex}`);
      values.push(updates.icon_name === null || updates.icon_name === '' ? null : String(updates.icon_name));
      paramIndex++;
    }
    if (updates.background_color !== undefined && updates.background_color !== null) {
      setClauses.push(`background_color = $${paramIndex}`);
      values.push(String(updates.background_color));
      paramIndex++;
    }
    if (updates.text_color !== undefined && updates.text_color !== null) {
      setClauses.push(`text_color = $${paramIndex}`);
      values.push(String(updates.text_color));
      paramIndex++;
    }
    if (updates.button_text !== undefined) {
      setClauses.push(`button_text = $${paramIndex}`);
      values.push(updates.button_text === null || updates.button_text === '' ? null : String(updates.button_text));
      paramIndex++;
    }
    if (updates.button_link !== undefined) {
      setClauses.push(`button_link = $${paramIndex}`);
      values.push(updates.button_link === null || updates.button_link === '' ? null : String(updates.button_link));
      paramIndex++;
    }
    if (updates.button_color !== undefined && updates.button_color !== null) {
      setClauses.push(`button_color = $${paramIndex}`);
      values.push(String(updates.button_color));
      paramIndex++;
    }
    if (updates.start_date !== undefined && updates.start_date !== null) {
      setClauses.push(`start_date = $${paramIndex}::date`);
      const dateStr = updates.start_date instanceof Date 
        ? updates.start_date.toISOString().split('T')[0]
        : String(updates.start_date).split('T')[0];
      values.push(dateStr);
      paramIndex++;
    }
    if (updates.end_date !== undefined && updates.end_date !== null) {
      setClauses.push(`end_date = $${paramIndex}::date`);
      const dateStr = updates.end_date instanceof Date
        ? updates.end_date.toISOString().split('T')[0]
        : String(updates.end_date).split('T')[0];
      values.push(dateStr);
      paramIndex++;
    }
    if (updates.is_active !== undefined) {
      setClauses.push(`is_active = $${paramIndex}`);
      values.push(Boolean(updates.is_active));
      paramIndex++;
    }
    if (updates.is_dismissible !== undefined) {
      setClauses.push(`is_dismissible = $${paramIndex}`);
      values.push(Boolean(updates.is_dismissible));
      paramIndex++;
    }
    if (updates.show_countdown !== undefined) {
      setClauses.push(`show_countdown = $${paramIndex}`);
      values.push(Boolean(updates.show_countdown));
      paramIndex++;
    }
    if (updates.ttl_days !== undefined) {
      setClauses.push(`ttl_days = $${paramIndex}`);
      values.push(updates.ttl_days === null ? null : Number(updates.ttl_days));
      paramIndex++;
    }
    
    if (setClauses.length === 0) {
      // No updates, just return the banner
      const banner = await getBannerById(id);
      if (!banner) {
        throw new Error('Banner not found');
      }
      return banner;
    }
    
    // Add updated_at
    setClauses.push('updated_at = CURRENT_TIMESTAMP');
    
    // Add WHERE clause
    const query = `UPDATE promotional_banners SET ${setClauses.join(', ')} WHERE id = $${paramIndex}::uuid RETURNING *`;
    values.push(id);
    
    const result = await sql.unsafe(
      query,
      values as (string | number | boolean | null)[]
    );
    
    if (result.length === 0) {
      throw new Error('Banner not found');
    }
    
    return result[0] as unknown as PromotionalBanner;
  } catch (error) {
    console.error('Error updating banner:', error);
    throw error;
  }
}

/**
 * Delete a banner
 */
export async function deleteBanner(id: string): Promise<void> {
  try {
    await sql`
      DELETE FROM promotional_banners
      WHERE id = ${id}::uuid
    `;
  } catch (error) {
    console.error('Error deleting banner:', error);
    throw error;
  }
}

/**
 * Clean up expired banners that have passed their TTL
 * Should be called periodically (e.g., via Vercel Cron Job)
 * Deletes banners where end_date + ttl_days < current timestamp
 */
export async function cleanupExpiredBanners(): Promise<number> {
  try {
    const result = await sql`
      DELETE FROM promotional_banners
      WHERE ttl_days IS NOT NULL
        AND end_date + (ttl_days || ' days')::interval < CURRENT_TIMESTAMP
      RETURNING id
    `;
    
    const deletedCount = Array.isArray(result) ? result.length : 0;
    console.log(`Cleaned up ${deletedCount} expired banner(s)`);
    return deletedCount;
  } catch (error) {
    console.error('Error cleaning up expired banners:', error);
    throw error;
  }
}

