# Cache Revalidation Troubleshooting

If image changes aren't appearing immediately on the main website, follow these steps:

## Quick Checks

### 1. Verify Environment Variables Are Set

**Main Website (Vercel)**:
- `REVALIDATE_SECRET_TOKEN` must be set

**Admin Dashboard (Vercel)**:
- `REVALIDATE_SECRET_TOKEN` must match main website token exactly
- `MAIN_SITE_URL` must be set to your main website URL (e.g., `https://dbcontractorsny.com`)

### 2. Check Admin Dashboard Logs

After creating/updating/deleting a project, check the admin dashboard deployment logs:

1. Go to Vercel Dashboard → Admin Dashboard project
2. Go to **Deployments** → Latest deployment
3. Click **View Function Logs**
4. Look for:
   - ✅ `Successfully revalidated main website cache` - Good!
   - ⚠️ `Failed to revalidate main website cache` - Check status code
   - ⚠️ `REVALIDATE_SECRET_TOKEN not set` - Add environment variable

### 3. Check Main Website Logs

Check if revalidation requests are being received:

1. Go to Vercel Dashboard → Main Website project
2. Go to **Deployments** → Latest deployment
3. Click **View Function Logs**
4. Look for `[Revalidate]` log entries:
   - `[Revalidate] Request received` - Endpoint is being called
   - `[Revalidate] Token validated` - Token is correct
   - `[Revalidate] Successfully completed` - Revalidation worked

### 4. Test Revalidation Endpoint Manually

Test the endpoint directly:

```bash
# Replace YOUR_TOKEN with your actual REVALIDATE_SECRET_TOKEN
curl -X POST https://dbcontractorsny.com/api/revalidate \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json"
```

Expected response:
```json
{
  "revalidated": true,
  "now": 1234567890,
  "paths": ["/gallery", "/"],
  "durationMs": 50
}
```

## Common Issues

### Issue: "Unauthorized" (401)

**Cause**: Tokens don't match or token format is wrong

**Solution**:
1. Verify both projects have the same `REVALIDATE_SECRET_TOKEN`
2. Make sure there are no extra spaces or quotes
3. Token should be passed as: `Bearer YOUR_TOKEN` (with space after "Bearer")
4. Regenerate token if needed: `openssl rand -base64 32`

### Issue: "Revalidation not configured" (503)

**Cause**: `REVALIDATE_SECRET_TOKEN` not set in main website

**Solution**:
1. Add `REVALIDATE_SECRET_TOKEN` to main website Vercel environment variables
2. Redeploy main website

### Issue: Network Error / Timeout

**Cause**: `MAIN_SITE_URL` is incorrect or main website is unreachable

**Solution**:
1. Verify `MAIN_SITE_URL` in admin dashboard is correct
2. No trailing slash: `https://dbcontractorsny.com` (not `https://dbcontractorsny.com/`)
3. Check main website is accessible
4. Verify both projects are on the same Vercel account/team

### Issue: Changes Still Not Appearing

**Possible Causes**:

1. **Browser Cache**: Hard refresh (Ctrl+Shift+R or Cmd+Shift+R)
2. **CDN Cache**: Vercel edge cache might need a moment
3. **Revalidation Not Triggered**: Check logs to verify revalidation was called
4. **Database Not Updated**: Verify project was actually saved to database

**Solution**:
1. Check admin dashboard logs - should see "Successfully revalidated"
2. Check main website logs - should see "[Revalidate] Successfully completed"
3. Try hard refresh in browser
4. Wait 10-30 seconds and refresh again
5. Check database directly to verify changes were saved

## Debugging Steps

### Step 1: Verify Revalidation is Being Called

Check admin dashboard logs after creating a project. You should see:
```
[INFO] Successfully revalidated main website cache
```

If you see warnings instead, check the error details.

### Step 2: Verify Revalidation Endpoint is Working

Check main website logs. You should see:
```
[Revalidate] Request received
[Revalidate] Token validated, revalidating paths...
[Revalidate] Revalidated /gallery
[Revalidate] Revalidated /
[Revalidate] Successfully completed
```

### Step 3: Verify Page is Dynamic

The gallery page is now set to `force-dynamic`, which means:
- No caching at the page level
- Data is fetched fresh on every request
- Changes should appear immediately

### Step 4: Check Database

Verify the project/images were actually saved:
1. Check admin dashboard - can you see the project?
2. Check database directly (if you have access)
3. Verify image URLs are correct

## Current Configuration

The gallery page is configured with:
- `export const dynamic = 'force-dynamic'` - No page caching
- `export const revalidate = 0` - No time-based revalidation
- `GalleryDataLoader` also has `force-dynamic` - No data caching

This means:
- ✅ Every request fetches fresh data from database
- ✅ No caching at page or data level
- ✅ Changes should appear immediately
- ⚠️ Slightly slower page loads (but ensures fresh data)

## If Still Not Working

1. **Check both projects are deployed** with latest code
2. **Verify environment variables** are set correctly in both projects
3. **Check Vercel function logs** for both projects
4. **Test revalidation endpoint** manually with curl
5. **Try creating a test project** and watch logs in real-time
6. **Hard refresh browser** (Ctrl+Shift+R / Cmd+Shift+R)

## Performance Note

With `force-dynamic`, the gallery page will:
- Always fetch fresh data from database
- Never serve cached content
- Show changes immediately
- Have slightly slower response times (but still fast with database)

This is the trade-off for immediate updates. If you prefer some caching with periodic updates, you can change to `revalidate = 60` (60 seconds) instead of `force-dynamic`.

