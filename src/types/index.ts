/**
 * Global type definitions for the contractor website
 */

/**
 * Video type for YouTube embeds
 */
export type Video = {
  type: 'youtube';
  videoId: string; // YouTube video ID (e.g., "dQw4w9WgXcQ")
  thumbnailUrl?: string; // Optional custom thumbnail
  alt: string; // Description for accessibility
  width: number; // Video aspect ratio width
  height: number; // Video aspect ratio height
};

/**
 * Project interface for gallery items
 * Based on the structure defined in .cursorrules
 */
export interface Project {
  id: string;
  title: string;
  category: 'kitchen' | 'bathroom' | 'sunroom' | 'millwork';
  description?: string;
  images: {
    url: string;
    alt: string;
    width: number;
    height: number;
    blurDataURL?: string; // Base64 blur placeholder for Next.js Image
  }[];
  videos?: Video[]; // Optional array of YouTube videos
  featured?: boolean;
}

/**
 * Contact form data structure
 */
export interface ContactFormData {
  name: string;
  email: string;
  phone: string;
  message: string;
  projectType: 'kitchen' | 'bathroom' | 'other';
}

/**
 * Schedule form data structure
 */
export interface ScheduleFormData {
  name: string;
  email: string;
  phone: string;
  preferredDate: string;
  preferredTime: string;
  projectType: 'kitchen' | 'bathroom' | 'other';
  message?: string;
}

