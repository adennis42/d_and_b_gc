# Vercel Blob Storage Only - Complete Guide

This project uses **Vercel Blob Storage exclusively** for all images. No images are stored in the project directory.

## Architecture Overview

- **Storage**: All images stored in Vercel Blob Storage
- **Database**: Image URLs stored in PostgreSQL (`project_images` table)
- **Main App**: Reads image URLs from database, displays from Vercel Blob
- **Admin Dashboard**: Uploads directly to Vercel Blob, stores URLs in database

## How It Works

### 1. Image Upload Flow (Admin Dashboard)

1. User uploads image in admin dashboard
2. Image is optimized (resized, converted to WebP, quality 85%)
3. Image is uploaded to Vercel Blob Storage (`gallery/` prefix)
4. Blob URL is stored in database (`project_images.url`)
5. Blur placeholder is generated and stored (`project_images.blur_data_url`)

### 2. Image Display Flow (Main Site)

1. Server fetches projects from database
2. Database returns Vercel Blob URLs
3. Next.js Image component loads from Vercel Blob
4. Images are optimized by Next.js Image optimization API

## Migration from Local Paths

If you have images with local paths (`/images/gallery/...`) in the database:

### Step 1: Run Migration Script

```bash
cd admin-dashboard
npm run migrate-images
```

The script will:
- Check Vercel Blob Storage for existing images
- Match images by pathname or filename
- Update database URLs to Vercel Blob URLs
- Upload missing images if they exist locally
- Skip images that don't exist locally or in Blob

### Step 2: Verify Migration

After migration, check:
- Admin dashboard projects page shows thumbnails
- Main site gallery loads images correctly
- No 404 errors in browser console

### Step 3: Manual Upload (if needed)

If images were skipped, upload them manually:
1. Go to Admin Dashboard → Projects
2. Click "Edit" on a project
3. Upload images using the file uploader
4. Images will automatically be uploaded to Vercel Blob

## Configuration

### Environment Variables

**Admin Dashboard** (`admin-dashboard/.env.local`):
```env
BLOB_READ_WRITE_TOKEN=vercel_blob_xxx
POSTGRES_URL=postgres://...
```

**Main App** (`.env.local`):
```env
POSTGRES_URL=postgres://...
```

### Next.js Image Configuration

Both apps are configured to allow images from Vercel Blob Storage:

**Main App** (`next.config.ts`):
```typescript
images: {
  remotePatterns: [
    {
      protocol: "https",
      hostname: "*.public.blob.vercel-storage.com",
      pathname: "/**",
    },
    {
      protocol: "https",
      hostname: "*.blob.vercel-storage.com",
      pathname: "/**",
    },
  ],
}
```

**Admin Dashboard** (`admin-dashboard/next.config.ts`):
```typescript
images: {
  remotePatterns: [
    {
      protocol: "https",
      hostname: "*.public.blob.vercel-storage.com",
      pathname: "/**",
    },
    {
      protocol: "https",
      hostname: "*.blob.vercel-storage.com",
      pathname: "/**",
    },
  ],
}
```

## Image Management

### Adding Images

1. **Via Admin Dashboard** (Recommended):
   - Go to Projects → New Project or Edit Project
   - Upload images using the file uploader
   - Images are automatically optimized and uploaded to Vercel Blob

2. **Via Migration Script**:
   - Place images in `public/images/gallery/` temporarily
   - Run migration script
   - Script will upload and update database
   - Remove local images after verification

### Deleting Images

1. Go to Admin Dashboard → Projects
2. Edit the project
3. Remove images from the project
4. Images remain in Vercel Blob Storage (can be cleaned up manually)

### Updating Images

1. Go to Admin Dashboard → Projects
2. Edit the project
3. Replace images using the file uploader
4. Old images remain in Vercel Blob (can be cleaned up manually)

## Benefits

✅ **No Git Bloat**: Images not in repository  
✅ **Fast CDN**: Vercel Blob uses global CDN  
✅ **Automatic Optimization**: Images optimized on upload  
✅ **Scalable**: Unlimited storage (within Vercel limits)  
✅ **Database-Driven**: All image URLs in database, fully configurable  
✅ **Admin Control**: Complete control from admin dashboard  

## Troubleshooting

### Images Not Loading

1. **Check Database URLs**:
   ```sql
   SELECT url FROM project_images LIMIT 10;
   ```
   URLs should start with `https://*.public.blob.vercel-storage.com/`

2. **Check Vercel Blob**:
   - Go to Vercel Dashboard → Storage → Blob
   - Verify images exist in `gallery/` prefix

3. **Check Environment Variables**:
   - Ensure `BLOB_READ_WRITE_TOKEN` is set in admin dashboard
   - Ensure `POSTGRES_URL` is set in both apps

4. **Check Next.js Config**:
   - Verify `remotePatterns` includes Vercel Blob domains
   - Restart dev server after config changes

### Migration Issues

1. **"BLOB_READ_WRITE_TOKEN not found"**:
   - Set token in `admin-dashboard/.env.local`
   - Get token from Vercel Dashboard → Storage → Blob → Settings

2. **"No Postgres connection string found"**:
   - Set `POSTGRES_URL` in `.env.local` (root or admin-dashboard)
   - Verify connection string is valid

3. **Images Skipped**:
   - Images don't exist locally or in Vercel Blob
   - Upload them manually via admin dashboard

## Best Practices

1. **Always use Admin Dashboard** for image management
2. **Don't commit images** to git (they're in `.gitignore`)
3. **Run migration script** when migrating from local paths
4. **Verify after migration** that images load correctly
5. **Use descriptive alt text** for accessibility
6. **Optimize before upload** (script handles this automatically)

## File Structure

```
project/
├── admin-dashboard/
│   ├── src/
│   │   ├── app/
│   │   │   ├── api/
│   │   │   │   ├── upload/route.ts      # Uploads to Vercel Blob
│   │   │   │   └── projects/route.ts    # Stores URLs in database
│   │   │   └── (dashboard)/
│   │   │       └── projects/             # Image management UI
│   │   └── lib/
│   │       └── blob.ts                   # Vercel Blob client
│   └── .env.local                        # BLOB_READ_WRITE_TOKEN
├── src/
│   ├── lib/
│   │   └── gallery-db.ts                 # Reads URLs from database
│   └── components/
│       └── gallery/                      # Displays images from URLs
└── scripts/
    └── migrate-images-to-vercel-blob.ts  # Migration script
```

## Summary

- ✅ All images in Vercel Blob Storage
- ✅ All URLs in database
- ✅ Fully configurable from admin dashboard
- ✅ No local image storage
- ✅ Automatic optimization on upload
- ✅ Fast CDN delivery

