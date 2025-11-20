# Database Setup Guide - Prisma Postgres

This guide is specific to **Prisma Postgres** (Vercel's Prisma Postgres offering).

## What Vercel Provides

When you create a Prisma Postgres database, Vercel automatically provides:

1. **`POSTGRES_URL`** - Standard PostgreSQL connection string
   - Format: `postgres://user:password@db.prisma.io:5432/postgres?sslmode=require`
   - **This is what `@vercel/postgres` uses automatically**
   - Use this for most database operations

2. **`PRISMA_DATABASE_URL`** - Prisma-specific connection string
   - May have two formats:
     - Regular: `postgres://...` (same as POSTGRES_URL)
     - Accelerate: `prisma+postgres://...` (for Prisma Accelerate)
   - Only needed if you're using Prisma ORM (we're using `@vercel/postgres`)

## Quick Setup Steps

### 1. Add to `.env.local`

Copy the exact values Vercel provided:

```bash
POSTGRES_URL="postgres://..."
PRISMA_DATABASE_URL="postgres://..."  # or prisma+postgres://... if using Accelerate
```

**Important**: Use the exact variable names Vercel provides. Don't rename them.

### 2. Verify Variables Are Set

```bash
npm run check-env
```

This will show which variables are detected.

### 3. Create Database Tables

```bash
npm run setup-db
```

This will:
- Connect using `POSTGRES_URL` (or fallback to `PRISMA_DATABASE_URL`)
- Create all tables from `database/schema.sql`
- Set up indexes and triggers

### 4. Migrate Existing Data

```bash
npm run migrate-db
```

This will:
- Read projects from `src/lib/gallery-data.ts`
- Insert them into the database
- Preserve all images, videos, and metadata

### 5. Test Connection

```bash
npm run dev
```

Visit `http://localhost:3000/gallery` - projects should load from the database.

## How It Works

### `@vercel/postgres` Package

The `@vercel/postgres` package automatically reads `POSTGRES_URL` from `process.env`. Since Vercel provides this exact variable name, **no mapping is needed**.

### Setup Scripts

The setup scripts (`setup-database.ts`, `migrate-to-database.ts`) check multiple variable names in order:
1. `POSTGRES_URL_NON_POOLING` (not provided by Prisma Postgres)
2. `POSTGRES_URL` ✅ **This is what you have**
3. `PRISMA_DATABASE_URL` (fallback)
4. `DATABASE_URL` (fallback)

Since `POSTGRES_URL` is provided, everything will work automatically.

## Prisma Accelerate (Optional)

If you see a `prisma+postgres://` URL in `PRISMA_DATABASE_URL`, that's Prisma Accelerate. You don't need it for this project since we're using `@vercel/postgres` directly, not Prisma ORM.

However, if you want to use Prisma Accelerate in the future:
- Install: `npm install @prisma/extension-accelerate`
- Use the `prisma+postgres://` URL
- Extend Prisma Client with Accelerate

## Troubleshooting

### "No Postgres environment variables found"

- Check `.env.local` exists and has the variables
- Verify variable names match exactly (case-sensitive)
- Run `npm run check-env` to see what's detected

### Connection Errors

- Verify `POSTGRES_URL` is set correctly
- Check the connection string format (should start with `postgres://`)
- Ensure SSL mode is set (`?sslmode=require`)

### Migration Errors

- Make sure you ran `npm run setup-db` first
- Check database tables exist: The setup script should create them
- Verify `POSTGRES_URL` is accessible

## Differences from Other Providers

**Prisma Postgres** provides:
- ✅ `POSTGRES_URL` (standard)
- ✅ `PRISMA_DATABASE_URL` (Prisma-specific)
- ❌ `POSTGRES_URL_NON_POOLING` (not provided)

**Other providers** (Neon, Supabase) may provide:
- `POSTGRES_URL`
- `POSTGRES_URL_NON_POOLING`
- `DATABASE_URL`

The setup scripts handle all variations automatically.

## Next Steps

After setup:
1. ✅ Database tables created
2. ✅ Data migrated
3. ✅ Gallery loads from database
4. Set up admin dashboard (see `admin-dashboard/ADMIN_CONTEXT.md`)
5. Create admin user: `cd admin-dashboard && npm run create-admin <email> <password>`

