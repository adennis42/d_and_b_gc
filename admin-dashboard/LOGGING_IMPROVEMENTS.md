# Logging Improvements

Comprehensive logging has been added to all admin dashboard API routes for better debugging and monitoring.

## What Was Improved

### 1. Centralized Logger Utility (`src/lib/logger.ts`)

Created a structured logging utility that provides:
- **Consistent log format** with timestamps and log levels
- **Structured context** including user info, operation type, and metadata
- **Operation tracking** with start/success/failure methods
- **Error details** with stack traces and error types
- **Performance metrics** with operation duration tracking

### 2. Image Upload Logging (`/api/upload`)

**Before**: Basic error logging only
**After**: 
- Logs upload start with user info and file metadata
- Logs file validation failures with details
- Logs successful uploads with file size, dimensions, and duration
- Logs errors with blob token status and error details

**Example logs**:
```
[2024-01-15T10:30:00.000Z] [INFO] Starting image upload {"userId":"123","userEmail":"admin@example.com","operation":"image upload"}
[2024-01-15T10:30:01.500Z] [INFO] Successfully completed image upload {"userId":"123","durationMs":1500,"filename":"https://..."}
```

### 3. Project Operations Logging

#### Create Project (`POST /api/projects`)
- Logs project creation start with title, category, image/video counts
- Logs validation failures with missing field details
- Logs successful creation with project ID and metadata
- Logs errors with full context

#### Update Project (`PUT /api/projects/[id]`)
- Logs update start with fields being changed
- Logs image/video replacement operations
- Logs successful updates with project details
- Logs errors with project ID context

#### Delete Project (`DELETE /api/projects/[id]`)
- Logs deletion start with project title and category
- Logs successful deletion with project details
- Logs errors with project ID context

#### Fetch Projects (`GET /api/projects` and `GET /api/projects/[id]`)
- Logs fetch operations with user context
- Logs successful fetches with result counts
- Logs errors with operation context

### 4. Banner Operations Logging

#### Create Banner (`POST /api/banners`)
- Logs banner creation with title, active status, TTL
- Logs validation failures
- Logs successful creation with banner ID

#### Update Banner (`PUT /api/banners/[id]`)
- Logs update start with fields being changed
- Logs successful updates with banner details
- Logs errors with banner ID context

#### Delete Banner (`DELETE /api/banners/[id]`)
- Logs deletion with banner title and status
- Logs successful deletion
- Logs errors with banner ID context

#### Fetch Banners (`GET /api/banners` and `GET /api/banners/[id]`)
- Logs fetch operations
- Logs successful fetches with counts
- Logs errors with context

## Log Format

All logs follow this structured format:

```
[TIMESTAMP] [LEVEL] Message {JSON_CONTEXT}
```

**Log Levels**:
- `INFO` - Normal operations (start, success)
- `WARN` - Validation failures, unauthorized attempts
- `ERROR` - Operation failures
- `DEBUG` - Detailed information (only in development)

**Context Includes**:
- `userId` - User ID from session
- `userEmail` - User email from session
- `operation` - Operation being performed
- `resourceId` - ID of resource being operated on
- `metadata` - Additional operation-specific data
- `durationMs` - Operation duration in milliseconds

## Benefits

1. **Better Debugging**: Detailed context helps identify issues quickly
2. **Performance Monitoring**: Duration tracking shows slow operations
3. **Security Auditing**: User info logged for all operations
4. **Error Tracking**: Structured error logs with stack traces
5. **Operation Visibility**: Success logs confirm operations completed

## Viewing Logs

### In Development
Logs appear in your terminal/console when running `npm run dev`

### In Production (Vercel)
1. Go to Vercel Dashboard
2. Select your admin-dashboard project
3. Go to **Deployments** → Select a deployment
4. Click **View Function Logs** or **View Build Logs**

## Example Log Output

### Successful Image Upload
```
[2024-01-15T10:30:00.000Z] [INFO] Starting image upload {"userId":"abc123","userEmail":"admin@example.com","operation":"image upload","metadata":{"hasSession":true}}
[2024-01-15T10:30:00.500Z] [DEBUG] Starting image upload and optimization {"userId":"abc123","metadata":{"originalFileName":"photo.jpg","fileSize":2048576,"fileType":"image/jpeg","targetFilename":"gallery/1705315800000-photo.webp"}}
[2024-01-15T10:30:01.500Z] [INFO] Successfully completed image upload {"userId":"abc123","userEmail":"admin@example.com","operation":"image upload","metadata":{"filename":"https://...","width":1920,"height":1440,"durationMs":1500,"fileSize":2048576}}
```

### Failed Project Creation
```
[2024-01-15T10:35:00.000Z] [INFO] Starting create project {"userId":"abc123","userEmail":"admin@example.com","operation":"create project","metadata":{"title":"Kitchen Remodel","category":"kitchen","imageCount":3}}
[2024-01-15T10:35:00.100Z] [WARN] Project creation failed: missing required fields {"userId":"abc123","metadata":{"hasTitle":true,"hasCategory":false}}
[2024-01-15T10:35:00.150Z] [ERROR] Failed to create project {"userId":"abc123","operation":"create project","metadata":{"durationMs":150}}
```

### Successful Project Deletion
```
[2024-01-15T10:40:00.000Z] [INFO] Starting delete project {"userId":"abc123","userEmail":"admin@example.com","operation":"delete project","resourceId":"proj-123","metadata":{"projectTitle":"Kitchen Remodel","projectCategory":"kitchen"}}
[2024-01-15T10:40:00.200Z] [INFO] Successfully completed delete project {"userId":"abc123","userEmail":"admin@example.com","operation":"delete project","resourceId":"proj-123","metadata":{"projectId":"proj-123","projectTitle":"Kitchen Remodel","durationMs":200}}
```

## Future Enhancements

Potential improvements:
- Log aggregation service integration (e.g., LogRocket, Sentry)
- Request ID tracking for tracing requests across services
- Rate limiting logs
- Database query performance logging
- File size/type statistics

