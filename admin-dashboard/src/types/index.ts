/**
 * Shared types for admin dashboard
 * These match the types from the main app
 */

export type Video = {
  type: 'youtube';
  videoId: string;
  thumbnailUrl?: string;
  alt: string;
  width: number;
  height: number;
};

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
    blurDataURL?: string;
  }[];
  videos?: Video[];
  featured?: boolean;
}

