# Image Migration to Vercel Blob Storage Guide

This guide explains how to migrate images from local paths to Vercel Blob Storage.

## Overview

The database currently has image URLs like `/images/gallery/kitchens/kitchen-004-1.webp`. These need to be migrated to Vercel Blob Storage URLs (e.g., `https://*.public.blob.vercel-storage.com/...`).

## Prerequisites

1. **Vercel Blob Storage Setup**
   - Ensure `BLOB_READ_WRITE_TOKEN` is set in `admin-dashboard/.env.local`
   - Get this token from: Vercel Dashboard → Your Project → Storage → Blob → Settings

2. **Database Connection**
   - Ensure `POSTGRES_URL` or `PRISMA_DATABASE_URL` is set in `.env.local` (root) or `admin-dashboard/.env.local`

## Migration Process

The migration script will:

1. **Check Vercel Blob Storage** - Looks for images that already exist in Blob Storage
2. **Update Database URLs** - If images exist in Blob, updates database URLs to point to them
3. **Upload Missing Images** - If images exist locally but not in Blob, uploads them
4. **Skip Missing Files** - If images don't exist locally or in Blob, skips them with a warning

### Running the Migration

```bash
cd admin-dashboard
npm run migrate-images
```

### What the Script Does

1. Finds all images in the database with local paths (`/images/gallery/...`)
2. Checks Vercel Blob Storage for existing images with matching paths
3. For each image:
   - **If found in Blob**: Updates database URL to the Blob URL
   - **If found locally**: Uploads to Blob and updates database
   - **If not found**: Skips with a warning

### Example Output

```
🔍 Finding images with local paths...

Found 150 images with local paths

🔍 Checking Vercel Blob Storage for existing images...

Found 150 existing images in Vercel Blob Storage

✅ Updated: /images/gallery/kitchens/kitchen-001-1.webp → https://...
✅ Updated: /images/gallery/kitchens/kitchen-001-2.webp → https://...
...

📊 Migration Summary:
   ✅ Uploaded: 0
   ✅ Updated (found in Blob): 150
   ⚠️  Skipped: 0
   ❌ Errors: 0

✅ Successfully migrated 150 images to use Vercel Blob Storage!
```

## After Migration

1. **Verify Images Load** - Check the admin dashboard projects page to ensure thumbnails display
2. **Check Main Site** - Visit the gallery page to ensure images load correctly
3. **Test Image Uploads** - Upload a new image through the admin dashboard to verify the flow works

## Troubleshooting

### "BLOB_READ_WRITE_TOKEN not found"
- Ensure the token is set in `admin-dashboard/.env.local`
- Get the token from Vercel Dashboard → Storage → Blob → Settings

### "No Postgres connection string found"
- Ensure `POSTGRES_URL` or `PRISMA_DATABASE_URL` is set in `.env.local`
- Check that the connection string is valid

### Images Still Not Loading
- Check browser console for errors
- Verify the Blob URLs are accessible (try opening one in a browser)
- Ensure `next.config.ts` has the correct `remotePatterns` for Vercel Blob

### Images Skipped
- If images are skipped, they don't exist locally or in Vercel Blob
- You'll need to upload them manually through the admin dashboard
- Or place them in `public/images/gallery/` and run the migration again

## Manual Upload via Admin Dashboard

If images are missing, you can upload them manually:

1. Go to Admin Dashboard → Projects
2. Click "Edit" on a project
3. Upload images using the file uploader
4. Images will automatically be uploaded to Vercel Blob Storage

