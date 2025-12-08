# Quick Fix: routes-manifest.json Error

If you're seeing this error:
```
Error: The file "/vercel/path0/admin-dashboard/.next/routes-manifest.json" couldn't be found.
```

## The Problem
Vercel is trying to build your admin-dashboard from the root directory instead of the `admin-dashboard` subdirectory.

## The Solution (2 minutes)

### Step 1: Open Vercel Project Settings
1. Go to [vercel.com/dashboard](https://vercel.com/dashboard)
2. Click on your **admin-dashboard project** (the one you're trying to deploy)
3. Click the **Settings** tab

### Step 2: Set Root Directory
1. Scroll down to the **General** section
2. Find **Root Directory**
3. Click **Edit** (or **Change**)
4. Enter: `admin-dashboard`
   - ✅ Correct: `admin-dashboard`
   - ❌ Wrong: `.` or empty
   - ❌ Wrong: `/admin-dashboard`
   - ❌ Wrong: `admin-dashboard/`
5. Click **Save**

### Step 3: Redeploy
1. Go to the **Deployments** tab
2. Find your latest deployment (the one that failed)
3. Click the **⋯** (three dots) menu
4. Click **Redeploy**
5. Wait for the build to complete

## Verification

After redeploying, check the build logs. You should see:
- ✅ Build starts successfully
- ✅ `npm install` runs
- ✅ `npm run build` completes
- ✅ No "routes-manifest.json" error

## Still Not Working?

1. **Double-check the Root Directory**:
   - Go back to Settings → General
   - Verify it says exactly `admin-dashboard` (no quotes, no slashes)

2. **Check you're editing the right project**:
   - Make sure you're in the admin-dashboard project, not the main website project
   - The project name should be something like `d-and-b-admin-dashboard` or similar

3. **Try a fresh deployment**:
   - Make a small change to any file in `admin-dashboard/`
   - Commit and push to trigger a new deployment
   - This ensures Vercel picks up the Root Directory setting

4. **Check build logs**:
   - Look at the build output
   - It should show it's running commands from the `admin-dashboard` directory
   - If you see it running from root (`/`), the Root Directory isn't set correctly

## Common Mistakes

❌ **Setting Root Directory to `.`** (current directory)
- This tells Vercel to build from the repository root
- Won't work because `admin-dashboard` is a subdirectory

❌ **Forgetting to save after editing**
- Make sure you click **Save** after changing Root Directory

❌ **Not redeploying after changing settings**
- Settings changes don't affect existing deployments
- You must redeploy for changes to take effect

## Need More Help?

See the full troubleshooting guide in `DEPLOY_ADMIN_DASHBOARD.md` for more details.

