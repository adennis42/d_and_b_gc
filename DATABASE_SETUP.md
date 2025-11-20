# Database Setup Guide

This guide walks you through setting up PostgreSQL database for the contractor website gallery system.

> **Note**: If you're using **Prisma Postgres**, see `DATABASE_SETUP_PRISMA.md` for provider-specific instructions.

## Prerequisites

- Vercel account (free tier works)
- Node.js installed locally
- Access to your project repository

## Step 1: Create Vercel Postgres Database

1. **Go to Vercel Dashboard**
   - Navigate to [vercel.com](https://vercel.com)
   - Sign in to your account

2. **Create or Select Your Project**
   - If you haven't deployed the main app yet, you can create a new project
   - Or select your existing contractor website project

3. **Add Postgres Database**
   - Go to your project dashboard
   - Click on the **Storage** tab
   - Click **Create Database**
   - Select **Postgres**
   - Choose a name (e.g., `contractor-db`)
   - Select a region (choose closest to your users)
   - Click **Create**

4. **Get Connection Strings**
   - After creation, Vercel will provide connection strings
   - **Variable names may vary** depending on which provider you chose:
     - **Neon/Supabase/Prisma Postgres**: Usually `POSTGRES_URL`, `POSTGRES_URL_NON_POOLING`, `POSTGRES_PRISMA_URL`
     - **Some providers**: May use `DATABASE_URL` or provider-specific names
   - **Copy ALL connection strings** shown - you'll need them in the next steps
   - **Note**: The setup scripts support multiple variable name patterns automatically

## Step 2: Set Up Environment Variables Locally

1. **Create `.env.local` file** (if it doesn't exist)
   ```bash
   touch .env.local
   ```

2. **Add database connection strings**
   ```bash
   # Add to .env.local - use the EXACT variable names Vercel provides
   # Common names (use what Vercel shows you):
   POSTGRES_URL=your-postgres-url-here
   POSTGRES_URL_NON_POOLING=your-non-pooling-url-here
   POSTGRES_PRISMA_URL=your-prisma-url-here
   
   # OR if Vercel provides different names (e.g., Neon/Supabase):
   DATABASE_URL=your-database-url-here
   # etc.
   ```

   **Important**: Use the EXACT variable names that Vercel provides in your dashboard.
   The setup scripts will automatically detect and use whichever variables you provide.

3. **Verify `.env.local` is in `.gitignore`**
   - Make sure `.env.local` is listed in `.gitignore` (it should be by default)
   - Never commit environment variables to git!

## Step 3: Install Database Tools (Optional but Recommended)

You have two options for running SQL:

### Option A: Using psql (PostgreSQL CLI)

1. **Install PostgreSQL** (if not already installed)
   - **macOS**: `brew install postgresql`
   - **Linux**: `sudo apt-get install postgresql-client` (Ubuntu/Debian)
   - **Windows**: Download from [postgresql.org](https://www.postgresql.org/download/windows/)

2. **Test connection**
   ```bash
   psql $POSTGRES_URL_NON_POOLING
   ```
   If connected, you'll see a prompt like `postgres=>`. Type `\q` to quit.

### Option B: Using Node.js Script (Easier)

We'll create a script to run the schema - no need to install PostgreSQL locally.

## Step 4: Create Database Schema

### Option A: Using psql

1. **Run the schema SQL file**
   ```bash
   psql $POSTGRES_URL_NON_POOLING < database/schema.sql
   ```

2. **Verify tables were created**
   ```bash
   psql $POSTGRES_URL_NON_POOLING -c "\dt"
   ```
   You should see tables: `projects`, `project_images`, `project_videos`, `analytics_events`, `users`

### Option B: Using Node.js Script (Recommended)

1. **Create a script to run the schema**
   ```bash
   # Create scripts/setup-database.ts
   ```

2. **Run the script** (we'll create this below)

Let me create a setup script for you:

## Step 5: Run Migration Script

1. **Ensure environment variable is set**
   ```bash
   # Verify POSTGRES_URL is in .env.local
   cat .env.local | grep POSTGRES_URL
   ```

2. **Run the migration script**
   ```bash
   npm run migrate-db
   ```

   This will:
   - Read all projects from `src/lib/gallery-data.ts`
   - Insert them into the database
   - Migrate all images and videos
   - Show progress and verification

3. **Verify migration**
   - The script will output counts of migrated projects, images, and videos
   - Check that the numbers match your expectations

## Step 6: Verify Database Setup

### Check Tables Exist

```bash
# Using psql
psql $POSTGRES_URL_NON_POOLING -c "\dt"

# Or using Node.js (create a quick test script)
node -e "
const { sql } = require('@vercel/postgres');
(async () => {
  const result = await sql\`SELECT table_name FROM information_schema.tables WHERE table_schema = 'public'\`;
  console.log('Tables:', result.rows.map(r => r.table_name));
})();
"
```

### Check Data Was Migrated

```bash
# Using psql
psql $POSTGRES_URL_NON_POOLING -c "SELECT COUNT(*) FROM projects;"
psql $POSTGRES_URL_NON_POOLING -c "SELECT COUNT(*) FROM project_images;"
psql $POSTGRES_URL_NON_POOLING -c "SELECT COUNT(*) FROM project_videos;"
```

### Test Database Connection in App

1. **Start the dev server**
   ```bash
   npm run dev
   ```

2. **Visit the gallery page**
   - Go to `http://localhost:3000/gallery`
   - The gallery should load projects from the database
   - If you see projects, the database connection is working!

## Step 7: Create Admin User (For Admin Dashboard)

1. **Install bcryptjs** (if not already installed)
   ```bash
   cd admin-dashboard
   npm install bcryptjs @types/bcryptjs
   ```

2. **Create a script to hash password and create user**

   Create `admin-dashboard/scripts/create-admin-user.ts`:

   ```typescript
   import bcrypt from 'bcryptjs';
   import { sql } from '../src/lib/db';

   async function createAdminUser() {
     const email = process.argv[2];
     const password = process.argv[3];
     const name = process.argv[4] || 'Admin User';

     if (!email || !password) {
       console.error('Usage: tsx scripts/create-admin-user.ts <email> <password> [name]');
       process.exit(1);
     }

     const passwordHash = await bcrypt.hash(password, 10);

     try {
       await sql`
         INSERT INTO users (email, password_hash, role, name)
         VALUES (${email}, ${passwordHash}, 'admin', ${name})
         ON CONFLICT (email) DO UPDATE SET
           password_hash = EXCLUDED.password_hash,
           name = EXCLUDED.name
       `;
       console.log(`✓ Admin user created: ${email}`);
     } catch (error) {
       console.error('✗ Error creating user:', error);
       process.exit(1);
     }
   }

   createAdminUser();
   ```

3. **Run the script**
   ```bash
   cd admin-dashboard
   npx tsx scripts/create-admin-user.ts admin@example.com yourpassword "Admin Name"
   ```

4. **Test login**
   - Start admin dashboard: `cd admin-dashboard && npm run dev`
   - Go to `http://localhost:3001/login`
   - Log in with the credentials you just created

## Step 8: Set Up Environment Variables in Vercel

For production deployment:

1. **Go to Vercel Project Settings**
   - Navigate to your project on Vercel
   - Go to **Settings** → **Environment Variables**

2. **Add Variables**
   - `POSTGRES_URL` - Your Postgres connection string
   - `POSTGRES_PRISMA_URL` - Prisma connection string (if using)
   - `POSTGRES_URL_NON_POOLING` - Non-pooling connection (for migrations)
   - `BLOB_READ_WRITE_TOKEN` - Vercel Blob token (for image uploads)
   - `NEXT_PUBLIC_GA_ID` - Google Analytics ID (if using)

3. **Select Environments**
   - Check **Production**, **Preview**, and **Development** as needed

4. **Redeploy**
   - After adding variables, trigger a new deployment
   - Or push a commit to trigger automatic deployment

## Troubleshooting

### Connection Errors

**Error: "Connection refused"**
- Check that `POSTGRES_URL` is set correctly
- Verify the database is created in Vercel
- Make sure you're using the correct connection string

**Error: "relation does not exist"**
- Run the schema SQL file: `psql $POSTGRES_URL_NON_POOLING < database/schema.sql`
- Or use the setup script we'll create

**Error: "password authentication failed"**
- Verify you copied the entire connection string correctly
- Check for extra spaces or line breaks

### Migration Errors

**Error: "Cannot find module '@vercel/postgres'"**
- Run `npm install` to install dependencies
- Make sure `@vercel/postgres` is in `package.json`

**Error: "Projects already exist"**
- The migration script will warn if projects exist
- You can clear existing data (be careful!):
  ```sql
  TRUNCATE TABLE project_images, project_videos, projects CASCADE;
  ```

### Gallery Not Loading

**Gallery shows empty or errors**
- Check browser console for errors
- Verify database connection: Check `POSTGRES_URL` is set
- Check server logs: Look for database query errors
- Verify migration ran successfully: Check project count in database

## Quick Reference Commands

```bash
# Set environment variable (temporary)
export POSTGRES_URL="your-connection-string"

# Run schema
psql $POSTGRES_URL_NON_POOLING < database/schema.sql

# Run migration
npm run migrate-db

# Check tables
psql $POSTGRES_URL_NON_POOLING -c "\dt"

# Count projects
psql $POSTGRES_URL_NON_POOLING -c "SELECT COUNT(*) FROM projects;"

# View projects
psql $POSTGRES_URL_NON_POOLING -c "SELECT id, title, category FROM projects LIMIT 5;"
```

## Next Steps

After database setup:
1. ✅ Test gallery page loads from database
2. ✅ Set up admin dashboard (see `admin-dashboard/ADMIN_CONTEXT.md`)
3. ✅ Create admin user for dashboard access
4. ✅ Test image upload functionality
5. ✅ Verify analytics tracking is working

## Need Help?

- Check `MIGRATION_GUIDE.md` for migration details
- Check `admin-dashboard/ADMIN_CONTEXT.md` for admin dashboard info
- Review Vercel Postgres docs: https://vercel.com/docs/storage/vercel-postgres

