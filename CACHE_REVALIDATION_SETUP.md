# Cache Revalidation Setup

This document explains how to set up automatic cache revalidation so that changes made in the admin dashboard appear immediately on the main website.

## How It Works

1. **Gallery Page**: Set to revalidate every 60 seconds (or on-demand)
2. **Revalidation API**: Main website exposes `/api/revalidate` endpoint
3. **Admin Dashboard**: Calls revalidation endpoint after project changes
4. **Result**: Gallery page shows updates immediately

## Setup Steps

### 1. Generate Revalidation Secret Token

Generate a secure random token:

```bash
openssl rand -base64 32
```

Save this token - you'll need it for both projects.

### 2. Add Environment Variables

#### Main Website (Vercel Project)

Go to your main website Vercel project → **Settings** → **Environment Variables**:

- **Name**: `REVALIDATE_SECRET_TOKEN`
- **Value**: The token you generated above
- **Environments**: Production, Preview, Development

#### Admin Dashboard (Vercel Project)

Go to your admin-dashboard Vercel project → **Settings** → **Environment Variables**:

- **Name**: `REVALIDATE_SECRET_TOKEN`
- **Value**: Same token as above (must match!)
- **Environments**: Production, Preview, Development

- **Name**: `MAIN_SITE_URL`
- **Value**: Your main website URL (e.g., `https://dbcontractorsny.com`)
- **Environments**: Production, Preview, Development

### 3. Redeploy Both Projects

After adding environment variables:

1. **Redeploy main website** (or push a commit)
2. **Redeploy admin dashboard** (or push a commit)

## How It Works

### When You Create a Project

1. Admin dashboard creates project in database
2. Admin dashboard calls `/api/revalidate` on main website
3. Main website invalidates gallery page cache
4. Next visitor sees new project immediately

### When You Update a Project

1. Admin dashboard updates project in database
2. Admin dashboard calls `/api/revalidate` on main website
3. Main website invalidates gallery page cache
4. Next visitor sees updated project immediately

### When You Delete a Project

1. Admin dashboard deletes project from database
2. Admin dashboard calls `/api/revalidate` on main website
3. Main website invalidates gallery page cache
4. Next visitor sees project removed immediately

## Fallback Behavior

If revalidation fails (e.g., token not set, network error):
- Changes will still appear within 60 seconds (time-based revalidation)
- Admin dashboard logs a warning but doesn't fail the operation
- Main website continues to work normally

## Testing

### Test Revalidation Endpoint

```bash
# Replace YOUR_TOKEN with your actual token
curl -X POST https://dbcontractorsny.com/api/revalidate \
  -H "Authorization: Bearer YOUR_TOKEN"
```

Expected response:
```json
{
  "revalidated": true,
  "now": 1234567890,
  "paths": ["/gallery", "/"]
}
```

### Test Full Flow

1. Create a test project in admin dashboard
2. Check admin dashboard logs - should see "Successfully revalidated main website cache"
3. Visit main website gallery page - new project should appear immediately
4. Delete the test project
5. Refresh gallery page - project should be gone immediately

## Troubleshooting

### Changes Not Appearing Immediately

1. **Check environment variables are set**:
   - Verify `REVALIDATE_SECRET_TOKEN` is set in both projects
   - Verify `MAIN_SITE_URL` is set in admin dashboard
   - Make sure tokens match exactly

2. **Check admin dashboard logs**:
   - Look for "Successfully revalidated main website cache" message
   - If you see warnings, check the error details

3. **Check main website logs**:
   - Look for revalidation API calls in function logs
   - Verify the endpoint is accessible

4. **Verify URLs**:
   - Make sure `MAIN_SITE_URL` is correct (no trailing slash)
   - Check that the main website is accessible

### Revalidation Endpoint Returns 401

- Tokens don't match - verify both projects have the same `REVALIDATE_SECRET_TOKEN`
- Token has extra spaces or quotes - copy token exactly

### Revalidation Endpoint Returns 503

- `REVALIDATE_SECRET_TOKEN` not set in main website
- Add the environment variable and redeploy

### Network Errors

- Check that `MAIN_SITE_URL` is correct
- Verify main website is accessible from admin dashboard
- Check Vercel function logs for network errors

## Security Notes

- **Never commit** `REVALIDATE_SECRET_TOKEN` to git
- Use different tokens for development and production if desired
- Rotate token periodically for security
- The token should be long and random (use `openssl rand -base64 32`)

## Performance Impact

- Revalidation calls are non-blocking (don't wait for response)
- If revalidation fails, operations still succeed
- Time-based revalidation (60s) ensures updates appear even if on-demand fails
- Minimal performance impact on admin dashboard operations

