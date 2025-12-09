/**
 * Video utility functions for YouTube integration
 */

/**
 * Extract YouTube video ID from various YouTube URL formats
 * Supports:
 * - Regular videos: https://www.youtube.com/watch?v=VIDEO_ID
 * - Shorts: https://www.youtube.com/shorts/VIDEO_ID
 * - Short URLs: https://youtu.be/VIDEO_ID
 * - Embed URLs: https://www.youtube.com/embed/VIDEO_ID
 * - Direct video ID: VIDEO_ID
 */
export function extractYouTubeId(urlOrId: string): string {
  if (!urlOrId.includes('youtube') && !urlOrId.includes('youtu.be') && !urlOrId.includes('/')) {
    return urlOrId;
  }

  const patterns = [
    // Regular watch URLs: https://www.youtube.com/watch?v=VIDEO_ID
    /(?:youtube\.com\/watch\?v=)([^&\n?#]+)/,
    // Shorts URLs: https://www.youtube.com/shorts/VIDEO_ID
    /(?:youtube\.com\/shorts\/)([^&\n?#]+)/,
    // Short URLs: https://youtu.be/VIDEO_ID
    /(?:youtu\.be\/)([^&\n?#]+)/,
    // Embed URLs: https://www.youtube.com/embed/VIDEO_ID
    /(?:youtube\.com\/embed\/)([^&\n?#]+)/,
    // Direct video ID (11 characters)
    /^([a-zA-Z0-9_-]{11})$/,
  ];

  for (const pattern of patterns) {
    const match = urlOrId.match(pattern);
    if (match && match[1]) {
      return match[1];
    }
  }

  return urlOrId;
}

/**
 * Check if a string is a valid YouTube URL
 * Supports regular videos, Shorts, and direct video IDs
 */
export function isYouTubeUrl(url: string): boolean {
  return (
    /(?:youtube\.com\/(?:watch\?v=|shorts\/|embed\/)|youtu\.be\/)/.test(url) ||
    /^[a-zA-Z0-9_-]{11}$/.test(url)
  );
}

/**
 * Get YouTube thumbnail URL
 */
export function getYouTubeThumbnail(
  videoId: string,
  quality: 'default' | 'mq' | 'hq' | 'sd' | 'maxres' = 'hq'
): string {
  const qualityMap = {
    default: 'default',
    mq: 'mqdefault',
    hq: 'hqdefault',
    sd: 'sddefault',
    maxres: 'maxresdefault',
  };

  return `https://img.youtube.com/vi/${videoId}/${qualityMap[quality]}.jpg`;
}

