# Fix: Build Errors - Root Directory & Database URL

You're seeing two issues:
1. **Vercel is building from root directory** (not `admin-dashboard`)
2. **POSTGRES_URL has extra quotes** causing "Invalid URL" errors

## Issue 1: Wrong Root Directory

**Evidence from your build logs:**
```
> contractor_website@0.1.0 build  ← This is the MAIN site, not admin-dashboard!
> next build
```

This means Vercel is building from the repository root instead of `admin-dashboard`.

### Fix Steps:

1. **Go to Vercel Dashboard**
   - Navigate to [vercel.com/dashboard](https://vercel.com/dashboard)
   - Click on your **admin-dashboard project**

2. **Verify Root Directory**
   - Click **Settings** tab
   - Scroll to **General** section
   - Find **Root Directory**
   - **It MUST say**: `admin-dashboard`
   - If it says `.` or is empty, that's the problem!

3. **Set Root Directory** (if wrong)
   - Click **Edit** next to Root Directory
   - Enter: `admin-dashboard` (exactly, no slashes, no quotes)
   - Click **Save**

4. **Verify Build Settings**
   - While in Settings → General, check:
     - **Framework Preset**: Next.js
     - **Build Command**: `npm run build`
     - **Output Directory**: `.next`
     - **Install Command**: `npm install`

## Issue 2: POSTGRES_URL Has Extra Quotes

**Evidence from your error:**
```
input: '"postgres://...'  ← Notice the double quotes!
```

The environment variable has quotes around it, which makes it invalid.

### Fix Steps:

1. **Go to Environment Variables**
   - In your admin-dashboard project
   - **Settings** → **Environment Variables**

2. **Find POSTGRES_URL**
   - Look for `POSTGRES_URL` in the list
   - Click **Edit**

3. **Remove Quotes**
   - The value should be: `REDACTED_POSTGRES_URI`
   - **DO NOT include quotes** around it
   - It should start with `postgres://` and end with `require` (no quotes)
   - Click **Save**

4. **Check Other Database Variables**
   - Also check `POSTGRES_URL_NON_POOLING` if you have it
   - Make sure it also has no quotes

## After Fixing Both Issues

1. **Redeploy**
   - Go to **Deployments** tab
   - Click **⋯** (three dots) on latest deployment
   - Click **Redeploy**

2. **Watch Build Logs**
   - You should now see:
     ```
     > admin-dashboard@0.1.0 build  ← Should say admin-dashboard!
     > next build
     ```
   - No more "Invalid URL" errors
   - Build should complete successfully

## Verification Checklist

After redeploying, verify:

- [ ] Build logs show `admin-dashboard@0.1.0 build` (not `contractor_website@0.1.0`)
- [ ] No "Invalid URL" errors in build logs
- [ ] Build completes successfully
- [ ] Root Directory is set to `admin-dashboard` in Settings
- [ ] `POSTGRES_URL` has no quotes in Environment Variables
- [ ] Deployment succeeds

## Still Having Issues?

### If Root Directory keeps resetting:
- Make sure you're editing the **admin-dashboard project**, not the main website project
- Try removing and re-adding the Root Directory setting
- Check that you have a separate Vercel project for admin-dashboard

### If POSTGRES_URL still has quotes:
- Copy the value from your main website project's environment variables
- Make sure you're not copying quotes when pasting
- Try removing and re-adding the variable

### If build still fails:
- Check that `admin-dashboard/package.json` exists
- Verify `admin-dashboard/next.config.ts` exists
- Make sure all environment variables are set (check `admin-dashboard/env.template`)

