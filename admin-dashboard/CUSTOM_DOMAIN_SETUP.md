# Custom Domain Setup: admin.dbcontractorsny.com

Quick guide to connect your custom domain to the admin-dashboard.

## Step-by-Step Instructions

### 1. Add Domain to Your Vercel Project

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Select your **admin-dashboard project** (the one with root directory set to `admin-dashboard`)
3. Click **Settings** → **Domains**
4. Enter: `admin.dbcontractorsny.com`
5. Click **Add**

### 2. Configure DNS (if not already done)

Vercel will show you the DNS records needed. Typically:

**If your DNS provider is at the root level (dbcontractorsny.com):**
- Add a **CNAME** record:
  - **Name/Host**: `admin`
  - **Value/Target**: `cname.vercel-dns.com` (or what Vercel shows)
  - **TTL**: 3600 (or default)

**If your DNS provider requires full domain:**
- **Name/Host**: `admin.dbcontractorsny.com`
- **Value/Target**: `cname.vercel-dns.com` (or what Vercel shows)

### 3. Update AUTH_URL Environment Variable

**CRITICAL**: This must be done for authentication to work correctly.

1. In your Vercel project, go to **Settings** → **Environment Variables**
2. Find `AUTH_URL` and click **Edit** (or **Add** if it doesn't exist)
3. Set the value to: `https://admin.dbcontractorsny.com`
4. Make sure it's enabled for:
   - ✅ Production
   - ✅ Preview  
   - ✅ Development
5. Click **Save**

### 4. Redeploy Your Project

After updating `AUTH_URL`, you need to redeploy:

1. Go to **Deployments** tab
2. Click the **⋯** (three dots) menu on your latest deployment
3. Click **Redeploy**
4. Wait for deployment to complete

### 5. Verify Everything Works

1. **Check DNS propagation** (can take a few minutes to hours):
   ```bash
   dig admin.dbcontractorsny.com
   # or use online tool: https://dnschecker.org
   ```

2. **Wait for SSL certificate** (Vercel automatically provisions this):
   - Check Vercel dashboard → Domains
   - You should see a green checkmark when ready

3. **Test the site**:
   - Visit `https://admin.dbcontractorsny.com`
   - Should see the login page
   - Try logging in with your admin credentials

## Troubleshooting

### Domain shows "Invalid Configuration" in Vercel
- Check DNS records are correct
- Wait for DNS propagation (can take up to 48 hours, usually much faster)
- Verify the CNAME record points to the correct Vercel target

### SSL Certificate not issued
- DNS must be fully propagated first
- Vercel automatically issues certificates, but it can take a few minutes after DNS is ready
- Check the Domains page in Vercel for status

### Authentication errors after domain change
- **Most common issue**: `AUTH_URL` environment variable not updated
- Make sure `AUTH_URL` is set to `https://admin.dbcontractorsny.com` (not `.vercel.app` URL)
- Redeploy after updating environment variables

### Can't access site after DNS change
- Clear your browser cache
- Try incognito/private browsing mode
- Check DNS propagation status
- Verify DNS records are correct

## Quick Checklist

- [ ] Domain added to Vercel project
- [ ] DNS records configured correctly
- [ ] DNS propagated (check with dig or DNS checker)
- [ ] `AUTH_URL` environment variable updated to `https://admin.dbcontractorsny.com`
- [ ] Project redeployed after updating `AUTH_URL`
- [ ] SSL certificate active (green checkmark in Vercel)
- [ ] Site accessible at `https://admin.dbcontractorsny.com`
- [ ] Login page loads correctly
- [ ] Can log in successfully

## Need Help?

If you're stuck:
1. Check Vercel deployment logs for errors
2. Verify all environment variables are set correctly
3. Ensure DNS records match what Vercel shows
4. Wait a bit longer for DNS/SSL propagation

