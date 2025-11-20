# Vercel Blob Storage Setup Guide

This guide walks you through setting up Vercel Blob Storage for image uploads in the admin dashboard.

## Step 1: Create Blob Storage in Vercel

1. **Go to Vercel Dashboard**
   - Navigate to [vercel.com](https://vercel.com)
   - Sign in to your account

2. **Access Your Project**
   - Select your contractor website project
   - Or create a new project if you haven't deployed yet

3. **Create Blob Storage**
   - Go to the **Storage** tab in your project dashboard
   - Click **Create Database** or **Add Storage**
   - Select **Blob** (or **Vercel Blob Storage**)
   - Choose a name (e.g., `contractor-images`)
   - Select a region (choose closest to your users)
   - Click **Create**

## Step 2: Get Your Blob Token

After creating Blob Storage, Vercel will provide:

- **`BLOB_READ_WRITE_TOKEN`** - Token for reading and writing to Blob Storage
  - This is what you need for the admin dashboard

**Important**: Copy this token immediately - you'll need it in the next step.

## Step 3: Add Environment Variables

### For Local Development

Add to `admin-dashboard/.env.local`:

```bash
BLOB_READ_WRITE_TOKEN=vercel_blob_rw_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

### For Vercel Deployment

1. Go to your **Vercel project dashboard**
2. Navigate to **Settings** → **Environment Variables**
3. Add the following variable:
   - **Name**: `BLOB_READ_WRITE_TOKEN`
   - **Value**: Your blob token from Step 2
   - **Environment**: Select all (Production, Preview, Development)
4. Click **Save**

**Important**: If deploying the admin dashboard as a separate Vercel project, add the same variable there too.

## Step 4: Verify Setup

### Test Locally

1. Start the admin dashboard:
   ```bash
   cd admin-dashboard
   npm run dev
   ```

2. Log in to the admin dashboard
3. Go to **Projects** → **New Project**
4. Try uploading an image
5. If successful, you should see the image preview and be able to create the project

### Test Upload API

You can also test the upload endpoint directly:

```bash
curl -X POST http://localhost:3001/api/upload \
  -H "Cookie: your-session-cookie" \
  -F "file=@path/to/image.jpg"
```

## How It Works

1. **Image Upload Flow**:
   - User selects image(s) in admin dashboard
   - Frontend sends to `POST /api/upload`
   - Server validates file type
   - Image is optimized (resized to 1920x1440, converted to WebP)
   - Blur placeholder is generated
   - Image is uploaded to Vercel Blob Storage
   - Public URL is returned

2. **Image Storage**:
   - Images are stored in Vercel Blob Storage
   - Public URLs are accessible from anywhere
   - Images are automatically optimized
   - No CDN configuration needed

3. **Image URLs**:
   - Format: `https://[your-blob-domain].public.blob.vercel-storage.com/[filename]`
   - URLs are permanent and can be used in the main app gallery

## Troubleshooting

### "Unauthorized" Error
- Check that `BLOB_READ_WRITE_TOKEN` is set in `.env.local`
- Verify the token is correct (no extra spaces)
- Restart the dev server after adding the token

### "Failed to upload image" Error
- Check Vercel Blob Storage is created and active
- Verify token has read/write permissions
- Check file size (should be under 10MB)
- Check file type (must be an image)

### Images Not Showing
- Verify the blob URL is accessible
- Check browser console for CORS errors
- Ensure blob storage is set to public access

## Pricing

Vercel Blob Storage pricing (as of 2024):
- **Free Tier**: 1 GB storage, 100 GB bandwidth/month
- **Pro**: $0.15/GB storage, $0.40/GB bandwidth
- **Enterprise**: Custom pricing

For a contractor website with optimized images, the free tier should be sufficient for many projects.

## Next Steps

After setting up Blob Storage:
1. ✅ Test image uploads in admin dashboard
2. ✅ Create a test project with images
3. ✅ Verify images appear in main gallery
4. ✅ Set up production deployment

## Security Notes

- **Never commit** `BLOB_READ_WRITE_TOKEN` to git
- Use environment variables for all tokens
- Rotate tokens if compromised
- Use read-only tokens for public access if needed (future enhancement)

