# Deploying Admin Dashboard to Vercel

The admin-dashboard is a **separate Next.js application** that must be deployed as its own Vercel project.

## Important: Separate Vercel Project Required

The admin-dashboard **cannot** be deployed as part of the main website. It needs its own Vercel project with the root directory set to `admin-dashboard`.

## Deployment Steps

### Option 1: Deploy via Vercel Dashboard (Recommended)

1. **Go to Vercel Dashboard**
   - Navigate to [vercel.com](https://vercel.com)
   - Click "Add New Project"

2. **Import Repository**
   - Select your GitHub repository: `adennis42/d_and_b_gc`
   - Click "Import"

3. **Configure Project Settings**
   - **Project Name**: `d-and-b-admin-dashboard` (or your preferred name)
   - **Root Directory**: Set to `admin-dashboard`
     - Click "Edit" next to Root Directory
     - Enter: `admin-dashboard`
   - **Framework Preset**: Next.js (should auto-detect)
   - **Build Command**: `npm run build` (should auto-detect)
   - **Output Directory**: `.next` (should auto-detect)
   - **Install Command**: `npm install` (should auto-detect)

4. **Add Environment Variables**
   - Go to "Environment Variables" section
   - Add all variables from `admin-dashboard/env.template`:
     - `AUTH_SECRET` - Generate a secure random string (e.g., `openssl rand -base64 32`)
     - `AUTH_URL` - Your admin dashboard URL (use your custom domain: `https://admin.dbcontractorsny.com`)
     - `POSTGRES_URL` - Same as main website
     - `POSTGRES_URL_NON_POOLING` - Same as main website (if available)
     - `BLOB_READ_WRITE_TOKEN` - Same as main website
   
   **Important**: If you're using a custom domain, set `AUTH_URL` to your custom domain URL (e.g., `https://admin.dbcontractorsny.com`), not the `.vercel.app` URL.

5. **Deploy**
   - Click "Deploy"
   - Wait for build to complete

### Option 2: Deploy via Vercel CLI

1. **Navigate to admin-dashboard directory**
   ```bash
   cd admin-dashboard
   ```

2. **Link to Vercel project**
   ```bash
   npx vercel link
   ```
   - Select "Create a new project"
   - Enter project name: `d-and-b-admin-dashboard`
   - **Important**: Make sure the root directory is set to `admin-dashboard` in Vercel dashboard after linking

3. **Set environment variables**
   ```bash
   npx vercel env add AUTH_SECRET
   npx vercel env add AUTH_URL
   npx vercel env add POSTGRES_URL
   npx vercel env add BLOB_READ_WRITE_TOKEN
   # ... add all other variables
   ```

4. **Deploy**
   ```bash
   npx vercel --prod
   ```

## Adding Custom Domain

If you've already created a custom domain in Vercel (e.g., `admin.dbcontractorsny.com`), follow these steps:

### 1. Add Domain to Vercel Project

1. **Go to your Vercel project**
   - Navigate to your admin-dashboard project in Vercel Dashboard
   - Click on the **Settings** tab
   - Click on **Domains** in the left sidebar

2. **Add the custom domain**
   - Enter your domain: `admin.dbcontractorsny.com`
   - Click **Add**
   - Vercel will show you the DNS configuration needed

### 2. Configure DNS Records

Vercel will provide you with DNS records to add. Typically you need:

- **CNAME Record** (if using subdomain):
  - **Name**: `admin` (or `admin.dbcontractorsny` depending on your DNS provider)
  - **Value**: `cname.vercel-dns.com` (or the specific CNAME Vercel provides)
  - **TTL**: 3600 (or default)

- **OR A Record** (if Vercel provides IP addresses):
  - Follow Vercel's specific instructions

**Note**: DNS changes can take up to 48 hours to propagate, but usually happen within minutes to hours.

### 3. Update Environment Variables

**IMPORTANT**: After adding the custom domain, you must update the `AUTH_URL` environment variable:

1. Go to **Settings** → **Environment Variables** in your Vercel project
2. Find `AUTH_URL` and click **Edit**
3. Update it to: `https://admin.dbcontractorsny.com`
4. Make sure it's set for **Production**, **Preview**, and **Development** environments
5. **Redeploy** your project after updating (Vercel will prompt you)

### 4. Verify Domain Configuration

1. Wait for DNS propagation (check with `dig admin.dbcontractorsny.com` or online DNS checker)
2. Once DNS is propagated, Vercel will automatically issue an SSL certificate
3. You should see a green checkmark next to your domain in Vercel
4. Visit `https://admin.dbcontractorsny.com` to verify it's working

### 5. Force Redeploy (if needed)

After updating `AUTH_URL`, trigger a new deployment:
- Go to **Deployments** tab
- Click the **⋯** menu on the latest deployment
- Click **Redeploy**

## Verify Deployment

After deployment, verify:
1. ✅ Admin dashboard loads at the deployed URL (both `.vercel.app` and custom domain)
2. ✅ Custom domain shows SSL certificate is active (lock icon in browser)
3. ✅ Login page appears
4. ✅ Can log in with admin credentials
5. ✅ Can access projects, banners, analytics, settings pages
6. ✅ `AUTH_URL` environment variable matches your custom domain

## Troubleshooting

### Error: "routes-manifest.json couldn't be found" or "The file '/vercel/path0/admin-dashboard/.next/routes-manifest.json' couldn't be found"

**This is the most common error and indicates Vercel is building from the wrong directory.**

#### Step-by-Step Fix:

1. **Go to Vercel Dashboard**
   - Navigate to [vercel.com/dashboard](https://vercel.com/dashboard)
   - Select your **admin-dashboard project**

2. **Open Project Settings**
   - Click on **Settings** tab
   - Scroll down to **General** section

3. **Check Root Directory Setting**
   - Find **Root Directory** setting
   - It should say: `admin-dashboard`
   - If it says `.` (root) or is empty, you need to change it

4. **Update Root Directory** (if needed)
   - Click **Edit** next to Root Directory
   - Enter: `admin-dashboard` (exactly, no leading slash, no trailing slash)
   - Click **Save**

5. **Redeploy**
   - Go to **Deployments** tab
   - Click **⋯** (three dots) on the latest deployment
   - Click **Redeploy**
   - Or push a new commit to trigger a new deployment

6. **Verify Build**
   - Watch the build logs
   - The build should now succeed
   - You should see it running `npm install` and `npm run build` from the `admin-dashboard` directory

#### Visual Guide:
```
Vercel Dashboard → Your Project → Settings → General
└── Root Directory: admin-dashboard  ← Must be set to this
```

#### If Root Directory is Already Set:
- Check that it's exactly `admin-dashboard` (case-sensitive, no slashes)
- Try removing and re-adding it
- Make sure you're editing the correct project (admin-dashboard, not the main website)

### Error: "POSTGRES_URL environment variable is required"
- **Cause**: Environment variables not set in Vercel
- **Solution**: Add all required environment variables in Vercel project settings
  - Go to **Settings** → **Environment Variables**
  - Add all variables from `admin-dashboard/env.template`

### Error: "Cannot find module '@/lib/db'"
- **Cause**: Build is running from wrong directory
- **Solution**: Ensure Root Directory is set to `admin-dashboard` in Vercel project settings
  - Follow the steps above for "routes-manifest.json" error

### Build Fails with Module Not Found Errors
- **Cause**: Dependencies not installed or wrong directory
- **Solution**: 
  1. Verify Root Directory is `admin-dashboard`
  2. Check that `package.json` exists in `admin-dashboard/` directory
  3. Ensure `npm install` runs successfully (check build logs)

## Environment Variables Checklist

Make sure these are set in your Vercel admin-dashboard project:

- [ ] `AUTH_SECRET` - Random secure string
- [ ] `AUTH_URL` - Your admin dashboard URL (use custom domain: `https://admin.dbcontractorsny.com`)
- [ ] `POSTGRES_URL` - Database connection string
- [ ] `POSTGRES_URL_NON_POOLING` - Non-pooling connection (if available)
- [ ] `BLOB_READ_WRITE_TOKEN` - Vercel Blob Storage token

**Critical**: `AUTH_URL` must match your actual domain. If using a custom domain, it must be set to that domain (e.g., `https://admin.dbcontractorsny.com`), not the `.vercel.app` URL.

## Notes

- The admin-dashboard shares the same database and blob storage as the main website
- Both projects can be deployed from the same GitHub repository
- The admin-dashboard is completely separate and has its own deployment URL
- Changes to admin-dashboard code trigger separate deployments from the main website

