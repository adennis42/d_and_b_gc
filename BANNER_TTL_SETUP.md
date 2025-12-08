# Banner TTL (Time To Live) Setup Guide

This guide explains how to set up automatic banner deletion using the TTL (Time To Live) feature.

## Overview

The TTL feature allows you to automatically delete banners after a specified number of days past their end date. This helps keep your database clean and prevents old banners from accumulating.

## Setup Steps

### 1. Run Database Migration

First, add the `ttl_days` column to your database:

```bash
npm run migrate-ttl
```

Or manually run the SQL migration:

```bash
psql $POSTGRES_URL -f database/migrations/add_ttl_to_banners.sql
```

### 2. Set Up Vercel Cron Job

The cleanup job runs automatically via Vercel Cron Jobs. The configuration is already in `vercel.json`:

```json
{
  "crons": [
    {
      "path": "/api/cron/cleanup-banners",
      "schedule": "0 2 * * *"
    }
  ]
}
```

This runs daily at 2 AM UTC.

### 3. Set Environment Variable (Optional but Recommended)

For security, set a `CRON_SECRET` environment variable in Vercel:

1. Go to your Vercel project dashboard
2. Navigate to **Settings** → **Environment Variables**
3. Add `CRON_SECRET` with a random value:

```bash
# Generate a secret
openssl rand -base64 32
```

4. Add it to both `.env.local` (for local testing) and Vercel environment variables

### 4. Deploy to Vercel

After deploying, Vercel will automatically set up the cron job. You can verify it in:
- Vercel Dashboard → Your Project → **Cron Jobs** tab

## How It Works

1. **Creating a Banner with TTL**:
   - When creating or editing a banner in the admin dashboard, you can optionally set "Auto-delete after end date (days)"
   - Example: If you set `7`, the banner will be automatically deleted 7 days after its `end_date`
   - Leave it empty to keep the banner indefinitely

2. **Automatic Cleanup**:
   - The cron job runs daily at 2 AM UTC
   - It checks all banners with a `ttl_days` value
   - Banners where `end_date + ttl_days < current_timestamp` are deleted
   - The cleanup is logged for monitoring

## Testing the Cleanup

You can manually test the cleanup endpoint:

```bash
# Local testing
curl http://localhost:3000/api/cron/cleanup-banners \
  -H "Authorization: Bearer your-cron-secret"

# Production testing
curl https://your-domain.com/api/cron/cleanup-banners \
  -H "Authorization: Bearer your-cron-secret"
```

## Example Scenarios

### Scenario 1: Limited-Time Promotion
- **End Date**: December 31, 2024
- **TTL**: 7 days
- **Result**: Banner stops showing on Dec 31, gets deleted on Jan 7, 2025

### Scenario 2: Seasonal Banner
- **End Date**: January 15, 2025
- **TTL**: 30 days
- **Result**: Banner stops showing on Jan 15, gets deleted on Feb 14, 2025

### Scenario 3: Permanent Banner
- **End Date**: December 31, 2025
- **TTL**: (empty/null)
- **Result**: Banner stops showing on Dec 31, but remains in database (can be manually deleted later)

## Monitoring

Check Vercel function logs to see cleanup activity:
- Vercel Dashboard → Your Project → **Functions** → `/api/cron/cleanup-banners`
- Look for logs showing how many banners were deleted

## Troubleshooting

### Cron Job Not Running
1. Verify `vercel.json` is committed and deployed
2. Check Vercel Cron Jobs tab to see if the job is registered
3. Ensure the route handler exists at `/api/cron/cleanup-banners/route.ts`

### Banners Not Being Deleted
1. Verify the banner has a `ttl_days` value set (not null)
2. Check that `end_date + ttl_days` has passed
3. Review function logs for any errors

### Security Concerns
- The cron endpoint checks for `CRON_SECRET` in production
- In development, it's more permissive for testing
- Always set `CRON_SECRET` in production environments

## Notes

- The cleanup job is idempotent (safe to run multiple times)
- Only banners with `ttl_days IS NOT NULL` are considered for deletion
- The cleanup happens server-side, so there's no impact on website performance
- Deleted banners cannot be recovered (ensure TTL values are set correctly)

