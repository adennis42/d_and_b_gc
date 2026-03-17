import { logger } from './logger';

/**
 * Trigger cache revalidation on the main public website.
 * Called after any admin save so changes appear immediately.
 */
export async function revalidateMainWebsite(): Promise<void> {
  const revalidateSecret = process.env.REVALIDATE_SECRET_TOKEN;
  const mainSiteUrl = process.env.MAIN_SITE_URL || 'https://dbcontractorsny.com';

  if (!revalidateSecret) {
    logger.warn('REVALIDATE_SECRET_TOKEN not set — skipping cache revalidation');
    return;
  }

  try {
    const response = await fetch(`${mainSiteUrl}/api/revalidate`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${revalidateSecret}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      logger.warn('Failed to revalidate main website cache', {
        metadata: { status: response.status, statusText: response.statusText },
      });
    } else {
      logger.info('Successfully revalidated main website cache');
    }
  } catch (error) {
    logger.warn('Error calling revalidation endpoint', {
      metadata: { error: error instanceof Error ? error.message : String(error) },
    });
  }
}
