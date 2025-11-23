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
  created_at: Date;
  updated_at: Date;
}

/**
 * Get the currently active banner (if any)
 * Returns the most recent active banner (always visible unless dismissed)
 * Note: Date range checking is handled client-side for countdown display
 */
export async function getActiveBanner(): Promise<PromotionalBanner | null> {
  try {
    const result = await sql`
      SELECT * FROM promotional_banners
      WHERE is_active = true
      ORDER BY created_at DESC
      LIMIT 1
    `;
    
    if (result.length === 0) {
      return null;
    }
    
    return result[0] as PromotionalBanner;
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
        is_active, is_dismissible, show_countdown
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
        ${banner.show_countdown ?? false}
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
    const updatesObj: Record<string, unknown> = {};
    
    if (updates.title !== undefined) updatesObj.title = updates.title;
    if (updates.description !== undefined) updatesObj.description = updates.description;
    if (updates.icon_name !== undefined) updatesObj.icon_name = updates.icon_name;
    if (updates.background_color !== undefined) updatesObj.background_color = updates.background_color;
    if (updates.text_color !== undefined) updatesObj.text_color = updates.text_color;
    if (updates.button_text !== undefined) updatesObj.button_text = updates.button_text;
    if (updates.button_link !== undefined) updatesObj.button_link = updates.button_link;
    if (updates.button_color !== undefined) updatesObj.button_color = updates.button_color;
    if (updates.start_date !== undefined) updatesObj.start_date = updates.start_date.toISOString().split('T')[0];
    if (updates.end_date !== undefined) updatesObj.end_date = updates.end_date.toISOString().split('T')[0];
    if (updates.is_active !== undefined) updatesObj.is_active = updates.is_active;
    if (updates.is_dismissible !== undefined) updatesObj.is_dismissible = updates.is_dismissible;
    if (updates.show_countdown !== undefined) updatesObj.show_countdown = updates.show_countdown;
    
    // Build dynamic UPDATE query
    const setClauses: string[] = [];
    const values: unknown[] = [];
    let paramIndex = 1;
    
    Object.entries(updatesObj).forEach(([key, value]) => {
      if (key === 'start_date' || key === 'end_date') {
        setClauses.push(`${key} = $${paramIndex}::date`);
      } else {
        setClauses.push(`${key} = $${paramIndex}`);
      }
      values.push(value);
      paramIndex++;
    });
    
    if (setClauses.length === 0) {
      // No updates, just return the banner
      return await getBannerById(id) as PromotionalBanner;
    }
    
    values.push(id);
    const result = await sql.unsafe(
      `UPDATE promotional_banners SET ${setClauses.join(', ')}, updated_at = CURRENT_TIMESTAMP WHERE id = $${paramIndex}::uuid RETURNING *`,
      values
    );
    
    return result[0] as PromotionalBanner;
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

