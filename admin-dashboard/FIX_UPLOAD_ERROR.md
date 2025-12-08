# Fix: Image Upload 500 Error

If you're getting a 500 Internal Server Error when uploading images, follow these steps:

## Most Common Cause: Missing BLOB_READ_WRITE_TOKEN

The upload API requires `BLOB_READ_WRITE_TOKEN` to be set in your Vercel environment variables.

## Step 1: Check Vercel Environment Variables

1. **Go to Vercel Dashboard**
   - Navigate to [vercel.com/dashboard](https://vercel.com/dashboard)
   - Select your **admin-dashboard project** (not the main website)

2. **Check Environment Variables**
   - Go to **Settings** → **Environment Variables**
   - Look for `BLOB_READ_WRITE_TOKEN`
   - If it's missing, continue to Step 2

## Step 2: Get Your Blob Storage Token

1. **Go to Vercel Storage**
   - In your Vercel project (main website OR admin-dashboard)
   - Click **Storage** tab
   - Find your Blob storage (or create one if needed)

2. **Get the Token**
   - Click on your Blob storage
   - Go to **Settings**
   - Find **`BLOB_READ_WRITE_TOKEN`**
   - Copy the token (starts with `vercel_blob_rw_...`)

## Step 3: Add Token to Admin Dashboard Project

1. **Add Environment Variable**
   - Go back to your **admin-dashboard** project in Vercel
   - **Settings** → **Environment Variables**
   - Click **Add New**
   - **Name**: `BLOB_READ_WRITE_TOKEN`
   - **Value**: Paste your token (the one starting with `vercel_blob_rw_...`)
   - **Environments**: Select all (Production, Preview, Development)
   - Click **Save**

## Step 4: Redeploy

After adding the environment variable:

1. **Redeploy your admin-dashboard**
   - Go to **Deployments** tab
   - Click **⋯** (three dots) on latest deployment
   - Click **Redeploy**

   OR

2. **Push a new commit** (will trigger auto-deploy)

## Step 5: Verify

After redeploying:

1. Go to your admin dashboard: `https://admin.dbcontractorsny.com`
2. Log in
3. Try uploading an image again
4. Check the browser console for any errors
5. Check Vercel deployment logs for detailed error messages

## Check Deployment Logs

If it still doesn't work:

1. Go to **Deployments** → Click on the latest deployment
2. Click **View Function Logs** or check the build logs
3. Look for error messages mentioning:
   - `BLOB_READ_WRITE_TOKEN`
   - `Unauthorized`
   - `Forbidden`
   - Any other error details

## Common Issues

### Issue: "BLOB_READ_WRITE_TOKEN environment variable is not set"
**Solution**: Add the token to Vercel environment variables (see Step 3)

### Issue: "Blob storage authentication failed"
**Solution**: 
- Verify the token is correct (copy it again from Storage settings)
- Make sure there are no extra spaces or quotes
- Token should start with `vercel_blob_rw_`

### Issue: "Blob storage access denied"
**Solution**: 
- Check that the token has read/write permissions
- Make sure you're using the correct token for the correct Blob storage

### Issue: Token exists but still getting errors
**Solution**:
- Make sure you added it to the **admin-dashboard** project, not the main website project
- Verify it's enabled for **Production** environment
- Redeploy after adding/updating the variable

## Testing Locally

To test uploads locally:

1. Add `BLOB_READ_WRITE_TOKEN` to `admin-dashboard/.env.local`:
   ```bash
   BLOB_READ_WRITE_TOKEN=vercel_blob_rw_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
   ```

2. Start the admin dashboard:
   ```bash
   cd admin-dashboard
   npm run dev
   ```

3. Try uploading an image at `http://localhost:3001`

## Need More Help?

Check the Vercel deployment logs for the exact error message. The improved error handling will now show more specific error messages in the logs.

