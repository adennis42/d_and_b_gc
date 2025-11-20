# Caching Strategy Documentation

This document outlines the caching strategy implemented to prevent stale code while maintaining optimal performance.

## Overview

We use a **two-tier caching strategy**:
1. **Development**: No caching - always fresh code
2. **Production**: Smart caching with content-based invalidation

## Development Mode

### Strategy: Zero Cache
- **All HTML/JS**: `no-store, no-cache, must-revalidate`
- **Static assets**: Still cached (they have content hashes)
- **Purpose**: Prevent stale code during development

### Headers Applied:
```
Cache-Control: no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0
Pragma: no-cache
Expires: 0
ETag: "dev-{timestamp}" (changes on every request)
```

## Production Mode

### Strategy: Content-Based Caching

#### 1. HTML Pages
- **Cache**: `public, s-maxage=60, stale-while-revalidate=300`
- **Meaning**: 
  - CDN cache for 60 seconds
  - Serve stale content for up to 300 seconds while revalidating
- **Why**: Balance between freshness and performance

#### 2. Static Assets (with Content Hashes)
- **Cache**: `public, max-age=31536000, immutable`
- **Examples**: `/_next/static/chunks/main-abc123.js`
- **Why**: Content hash in filename = unique file = safe to cache forever
- **Next.js automatically**: Adds content hashes to all static assets

#### 3. Images
- **Cache**: `public, max-age=31536000, immutable`
- **Why**: Images don't change frequently, and we optimize them

#### 4. API Routes
- **Cache**: `no-store, no-cache, must-revalidate`
- **Why**: API responses are dynamic and should never be cached

## Build ID Strategy

We use a **timestamp + git commit hash** for build IDs:
- Format: `{timestamp}-{git-hash}`
- Example: `1734567890-a1b2c3d`
- **Why**: Ensures cache invalidation when code changes

## How It Works

### Development
1. Every request gets fresh code
2. No browser caching of HTML/JS
3. Static assets still cached (they have hashes)

### Production
1. **First Visit**: 
   - HTML fetched from server
   - Static assets fetched (cached for 1 year)
   - Page loads

2. **Subsequent Visits** (within 60s):
   - HTML served from CDN cache
   - Static assets served from browser cache
   - Fast load

3. **After 60s**:
   - HTML revalidated in background
   - If changed, new HTML fetched
   - If unchanged, cached version used
   - Static assets still from cache (immutable)

4. **After Code Deploy**:
   - New build = new content hashes
   - Old assets cached (won't be requested)
   - New assets fetched with new hashes
   - No stale code!

## Cache Invalidation

### Automatic (Content-Based)
- **Static assets**: Content hash in filename = automatic invalidation
- **Build ID**: Changes on every build = HTML cache invalidation

### Manual (If Needed)
```bash
# Clear Next.js cache
rm -rf .next

# Clear browser cache
# Chrome: Cmd+Shift+Delete (Mac) or Ctrl+Shift+Delete (Windows)
# Or: Hard refresh (Cmd+Shift+R / Ctrl+Shift+R)
```

## Testing Cache Behavior

### Development
```bash
npm run dev
# Open browser DevTools > Network tab
# Check "Disable cache" is OFF
# Reload page - should see "no-cache" headers
# Code should always be fresh
```

### Production
```bash
npm run build
npm run start
# Check headers in Network tab
# HTML: s-maxage=60
# Static assets: max-age=31536000, immutable
```

## Troubleshooting

### Stale Code in Browser

**Development**:
1. Hard refresh: `Cmd+Shift+R` (Mac) or `Ctrl+Shift+R` (Windows)
2. Clear browser cache
3. Check `.next` folder is cleared: `rm -rf .next`

**Production**:
1. Verify build ID changed: Check `/_next/static/BUILD_ID`
2. Hard refresh browser
3. Check CDN cache is cleared (Vercel: redeploy)

### Too Much Caching

**Development**: Already disabled - should not happen

**Production**: 
- HTML cache is only 60 seconds
- Static assets are immutable (by design)
- If needed, reduce `s-maxage` in `next.config.ts`

## Best Practices

1. **Always use content hashes**: Next.js does this automatically
2. **Never cache API routes**: Already configured
3. **Use proper cache headers**: Already configured
4. **Test in production mode**: `npm run build && npm run start`
5. **Monitor cache hit rates**: Use analytics/Vercel dashboard

## Configuration Files

- `next.config.ts`: Cache headers configuration
- `src/middleware.ts`: Runtime cache control
- `.gitignore`: Ensures `.next` is not committed

## References

- [Next.js Caching](https://nextjs.org/docs/app/building-your-application/caching)
- [Cache-Control Headers](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Cache-Control)
- [Vercel Caching](https://vercel.com/docs/concepts/edge-network/caching)

