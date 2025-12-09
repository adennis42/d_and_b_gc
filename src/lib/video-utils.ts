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
  // If it's already just an ID (no URL patterns), return as-is
  if (!urlOrId.includes('youtube') && !urlOrId.includes('youtu.be') && !urlOrId.includes('/')) {
    return urlOrId;
  }

  // Match various YouTube URL patterns
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

  // If no pattern matches, return the input (might be invalid, but let component handle it)
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
 * @param videoId - YouTube video ID
 * @param quality - Thumbnail quality: 'default' (120x90), 'mq' (320x180), 'hq' (480x360), 'sd' (640x480), 'maxres' (1280x720)
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

/**
 * Get YouTube embed URL with privacy-enhanced mode option
 * @param videoId - YouTube video ID
 * @param usePrivacyMode - Use youtube-nocookie.com domain (default: true for GDPR compliance)
 * @param autoplay - Autoplay video (default: false)
 * @param start - Start time in seconds (optional)
 */
export function getYouTubeEmbedUrl(
  videoId: string,
  options: {
    usePrivacyMode?: boolean;
    autoplay?: boolean;
    start?: number;
  } = {}
): string {
  const {
    usePrivacyMode = true,
    autoplay = false,
    start,
  } = options;

  const domain = usePrivacyMode ? 'www.youtube-nocookie.com' : 'www.youtube.com';
  const params = new URLSearchParams();

  if (autoplay) {
    params.append('autoplay', '1');
  }
  if (start) {
    params.append('start', start.toString());
  }
  // Enable modest branding and related video controls
  params.append('modestbranding', '1');
  params.append('rel', '0'); // Don't show related videos from other channels

  const queryString = params.toString();
  return `https://${domain}/embed/${videoId}${queryString ? `?${queryString}` : ''}`;
}

