# Quick Start: Vercel Blob Storage Setup

## Step-by-Step Instructions

### 1. Create Blob Storage in Vercel

1. Go to [vercel.com](https://vercel.com) and sign in
2. Select your project (or create one)
3. Click the **Storage** tab
4. Click **Create Database** → Select **Blob**
5. Name it (e.g., `contractor-images`)
6. Choose a region
7. Click **Create**

### 2. Get Your Token

After creating, Vercel will show you:
- **`BLOB_READ_WRITE_TOKEN`** - Copy this token

### 3. Add to Local Environment

Add to `admin-dashboard/.env.local`:

```bash
BLOB_READ_WRITE_TOKEN=vercel_blob_rw_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

### 4. Test It

1. Start admin dashboard:
   ```bash
   cd admin-dashboard
   npm run dev
   ```

2. Log in at `http://localhost:3001/login`
3. Go to **Projects** → **New Project**
4. Upload an image - it should work!

### 5. Add to Vercel (for deployment)

1. Go to Vercel project → **Settings** → **Environment Variables**
2. Add `BLOB_READ_WRITE_TOKEN` with your token value
3. Select all environments (Production, Preview, Development)
4. Save

That's it! Your image uploads will now work.

