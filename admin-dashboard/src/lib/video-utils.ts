/**
 * Video utility functions for YouTube integration
 */

/**
 * Extract YouTube video ID from various YouTube URL formats
 */
export function extractYouTubeId(urlOrId: string): string {
  if (!urlOrId.includes('youtube') && !urlOrId.includes('youtu.be') && !urlOrId.includes('/')) {
    return urlOrId;
  }

  const patterns = [
    /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\n?#]+)/,
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
 */
export function isYouTubeUrl(url: string): boolean {
  return /(?:youtube\.com|youtu\.be)/.test(url) || /^[a-zA-Z0-9_-]{11}$/.test(url);
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

