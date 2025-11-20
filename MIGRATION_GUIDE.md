# Migration Guide: Static Gallery Data to Database

## Overview

The gallery system has been migrated from a static TypeScript file (`gallery-data.ts`) to a PostgreSQL database. This enables dynamic content management through the admin dashboard.

## Why Migration Happened

- **Dynamic Content Management**: Admin dashboard allows non-technical users to manage gallery content
- **Scalability**: Database can handle large amounts of data efficiently
- **Analytics**: Server-side event tracking for comprehensive analytics
- **Performance**: Database queries can be optimized and cached

## Database Schema

The database consists of the following tables:

- **projects**: Main project information (title, category, description, featured status)
- **project_images**: Images associated with projects (URL, alt text, dimensions, blur placeholder)
- **project_videos**: YouTube videos associated with projects (video ID, alt text, dimensions)
- **analytics_events**: User interaction tracking (page views, clicks, form submissions)
- **users**: Admin user accounts for authentication

See `database/schema.sql` for the complete schema definition.

## Migration Process

### 1. Set Up Database

1. Create a Vercel Postgres database in your Vercel project
2. Run the schema SQL file:
   ```bash
   # Connect to your database and run:
   psql $POSTGRES_URL < database/schema.sql
   ```

### 2. Run Migration Script

1. Set environment variable:
   ```bash
   export POSTGRES_URL="your-postgres-connection-string"
   ```

2. Run migration:
   ```bash
   npx tsx scripts/migrate-to-database.ts
   ```

3. Verify migration:
   - Check that all projects, images, and videos were migrated
   - Verify counts match the original data

### 3. Update Environment Variables

Add to `.env.local`:
```
POSTGRES_URL=your-postgres-connection-string
BLOB_READ_WRITE_TOKEN=your-vercel-blob-token
```

## How to Add New Projects

**Use the Admin Dashboard** (recommended):

1. Access admin dashboard at `/admin` or separate domain
2. Log in with admin credentials
3. Click "New Project"
4. Fill in project details
5. Upload images (automatically optimized)
6. Add YouTube videos
7. Save project

**Manual Database Insert** (for developers):

```sql
-- Insert project
INSERT INTO projects (id, title, category, description, featured, "order")
VALUES (gen_random_uuid(), 'Project Title', 'kitchen', 'Description', false, 0)
RETURNING id;

-- Insert images (using project_id from above)
INSERT INTO project_images (project_id, url, alt, width, height, blur_data_url, "order")
VALUES ('project-uuid', '/images/gallery/kitchens/image.webp', 'Alt text', 1920, 1440, 'base64-blur', 0);
```

## How to Update Existing Projects

**Use the Admin Dashboard**:

1. Navigate to Projects list
2. Click on project to edit
3. Update fields, images, or videos
4. Save changes

**Manual Database Update**:

```sql
-- Update project
UPDATE projects
SET title = 'New Title', description = 'New Description', featured = true
WHERE id = 'project-uuid';

-- Update image order
UPDATE project_images
SET "order" = 1
WHERE id = 'image-uuid';
```

## Backup Procedures

### Database Backup

Vercel Postgres provides automatic backups. For manual backups:

```bash
# Export database
pg_dump $POSTGRES_URL > backup.sql

# Restore database
psql $POSTGRES_URL < backup.sql
```

### Image Backup

Images are stored in Vercel Blob Storage. To backup:

1. Use Vercel dashboard to download blob contents
2. Or use Vercel CLI: `vercel blob list`

## Troubleshooting

### Gallery Not Loading

1. Check database connection: `POSTGRES_URL` environment variable
2. Verify schema is created: Check if tables exist
3. Check migration: Ensure data was migrated successfully

### Admin Dashboard Not Working

1. Check authentication: Verify `NEXTAUTH_SECRET` and `NEXTAUTH_URL`
2. Check database connection: Admin dashboard uses same database
3. Verify user exists: Create admin user if needed

### Images Not Displaying

1. Check Vercel Blob: Verify `BLOB_READ_WRITE_TOKEN` is set
2. Check image URLs: Ensure URLs are accessible
3. Check Next.js Image: Verify image optimization is working

## Rollback Plan

If you need to rollback to static data:

1. Keep `gallery-data.ts` as fallback
2. Update `GalleryDataLoader.tsx` to use static data:
   ```typescript
   import { getAllProjects } from '@/lib/gallery-data';
   ```
3. Remove database queries

## Future Enhancements

- Image bulk upload/import
- Project templates
- Scheduled publishing
- Image editing (crop, filters)
- Advanced analytics (funnels, cohorts)
- Export analytics data (CSV, PDF reports)

