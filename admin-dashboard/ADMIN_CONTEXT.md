# Admin Dashboard Context

## Purpose

The admin dashboard is a separate Next.js application that enables authenticated users to:
- Manage gallery projects (create, edit, delete)
- Upload and optimize images
- Link YouTube videos to projects
- View comprehensive analytics about website usage

## Connection to Main App

The admin dashboard shares resources with the main contractor website:

- **Database**: Same PostgreSQL database (Vercel Postgres)
  - Reads/writes to `projects`, `project_images`, `project_videos` tables
  - Reads from `analytics_events` table for analytics

- **Blob Storage**: Same Vercel Blob Storage
  - Uploads images to shared blob storage
  - Images are accessible from main app via public URLs

- **Types**: Shared TypeScript types
  - `Project`, `Video` interfaces match main app
  - Ensures consistency between apps

## Main App Structure

The main contractor website (`/src`) has the following structure:

```
/src
  /app
    /(routes)          # Public routes (home, about, gallery, schedule)
    /api               # API routes (contact, analytics)
  /components
    /gallery          # Gallery components (Grid, Lightbox, etc.)
    /layout           # Header, Footer, Navigation
    /forms            # Contact and schedule forms
  /lib
    /gallery-db.ts    # Database queries for gallery
    /analytics.ts     # Analytics tracking functions
    /db.ts            # Database client
```

## Database Schema

### Tables

- **projects**: Main project data
  - `id` (UUID): Primary key
  - `title`, `category`, `description`, `featured`, `order`

- **project_images**: Images for projects
  - `id` (UUID): Primary key
  - `project_id` (UUID): Foreign key to projects
  - `url`, `alt`, `width`, `height`, `blur_data_url`, `order`

- **project_videos**: Videos for projects
  - `id` (UUID): Primary key
  - `project_id` (UUID): Foreign key to projects
  - `video_id` (YouTube ID), `alt`, `width`, `height`, `thumbnail_url`, `order`

- **analytics_events**: User interaction tracking
  - `id` (UUID): Primary key
  - `event_type`, `page_path`, `referrer`, `user_agent`, `device_type`, `metadata`

- **users**: Admin user accounts
  - `id` (UUID): Primary key
  - `email`, `password_hash`, `role`, `name`

See `../database/schema.sql` for complete schema.

## API Endpoints

### Admin Dashboard API Routes

- `POST /api/upload`: Upload and optimize images
  - Requires authentication
  - Accepts multipart/form-data
  - Returns: `{ url, width, height, blurDataURL }`

- `GET /api/projects`: List all projects (future)
- `GET /api/projects/[id]`: Get single project (future)
- `POST /api/projects`: Create project (future)
- `PUT /api/projects/[id]`: Update project (future)
- `DELETE /api/projects/[id]`: Delete project (future)

- `GET /api/analytics/overview`: Get analytics overview (future)
- `GET /api/analytics/traffic`: Get traffic sources (future)
- `GET /api/analytics/gallery`: Get gallery-specific analytics (future)

### Main App API Routes

- `POST /api/analytics`: Track analytics events
  - Public endpoint (no auth required)
  - Stores events in `analytics_events` table

## Authentication

### How Auth Works

- **Provider**: NextAuth.js v5 (Credentials provider)
- **Strategy**: JWT sessions
- **Storage**: JWT tokens (no database sessions)
- **Password Hashing**: bcryptjs

### User Management

To create an admin user:

```sql
INSERT INTO users (email, password_hash, role, name)
VALUES (
  'admin@example.com',
  '$2a$10$hashedpassword', -- Use bcrypt to hash password
  'admin',
  'Admin User'
);
```

Or use a script:
```typescript
import bcrypt from 'bcryptjs';
const hash = await bcrypt.hash('password', 10);
// Insert hash into database
```

### Environment Variables

Required for admin dashboard:
- `POSTGRES_URL`: Database connection string
- `BLOB_READ_WRITE_TOKEN`: Vercel Blob upload token
- `NEXTAUTH_SECRET`: Secret key for JWT signing
- `NEXTAUTH_URL`: Admin dashboard URL (e.g., `https://admin.yourdomain.com`)

## Image Upload Flow

1. User selects image(s) in admin dashboard
2. Frontend sends to `POST /api/upload`
3. Server:
   - Validates file type
   - Optimizes image (resize to 1920x1440, convert to WebP)
   - Generates blur placeholder
   - Uploads to Vercel Blob Storage
   - Returns public URL and metadata
4. Frontend stores URL in project
5. Image is accessible from main app via public URL

## Video Linking Flow

1. User enters YouTube URL in admin dashboard
2. Frontend extracts video ID from URL
3. Fetches thumbnail from YouTube API (optional)
4. Stores video metadata in `project_videos` table
5. Main app displays video using YouTube embed

## Analytics Tracking

### Event Types

- `page_view`: Page visits
- `image_click`: Image clicks in gallery
- `video_play`: Video plays
- `filter_use`: Gallery filter usage
- `form_submit`: Form submissions
- `cta_click`: Call-to-action clicks
- `external_link_click`: External link clicks

### How It Works

1. Main app tracks events via `trackGalleryView()`, `trackFormSubmission()`, etc.
2. Events sent to `POST /api/analytics` (server-side)
3. Stored in `analytics_events` table with metadata
4. Admin dashboard queries database to display analytics

## Future Enhancements

- User roles (admin, editor, viewer)
- Image bulk upload/import
- Project templates
- Scheduled publishing
- Image editing (crop, filters)
- Advanced analytics (funnels, cohorts)
- Export analytics data (CSV, PDF reports)
- Email notifications for form submissions
- Project versioning/history

## Development

### Running Admin Dashboard

```bash
cd admin-dashboard
npm install
npm run dev
# Runs on http://localhost:3001
```

### Running Main App

```bash
npm install
npm run dev
# Runs on http://localhost:3000
```

Both apps can run simultaneously on different ports.

## Deployment

### Main App

Deploy to Vercel as usual. Environment variables:
- `POSTGRES_URL`
- `BLOB_READ_WRITE_TOKEN` (if needed)
- `NEXT_PUBLIC_GA_ID`

### Admin Dashboard

Deploy as separate Vercel project:
- Same `POSTGRES_URL` as main app
- `BLOB_READ_WRITE_TOKEN` for uploads
- `NEXTAUTH_SECRET` and `NEXTAUTH_URL`
- Optional custom domain: `admin.yourdomain.com`

