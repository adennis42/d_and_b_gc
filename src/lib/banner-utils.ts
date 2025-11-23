/**
 * Utility functions for promotional banners
 */

/**
 * Calculate the number of days remaining until the end date
 * Returns the countdown text to display
 * @param endDate - The end date of the banner
 * @returns Countdown text (e.g., "5 days remaining" or "Last Day!")
 */
export function getCountdownText(endDate: Date): string {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  const end = new Date(endDate);
  end.setHours(0, 0, 0, 0);
  
  const diffTime = end.getTime() - today.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
  if (diffDays < 0) {
    // Past the end date
    return 'Expired';
  } else if (diffDays === 0) {
    // Last day
    return 'Last Day!';
  } else if (diffDays === 1) {
    // One day remaining
    return '1 day remaining';
  } else {
    // Multiple days remaining
    return `${diffDays} days remaining`;
  }
}

