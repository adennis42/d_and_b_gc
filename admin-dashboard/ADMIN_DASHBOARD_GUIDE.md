# Admin Dashboard Access & User Management Guide

Complete guide for accessing the admin dashboard and creating new users.

---

## 📋 Table of Contents

1. [Prerequisites](#prerequisites)
2. [Accessing the Admin Dashboard](#accessing-the-admin-dashboard)
3. [Creating Your First Admin User](#creating-your-first-admin-user)
4. [Creating Additional Users](#creating-additional-users)
5. [Troubleshooting](#troubleshooting)

---

## 🔧 Prerequisites

Before accessing the admin dashboard, ensure you have:

1. **Database Setup**
   - PostgreSQL database configured (Vercel Postgres recommended)
   - Database tables created (run `npm run setup-db` from project root)
   - Connection string available in environment variables

2. **Environment Variables**
   - `POSTGRES_URL` or `PRISMA_DATABASE_URL` - Database connection string
   - `AUTH_SECRET` - NextAuth secret (generate with: `openssl rand -base64 32`)
   - `AUTH_URL` - Admin dashboard URL (e.g., `http://localhost:3001` for local, or your Vercel URL for production)
   - `BLOB_READ_WRITE_TOKEN` - Vercel Blob Storage token (for image uploads)

3. **Dependencies Installed**
   ```bash
   cd admin-dashboard
   npm install
   ```

---

## 🌐 Accessing the Admin Dashboard

### Local Development

1. **Start the development server:**
   ```bash
   cd admin-dashboard
   npm run dev
   ```

2. **Open your browser:**
   - Navigate to: `http://localhost:3001`
   - You'll be redirected to: `http://localhost:3001/login`

3. **Login page:**
   - Enter your admin email and password
   - Click "Sign in"

### Production (Vercel)

1. **Deploy the admin dashboard:**
   - The admin dashboard should be deployed as a separate Vercel project
   - Or configured as a subdomain/path in your main Vercel project

2. **Access the dashboard:**
   - Navigate to your admin dashboard URL (e.g., `https://admin.yourdomain.com`)
   - You'll be redirected to the login page

3. **Environment Variables:**
   - Ensure all environment variables are set in Vercel project settings
   - Go to: Vercel Dashboard → Your Project → Settings → Environment Variables

---

## 👤 Creating Your First Admin User

### Step 1: Navigate to Admin Dashboard Directory

```bash
cd admin-dashboard
```

### Step 2: Ensure Environment Variables Are Set

Create or update `admin-dashboard/.env.local`:

```bash
# Database connection (same as main app)
POSTGRES_URL=postgres://...

# NextAuth configuration
AUTH_SECRET=your-secret-here
AUTH_URL=http://localhost:3001

# Vercel Blob Storage (for image uploads)
BLOB_READ_WRITE_TOKEN=vercel_blob_rw_...
```

**Generate AUTH_SECRET:**
```bash
openssl rand -base64 32
```

### Step 3: Create Your First Admin User

**Using npm script (recommended):**
```bash
npm run create-admin <email> <password> [name]
```

**Example:**
```bash
npm run create-admin admin@example.com MySecurePassword123 "Admin User"
```

**Or using tsx directly:**
```bash
npx tsx scripts/create-admin-user.ts admin@example.com MySecurePassword123 "Admin User"
```

### Step 4: Verify User Creation

The script will output:
```
✓ Creating admin user...
  Email: admin@example.com
  Name: Admin User
✓ Password hashed
✓ Admin user created/updated successfully!

  You can now log in to the admin dashboard:
    Email: admin@example.com
    Password: MySecurePassword123

  Start the admin dashboard:
    cd admin-dashboard && npm run dev
    Then visit: http://localhost:3001/login
```

### Step 5: Login

1. Start the admin dashboard (if not already running):
   ```bash
   cd admin-dashboard
   npm run dev
   ```

2. Navigate to `http://localhost:3001/login`

3. Enter your credentials:
   - **Email:** `admin@example.com`
   - **Password:** `MySecurePassword123`

4. Click "Sign in"

5. You'll be redirected to `/projects` (the main dashboard)

---

## ➕ Creating Additional Users

### Method 1: Using the Script (Same as First User)

```bash
cd admin-dashboard
npm run create-admin newuser@example.com AnotherPassword123 "New User"
```

**Notes:**
- The script uses `ON CONFLICT` - if a user with that email exists, it will update the password and name
- All users created this way have the `admin` role
- Password must be at least 8 characters

### Method 2: Direct Database Insert (Advanced)

If you need more control (e.g., different roles), you can insert directly:

```sql
-- Hash password first (use bcrypt with 10 rounds)
-- Then insert:
INSERT INTO users (email, password_hash, role, name)
VALUES ('user@example.com', '$2a$10$hashedpassword...', 'admin', 'User Name')
ON CONFLICT (email) DO UPDATE SET
  password_hash = EXCLUDED.password_hash,
  name = EXCLUDED.name,
  updated_at = CURRENT_TIMESTAMP;
```

---

## 🔐 User Management Features

### Current User Roles

- **`admin`** - Full access to all dashboard features
  - Create/edit/delete projects
  - Upload images
  - View analytics
  - Manage site settings

### User Table Schema

```sql
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  role VARCHAR(50) DEFAULT 'admin',
  name VARCHAR(255),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
```

### Updating a User's Password

Use the create-admin script - it will update the password if the email already exists:

```bash
npm run create-admin existing@example.com NewPassword123
```

### Deleting a User

```sql
DELETE FROM users WHERE email = 'user@example.com';
```

---

## 🛠️ Troubleshooting

### Error: "No Postgres connection string found"

**Solution:**
1. Ensure `POSTGRES_URL` is set in `admin-dashboard/.env.local`
2. Or ensure `PRISMA_DATABASE_URL` is set
3. Check that the `.env.local` file exists in the `admin-dashboard` directory

### Error: "Invalid email or password" on login

**Possible causes:**
1. **User doesn't exist** - Create the user first using the script
2. **Wrong password** - Reset password using the create-admin script
3. **Database connection issue** - Check `POSTGRES_URL` is correct
4. **AUTH_SECRET mismatch** - Ensure `AUTH_SECRET` matches between sessions

**Fix:**
```bash
# Recreate user with correct password
npm run create-admin user@example.com CorrectPassword123
```

### Error: "MissingSecret: Please define a `secret`"

**Solution:**
1. Add `AUTH_SECRET` to `admin-dashboard/.env.local`
2. Generate a new secret: `openssl rand -base64 32`
3. Restart the dev server

### Error: "JWTSessionError: no matching decryption secret"

**Solution:**
1. Clear browser cookies for `localhost:3001` (or your admin URL)
2. Or use an incognito/private window
3. Ensure `AUTH_SECRET` is consistent (same value in `.env.local`)

### Error: "Database query error" or connection issues

**Solution:**
1. Verify database is accessible:
   ```bash
   # Test connection (from project root)
   npm run setup-db
   ```
2. Check connection string format:
   - Should start with `postgres://` or `postgresql://`
   - Should include credentials and database name
3. Ensure database tables exist:
   ```bash
   npm run setup-db
   ```

### Admin Dashboard Not Starting

**Check:**
1. Port 3001 is available (or change port in `package.json`)
2. Dependencies installed: `npm install`
3. Environment variables set in `.env.local`
4. No syntax errors in code

**Restart:**
```bash
cd admin-dashboard
rm -rf .next
npm run dev
```

### Can't Access Dashboard After Deployment

**Check:**
1. Environment variables are set in Vercel:
   - Go to Vercel Dashboard → Project → Settings → Environment Variables
   - Ensure `AUTH_SECRET`, `POSTGRES_URL`, `BLOB_READ_WRITE_TOKEN` are set
   - Select all environments (Production, Preview, Development)
2. Admin dashboard is deployed as separate project or configured correctly
3. Database is accessible from Vercel (check Vercel Postgres settings)

---

## 📝 Quick Reference

### Create Admin User
```bash
cd admin-dashboard
npm run create-admin <email> <password> [name]
```

### Start Admin Dashboard (Local)
```bash
cd admin-dashboard
npm run dev
# Visit: http://localhost:3001/login
```

### Login Credentials Format
- **Email:** Any valid email address
- **Password:** Minimum 8 characters
- **Name:** Optional display name

### Environment Variables Required
- `POSTGRES_URL` - Database connection
- `AUTH_SECRET` - NextAuth secret (generate with `openssl rand -base64 32`)
- `AUTH_URL` - Dashboard URL (`http://localhost:3001` for local)
- `BLOB_READ_WRITE_TOKEN` - Vercel Blob token (for image uploads)

---

## 🎯 Next Steps

After creating your first admin user and logging in:

1. **Upload Images** - Go to Projects → New Project → Upload images
2. **Create Projects** - Add new gallery projects with images/videos
3. **Configure Site** - Go to Settings → Update hero image, site settings
4. **View Analytics** - Check Analytics page for visitor data
5. **Manage Content** - Edit/delete existing projects as needed

---

## 📚 Related Documentation

- `QUICK_START.md` - Quick setup guide for Vercel Blob Storage
- `ADMIN_CONTEXT.md` - Architecture and context for admin dashboard
- `../DATABASE_SETUP.md` - Database setup instructions
- `../VERCEL_BLOB_SETUP.md` - Vercel Blob Storage setup

---

## 🔒 Security Best Practices

1. **Strong Passwords**
   - Use passwords at least 12 characters long
   - Include uppercase, lowercase, numbers, and symbols
   - Don't reuse passwords

2. **AUTH_SECRET**
   - Generate a strong random secret
   - Never commit to git
   - Use different secrets for development and production

3. **Database Access**
   - Keep connection strings secure
   - Use environment variables, never hardcode
   - Restrict database access to necessary IPs (if possible)

4. **User Management**
   - Regularly review user accounts
   - Remove unused accounts
   - Use unique emails for each user

5. **HTTPS in Production**
   - Always use HTTPS for production deployments
   - Set `AUTH_URL` to your production HTTPS URL

---

**Last Updated:** November 2024

