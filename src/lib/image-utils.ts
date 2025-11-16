/**
 * Image utility functions for Next.js Image optimization
 * 
 * Using static base64-encoded SVG data URLs to avoid runtime generation issues
 * and prevent memory allocation problems in Next.js/Turbopack
 */

/**
 * Default blur placeholder - neutral gray
 * Base64-encoded 1x1 SVG: <svg width="1" height="1" xmlns="http://www.w3.org/2000/svg"><rect width="1" height="1" fill="rgb(200,200,200)"/></svg>
 */
export const DEFAULT_BLUR_DATA_URL = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMSIgaGVpZ2h0PSIxIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjxyZWN0IHdpZHRoPSIxIiBoZWlnaHQ9IjEiIGZpbGw9InJnYigyMDAsMjAwLDIwMCkiLz48L3N2Zz4=';

/**
 * Kitchen-themed blur placeholder - warm tones
 * Base64-encoded 1x1 SVG: <svg width="1" height="1" xmlns="http://www.w3.org/2000/svg"><rect width="1" height="1" fill="rgb(220,210,200)"/></svg>
 */
export const KITCHEN_BLUR_DATA_URL = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMSIgaGVpZ2h0PSIxIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjxyZWN0IHdpZHRoPSIxIiBoZWlnaHQ9IjEiIGZpbGw9InJnYigyMjAsMjEwLDIwMCkiLz48L3N2Zz4=';

/**
 * Bathroom-themed blur placeholder - cool tones
 * Base64-encoded 1x1 SVG: <svg width="1" height="1" xmlns="http://www.w3.org/2000/svg"><rect width="1" height="1" fill="rgb(200,210,220)"/></svg>
 */
export const BATHROOM_BLUR_DATA_URL = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMSIgaGVpZ2h0PSIxIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjxyZWN0IHdpZHRoPSIxIiBoZWlnaHQ9IjEiIGZpbGw9InJnYigyMDAsMjEwLDIyMCkiLz48L3N2Zz4=';

/**
 * Sunroom-themed blur placeholder - warm tones
 * Base64-encoded 1x1 SVG: <svg width="1" height="1" xmlns="http://www.w3.org/2000/svg"><rect width="1" height="1" fill="rgb(220,210,200)"/></svg>
 */
export const SUNROOM_BLUR_DATA_URL = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMSIgaGVpZ2h0PSIxIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjxyZWN0IHdpZHRoPSIxIiBoZWlnaHQ9IjEiIGZpbGw9InJnYigyMjAsMjEwLDIwMCkiLz48L3N2Zz4=';

/**
 * Millwork-themed blur placeholder - warm tones
 * Base64-encoded 1x1 SVG: <svg width="1" height="1" xmlns="http://www.w3.org/2000/svg"><rect width="1" height="1" fill="rgb(220,210,200)"/></svg>
 */
export const MILLWORK_BLUR_DATA_URL = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMSIgaGVpZ2h0PSIxIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjxyZWN0IHdpZHRoPSIxIiBoZWlnaHQ9IjEiIGZpbGw9InJnYigyMjAsMjEwLDIwMCkiLz48L3N2Zz4=';
