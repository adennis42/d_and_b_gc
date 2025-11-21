# Admin Dashboard Vercel Deployment Plan

Complete step-by-step guide to deploy the admin dashboard to Vercel for client access.

---

## 📋 Table of Contents

1. [Overview](#overview)
2. [Prerequisites](#prerequisites)
3. [Deployment Options](#deployment-options)
4. [Step-by-Step Deployment](#step-by-step-deployment)
5. [Environment Variables Setup](#environment-variables-setup)
6. [Domain Configuration](#domain-configuration)
7. [Post-Deployment Steps](#post-deployment-steps)
8. [Testing Checklist](#testing-checklist)
9. [Troubleshooting](#troubleshooting)
10. [Security Considerations](#security-considerations)

---

## 🎯 Overview

The admin dashboard is a separate Next.js application that needs to be deployed independently to Vercel. This allows your clients to access it via a secure URL (e.g., `admin.yourdomain.com` or `yourdomain.com/admin`).

**Key Points:**
- Admin dashboard runs on port 3001 locally
- Uses same database as main website
- Requires authentication (NextAuth.js)
- Needs access to Vercel Blob Storage for image uploads

---

## ✅ Prerequisites

Before deploying, ensure you have:

1. **Vercel Account**
   - Sign up at [vercel.com](https://vercel.com) if you don't have one
   - Connect your GitHub account (if using GitHub)

2. **GitHub Repository**
   - Admin dashboard code is in your repository
   - Code is pushed to GitHub (main branch)

3. **Database Setup**
   - Vercel Postgres database is created and configured
   - Database connection strings are available

4. **Vercel Blob Storage**
   - Blob storage is created in Vercel
   - `BLOB_READ_WRITE_TOKEN` is available

5. **Domain (Optional but Recommended)**
   - Domain name for your main website
   - Ability to add subdomain (e.g., `admin.yourdomain.com`)

---

## 🚀 Deployment Options

### Option 1: Separate Vercel Project (Recommended)

**Pros:**
- Independent deployments
- Separate environment variables
- Easier to manage permissions
- Can use subdomain (e.g., `admin.yourdomain.com`)

**Cons:**
- Requires separate Vercel project
- Two projects to manage

### Option 2: Monorepo with Path-Based Routing

**Pros:**
- Single Vercel project
- Shared environment variables

**Cons:**
- More complex setup
- Requires custom routing configuration
- Less isolation

**We'll use Option 1 (Separate Project)** for this guide.

---

## 📝 Step-by-Step Deployment

### Phase 1: Prepare Repository Structure

#### Step 1.1: Verify Admin Dashboard Structure

Ensure your repository structure looks like this:

```
contractor_website/
├── admin-dashboard/          # Separate Next.js app
│   ├── src/
│   ├── public/
│   ├── package.json
│   ├── next.config.ts
│   ├── tsconfig.json
│   └── .env.local (local only, not committed)
├── src/                      # Main website
├── package.json
└── ...
```

#### Step 1.2: Create Vercel Configuration (Optional)

Create `admin-dashboard/vercel.json` for custom configuration:

```json
{
  "buildCommand": "cd admin-dashboard && npm install && npm run build",
  "outputDirectory": "admin-dashboard/.next",
  "installCommand": "cd admin-dashboard && npm install",
  "framework": "nextjs",
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/$1"
    }
  ]
}
```

**Note:** Vercel should auto-detect Next.js, but this ensures correct build settings.

---

### Phase 2: Create Vercel Project

#### Step 2.1: Link Admin Dashboard to Vercel

**Option A: Via Vercel Dashboard (Recommended)**

1. Go to [vercel.com/dashboard](https://vercel.com/dashboard)
2. Click **"Add New..."** → **"Project"**
3. Import your GitHub repository
4. **Important:** Configure the project:
   - **Root Directory:** Set to `admin-dashboard`
   - **Framework Preset:** Next.js (auto-detected)
   - **Build Command:** `npm run build` (or leave default)
   - **Output Directory:** `.next` (or leave default)
   - **Install Command:** `npm install` (or leave default)

**Option B: Via Vercel CLI**

```bash
cd admin-dashboard
npx vercel
```

Follow the prompts:
- Set up and deploy? **Yes**
- Which scope? (Select your account/team)
- Link to existing project? **No** (create new)
- Project name? `admin-dashboard` (or your preferred name)
- Directory? `./` (current directory)
- Override settings? **No** (use defaults)

#### Step 2.2: Configure Build Settings

In Vercel Dashboard → Project Settings → General:

- **Root Directory:** `admin-dashboard`
- **Build Command:** `npm run build`
- **Output Directory:** `.next`
- **Install Command:** `npm install`
- **Node.js Version:** `20.x` (or latest LTS)

---

### Phase 3: Environment Variables

#### Step 3.1: Add Environment Variables in Vercel

Go to: **Vercel Dashboard → Your Project → Settings → Environment Variables**

Add the following variables:

| Variable | Value | Environments |
|----------|-------|--------------|
| `POSTGRES_URL` | Your Postgres connection string | Production, Preview, Development |
| `PRISMA_DATABASE_URL` | Same as POSTGRES_URL (if using Prisma Postgres) | Production, Preview, Development |
| `AUTH_SECRET` | Generate with: `openssl rand -base64 32` | Production, Preview, Development |
| `AUTH_URL` | Your production URL (e.g., `https://admin.yourdomain.com`) | Production |
| `AUTH_URL` | Preview URL (auto-generated) | Preview |
| `AUTH_URL` | `http://localhost:3001` | Development |
| `BLOB_READ_WRITE_TOKEN` | Your Vercel Blob token | Production, Preview, Development |
| `NEXT_PUBLIC_GA_ID` | (Optional) Google Analytics ID | Production, Preview, Development |

**Important Notes:**
- **AUTH_SECRET:** Generate a NEW secret for production (different from local)
- **AUTH_URL:** Must match your actual deployment URL
- **Select all environments** (Production, Preview, Development) for each variable

#### Step 3.2: Generate Production AUTH_SECRET

```bash
openssl rand -base64 32
```

Copy the output and use it as `AUTH_SECRET` in Vercel.

#### Step 3.3: Get Database Connection Strings

1. Go to Vercel Dashboard → Storage → Your Postgres Database
2. Copy the connection strings:
   - `POSTGRES_URL` (pooled connection)
   - `PRISMA_DATABASE_URL` (if using Prisma Postgres)

#### Step 3.4: Get Vercel Blob Token

1. Go to Vercel Dashboard → Storage → Your Blob Store
2. Click **Settings**
3. Copy the `BLOB_READ_WRITE_TOKEN`

---

### Phase 4: Deploy

#### Step 4.1: Initial Deployment

**Option A: Automatic (via Git)**

1. Push your code to GitHub:
   ```bash
   git add admin-dashboard/
   git commit -m "Prepare admin dashboard for deployment"
   git push origin main
   ```

2. Vercel will automatically detect the push and start building

3. Monitor the deployment in Vercel Dashboard → Deployments

**Option B: Manual Deployment**

```bash
cd admin-dashboard
npx vercel --prod
```

#### Step 4.2: Monitor Build Process

Watch the deployment logs in Vercel Dashboard:
- Build should complete successfully
- Check for any errors or warnings
- Note the deployment URL (e.g., `admin-dashboard-xyz.vercel.app`)

---

### Phase 5: Domain Configuration

#### Step 5.1: Add Custom Domain (Recommended)

1. Go to **Vercel Dashboard → Your Project → Settings → Domains**
2. Click **"Add Domain"**
3. Enter your subdomain: `admin.yourdomain.com`
4. Follow DNS configuration instructions:
   - Add CNAME record: `admin` → `cname.vercel-dns.com`
   - Or add A record (if provided by Vercel)

#### Step 5.2: Update AUTH_URL

After domain is configured:
1. Go to **Settings → Environment Variables**
2. Update `AUTH_URL` for Production:
   - Change to: `https://admin.yourdomain.com`
3. Redeploy (or wait for auto-deploy)

#### Step 5.3: SSL Certificate

Vercel automatically provisions SSL certificates via Let's Encrypt. Wait a few minutes after adding domain for SSL to activate.

---

### Phase 6: Post-Deployment Configuration

#### Step 6.1: Create Admin User for Production

**Option A: Via Script (Local)**

1. Update `admin-dashboard/.env.local` with production database:
   ```bash
   POSTGRES_URL=your-production-postgres-url
   AUTH_SECRET=your-production-auth-secret
   AUTH_URL=https://admin.yourdomain.com
   ```

2. Create admin user:
   ```bash
   cd admin-dashboard
   npm run create-admin admin@yourdomain.com SecurePassword123 "Admin User"
   ```

**Option B: Via Database Directly**

Connect to your production database and run:

```sql
-- Hash password first (use bcrypt with 10 rounds)
-- You can use: node -e "const bcrypt = require('bcryptjs'); bcrypt.hash('YourPassword', 10).then(h => console.log(h))"
INSERT INTO users (email, password_hash, role, name)
VALUES ('admin@yourdomain.com', '$2a$10$hashedpassword...', 'admin', 'Admin User')
ON CONFLICT (email) DO UPDATE SET
  password_hash = EXCLUDED.password_hash,
  name = EXCLUDED.name,
  updated_at = CURRENT_TIMESTAMP;
```

#### Step 6.2: Verify Database Access

1. Log in to admin dashboard
2. Try creating a test project
3. Upload a test image
4. Verify data appears in database

#### Step 6.3: Configure Redirects (Optional)

If you want `yourdomain.com/admin` to redirect to `admin.yourdomain.com`:

Create `vercel.json` in main project root:

```json
{
  "redirects": [
    {
      "source": "/admin",
      "destination": "https://admin.yourdomain.com",
      "permanent": true
    }
  ]
}
```

---

## 🧪 Testing Checklist

### Pre-Deployment Testing

- [ ] Admin dashboard builds locally: `cd admin-dashboard && npm run build`
- [ ] No TypeScript errors
- [ ] No linting errors
- [ ] Environment variables are documented

### Post-Deployment Testing

- [ ] **Accessibility**
  - [ ] Dashboard loads at production URL
  - [ ] Login page displays correctly
  - [ ] HTTPS is working (SSL certificate active)

- [ ] **Authentication**
  - [ ] Can log in with admin credentials
  - [ ] Session persists after page refresh
  - [ ] Logout works correctly
  - [ ] Unauthorized access redirects to login

- [ ] **Database**
  - [ ] Can view projects list
  - [ ] Can create new project
  - [ ] Can edit existing project
  - [ ] Can delete project
  - [ ] Data persists after refresh

- [ ] **Image Uploads**
  - [ ] Can upload images to Vercel Blob
  - [ ] Images display correctly
  - [ ] Images are optimized
  - [ ] Can delete images

- [ ] **Analytics**
  - [ ] Analytics page loads
  - [ ] Data displays correctly
  - [ ] Charts render properly

- [ ] **Settings**
  - [ ] Can update hero image
  - [ ] Settings save correctly
  - [ ] Changes reflect on main website

- [ ] **Mobile Responsiveness**
  - [ ] Dashboard works on mobile devices
  - [ ] Forms are usable on small screens
  - [ ] Navigation works on mobile

---

## 🔧 Troubleshooting

### Build Fails: "Module not found"

**Problem:** Vercel can't find admin-dashboard files

**Solution:**
1. Verify Root Directory is set to `admin-dashboard` in Vercel settings
2. Check that files are committed to git
3. Ensure `package.json` exists in `admin-dashboard/` directory

### Build Fails: "Cannot find module '@/lib/db'"

**Problem:** TypeScript path aliases not resolving

**Solution:**
1. Verify `tsconfig.json` has correct paths:
   ```json
   {
     "compilerOptions": {
       "paths": {
         "@/*": ["./src/*"]
       }
     }
   }
   ```
2. Ensure `tsconfig.json` is in `admin-dashboard/` directory

### Environment Variables Not Working

**Problem:** Variables not accessible at runtime

**Solution:**
1. Verify variables are set in correct environment (Production/Preview/Development)
2. Check variable names match exactly (case-sensitive)
3. Redeploy after adding variables
4. Restart the deployment if needed

### Database Connection Errors

**Problem:** "Connection refused" or "Authentication failed"

**Solution:**
1. Verify `POSTGRES_URL` is correct in Vercel
2. Check database allows connections from Vercel IPs
3. Ensure connection string includes SSL mode: `?sslmode=require`
4. Test connection locally with same credentials

### NextAuth Errors: "MissingSecret" or "JWTSessionError"

**Problem:** Authentication not working

**Solution:**
1. Verify `AUTH_SECRET` is set in Vercel
2. Ensure `AUTH_URL` matches your actual deployment URL exactly
3. Check `AUTH_URL` includes `https://` (not `http://`)
4. Clear browser cookies and try again

### Images Not Uploading

**Problem:** Blob upload fails

**Solution:**
1. Verify `BLOB_READ_WRITE_TOKEN` is set correctly
2. Check token has read/write permissions
3. Verify blob store exists in Vercel
4. Check API route `/api/upload` is accessible

### CORS Errors

**Problem:** Cross-origin requests blocked

**Solution:**
1. Ensure `AUTH_URL` matches deployment URL exactly
2. Check NextAuth configuration includes `trustHost: true`
3. Verify domain is properly configured in Vercel

---

## 🔒 Security Considerations

### 1. Strong Authentication

- **Use strong passwords** for admin accounts (minimum 12 characters)
- **Enable 2FA** if possible (future enhancement)
- **Rotate AUTH_SECRET** periodically
- **Use different secrets** for development and production

### 2. Environment Variables

- **Never commit** `.env.local` to git
- **Use Vercel's environment variables** for production secrets
- **Rotate secrets** if exposed
- **Limit access** to environment variables in Vercel

### 3. Database Security

- **Use connection pooling** (Vercel Postgres handles this)
- **Restrict database access** to necessary IPs if possible
- **Use SSL connections** (`sslmode=require`)
- **Regular backups** (Vercel Postgres includes backups)

### 4. HTTPS Only

- **Always use HTTPS** in production
- **Set AUTH_URL** to HTTPS URL
- **Enable HSTS** (Vercel does this automatically)
- **Verify SSL certificate** is active

### 5. Access Control

- **Limit admin users** to necessary personnel only
- **Review user access** regularly
- **Remove unused accounts**
- **Monitor login attempts** (future enhancement)

### 6. API Security

- **Protect API routes** with authentication middleware
- **Validate input** on all forms
- **Rate limit** API endpoints (future enhancement)
- **Sanitize file uploads**

---

## 📊 Monitoring & Maintenance

### Regular Tasks

1. **Monitor Deployments**
   - Check Vercel Dashboard for failed deployments
   - Review deployment logs for errors
   - Monitor build times

2. **Database Maintenance**
   - Review database size and usage
   - Check for slow queries
   - Monitor connection pool usage

3. **Security Updates**
   - Keep dependencies updated
   - Review security advisories
   - Update Next.js and other packages regularly

4. **User Management**
   - Review active admin users
   - Remove unused accounts
   - Rotate passwords periodically

### Monitoring Tools

- **Vercel Analytics** - Built-in performance monitoring
- **Vercel Logs** - Real-time deployment and runtime logs
- **Database Dashboard** - Vercel Postgres monitoring
- **Custom Analytics** - Admin dashboard analytics page

---

## 🚀 Quick Reference

### Deployment Commands

```bash
# Deploy to production
cd admin-dashboard
npx vercel --prod

# Deploy preview
npx vercel

# View deployments
npx vercel ls

# View logs
npx vercel logs
```

### Environment Variables Checklist

- [ ] `POSTGRES_URL` - Database connection
- [ ] `AUTH_SECRET` - NextAuth secret (production)
- [ ] `AUTH_URL` - Production URL (`https://admin.yourdomain.com`)
- [ ] `BLOB_READ_WRITE_TOKEN` - Vercel Blob token
- [ ] `NEXT_PUBLIC_GA_ID` - (Optional) Google Analytics

### URLs to Test

- [ ] `https://admin.yourdomain.com` - Main dashboard
- [ ] `https://admin.yourdomain.com/login` - Login page
- [ ] `https://admin.yourdomain.com/projects` - Projects page
- [ ] `https://admin.yourdomain.com/analytics` - Analytics page
- [ ] `https://admin.yourdomain.com/settings` - Settings page

---

## 📚 Related Documentation

- `ADMIN_DASHBOARD_GUIDE.md` - User access and management guide
- `QUICK_START.md` - Quick setup guide
- `../DATABASE_SETUP.md` - Database setup instructions
- `../VERCEL_BLOB_SETUP.md` - Blob storage setup

---

## ✅ Deployment Checklist

### Pre-Deployment
- [ ] Code is committed to git
- [ ] Build succeeds locally
- [ ] Environment variables documented
- [ ] Database is accessible
- [ ] Blob storage is configured

### Deployment
- [ ] Vercel project created
- [ ] Root directory set to `admin-dashboard`
- [ ] Environment variables added
- [ ] Initial deployment successful
- [ ] Domain configured (if using custom domain)
- [ ] SSL certificate active

### Post-Deployment
- [ ] Admin user created
- [ ] Login works
- [ ] All features tested
- [ ] Mobile responsiveness verified
- [ ] Client access provided

---

**Last Updated:** November 2024

**Next Steps After Deployment:**
1. Create admin user for your client
2. Share login credentials securely
3. Provide user guide (`ADMIN_DASHBOARD_GUIDE.md`)
4. Monitor initial usage
5. Gather feedback for improvements

