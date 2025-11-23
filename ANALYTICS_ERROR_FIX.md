# Analytics API 500 Error - Troubleshooting Guide

## Error: `POST http://localhost:3000/api/analytics 500 (Internal Server Error)`

This error occurs when the analytics API route cannot insert events into the database.

## Common Causes

### 1. Database Table Doesn't Exist
**Most Common Issue**: The `analytics_events` table hasn't been created yet.

**Solution**:
```bash
npm run setup-db
```

This will create all required tables including `analytics_events`.

### 2. Database Connection Failed
**Check**: Database connection string is missing or incorrect.

**Solution**:
1. Verify `.env.local` has `POSTGRES_URL` or `PRISMA_DATABASE_URL`
2. Check the connection string is valid
3. Ensure the database is accessible

### 3. ENUM Types Don't Exist
**Check**: The `event_type` and `device_type` ENUMs haven't been created.

**Solution**: Run the database setup script:
```bash
npm run setup-db
```

This creates all required ENUM types.

## How to Debug

### Check Server Logs
Look at your terminal where `npm run dev` is running. You should see detailed error messages like:

```
Database insert error: {
  message: 'relation "analytics_events" does not exist',
  code: '42P01',
  ...
}
```

### Check Database Connection
```bash
# Test database connection
npm run check-env-vars
```

### Verify Table Exists
Connect to your database and run:
```sql
SELECT * FROM analytics_events LIMIT 1;
```

If you get an error, the table doesn't exist.

## Quick Fix

**Run the database setup script**:
```bash
npm run setup-db
```

This will:
1. Create all required tables (`analytics_events`, `projects`, etc.)
2. Create all ENUM types (`event_type`, `device_type`, etc.)
3. Set up indexes for performance
4. Create triggers for `updated_at` timestamps

## After Running Setup

1. Restart your dev server: `npm run dev`
2. Try triggering an analytics event (click a button, view gallery)
3. Check the browser console - the 500 error should be gone
4. Check server logs - you should see successful inserts

## Development vs Production

### Development
- Errors are logged with detailed information
- API returns detailed error messages
- Warnings shown if table doesn't exist

### Production
- Errors are logged but not exposed to users
- API fails silently (doesn't break the site)
- Analytics failures don't affect user experience

## Still Having Issues?

1. **Check server logs** for the actual error message
2. **Verify database connection** with `npm run check-env-vars`
3. **Run database setup** with `npm run setup-db`
4. **Check database schema** matches `database/schema.sql`

## Expected Behavior After Fix

✅ Analytics events are logged to console in development
✅ No 500 errors in browser console
✅ Events are stored in `analytics_events` table
✅ Admin dashboard can view analytics data

