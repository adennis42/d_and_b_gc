/**
 * Promotional banners utilities (Admin Dashboard)
 * Uses the same database as the main website
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
    if (!id || id === 'undefined') {
      throw new Error('Banner ID is required');
    }
    
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
    console.error('Banner ID received:', id);
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
    // Filter out undefined values and build update query
    const setParts: string[] = [];
    const values: unknown[] = [];
    let paramIndex = 1;

    // Only include fields that are explicitly provided (not undefined)
    // Ensure we never push undefined values to the values array
    if (updates.title !== undefined && updates.title !== null) {
      setParts.push(`title = $${paramIndex}`);
      values.push(String(updates.title));
      paramIndex++;
    }
    if (updates.description !== undefined) {
      setParts.push(`description = $${paramIndex}`);
      values.push(updates.description ? String(updates.description) : null);
      paramIndex++;
    }
    if (updates.icon_name !== undefined) {
      setParts.push(`icon_name = $${paramIndex}`);
      values.push(updates.icon_name ? String(updates.icon_name) : null);
      paramIndex++;
    }
    if (updates.background_color !== undefined && updates.background_color !== null) {
      setParts.push(`background_color = $${paramIndex}`);
      values.push(String(updates.background_color));
      paramIndex++;
    }
    if (updates.text_color !== undefined && updates.text_color !== null) {
      setParts.push(`text_color = $${paramIndex}`);
      values.push(String(updates.text_color));
      paramIndex++;
    }
    if (updates.button_text !== undefined) {
      setParts.push(`button_text = $${paramIndex}`);
      values.push(updates.button_text ? String(updates.button_text) : null);
      paramIndex++;
    }
    if (updates.button_link !== undefined) {
      setParts.push(`button_link = $${paramIndex}`);
      values.push(updates.button_link ? String(updates.button_link) : null);
      paramIndex++;
    }
    if (updates.button_color !== undefined && updates.button_color !== null) {
      setParts.push(`button_color = $${paramIndex}`);
      values.push(String(updates.button_color));
      paramIndex++;
    }
    if (updates.start_date !== undefined && updates.start_date !== null) {
      setParts.push(`start_date = $${paramIndex}::date`);
      const dateStr = updates.start_date instanceof Date 
        ? updates.start_date.toISOString().split('T')[0]
        : String(updates.start_date).split('T')[0];
      values.push(dateStr);
      paramIndex++;
    }
    if (updates.end_date !== undefined && updates.end_date !== null) {
      setParts.push(`end_date = $${paramIndex}::date`);
      const dateStr = updates.end_date instanceof Date
        ? updates.end_date.toISOString().split('T')[0]
        : String(updates.end_date).split('T')[0];
      values.push(dateStr);
      paramIndex++;
    }
    if (updates.is_active !== undefined) {
      setParts.push(`is_active = $${paramIndex}`);
      values.push(Boolean(updates.is_active));
      paramIndex++;
    }
    if (updates.is_dismissible !== undefined) {
      setParts.push(`is_dismissible = $${paramIndex}`);
      values.push(Boolean(updates.is_dismissible));
      paramIndex++;
    }
    if (updates.show_countdown !== undefined) {
      setParts.push(`show_countdown = $${paramIndex}`);
      values.push(Boolean(updates.show_countdown));
      paramIndex++;
    }

    if (setParts.length === 0) {
      const banner = await getBannerById(id);
      if (!banner) {
        throw new Error('Banner not found');
      }
      return banner;
    }

    // Add updated_at
    setParts.push('updated_at = CURRENT_TIMESTAMP');
    
    // Verify no undefined values (postgres package doesn't allow undefined)
    const hasUndefined = values.some(v => v === undefined);
    if (hasUndefined) {
      console.error('Found undefined values in update:', values);
      throw new Error('Cannot update banner: undefined values detected');
    }
    
    // Add WHERE clause
    const query = `UPDATE promotional_banners SET ${setParts.join(', ')} WHERE id = $${paramIndex}::uuid RETURNING *`;
    values.push(id);

    console.log('Updating banner with query:', query);
    console.log('Values:', values);
    console.log('Values types:', values.map(v => typeof v));

    const result = await sql.unsafe(query, values);
    
    if (result.length === 0) {
      throw new Error('Banner not found');
    }
    
    return result[0] as PromotionalBanner;
  } catch (error) {
    console.error('Error updating banner:', error);
    console.error('Error details:', {
      message: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : undefined,
    });
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

