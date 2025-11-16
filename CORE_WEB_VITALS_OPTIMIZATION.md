# Core Web Vitals Optimization Guide

This document outlines the optimizations implemented to improve Core Web Vitals scores (LCP, FID, CLS).

## Core Web Vitals Metrics

### 1. Largest Contentful Paint (LCP) - Target: < 2.5s
**Measures**: Loading performance - how quickly the main content loads

**Optimizations Applied**:
- ✅ **Font Preloading**: Critical fonts (Geist Sans) configured with `preload: true` and `display: "swap"`
- ✅ **Image Optimization**: All images use Next.js `<Image>` component with:
  - AVIF and WebP format support
  - Proper `sizes` attributes for responsive loading
  - Blur placeholders to prevent layout shift
  - Priority loading for above-the-fold images
- ✅ **Hero Image**: Uses `priority` flag for immediate loading
- ✅ **Caching**: Static assets cached for 1 year (immutable)

### 2. First Input Delay (FID) - Target: < 100ms
**Measures**: Interactivity - how quickly the page responds to user input

**Optimizations Applied**:
- ✅ **Code Splitting**: Automatic via Next.js App Router
- ✅ **Client Component Optimization**: Only interactive components are client-side
- ✅ **Package Optimization**: Experimental `optimizePackageImports` for lucide-react and radix-ui
- ✅ **Minimal JavaScript**: Server components by default, client components only when needed
- ✅ **SWC Minification**: Enabled for smaller bundle sizes

### 3. Cumulative Layout Shift (CLS) - Target: < 0.1
**Measures**: Visual stability - how much content shifts during loading

**Optimizations Applied**:
- ✅ **Image Dimensions**: All images have explicit `width` and `height` attributes
- ✅ **Aspect Ratios**: Gallery images use `aspect-[4/3]` to reserve space
- ✅ **Loading Skeletons**: Form and gallery skeletons prevent layout shift
- ✅ **Blur Placeholders**: All images use blur data URLs for smooth loading
- ✅ **Font Loading**: `display: "swap"` prevents invisible text during font load

## Implemented Optimizations

### 1. Loading Skeletons

#### Gallery Skeleton (`src/components/gallery/GallerySkeleton.tsx`)
- ✅ Already implemented
- Shows placeholder cards while gallery loads
- Matches final layout to prevent CLS

#### Form Skeleton (`src/components/forms/FormSkeleton.tsx`)
- ✅ **NEW**: Created form skeleton component
- Shows placeholder fields while form loads
- Prevents layout shift on form-heavy pages

**Usage**:
```tsx
<Suspense fallback={<FormSkeleton />}>
  <ContactForm />
</Suspense>
```

### 2. Font Optimization (`src/app/layout.tsx`)

**Changes**:
- ✅ `display: "swap"` - Text remains visible during font load
- ✅ `preload: true` for critical font (Geist Sans)
- ✅ `preload: false` for non-critical font (Geist Mono)

**Benefits**:
- Prevents FOIT (Flash of Invisible Text)
- Improves LCP by loading fonts faster
- Reduces CLS from font loading

### 3. Image Optimization (`next.config.ts`)

**Configuration**:
```typescript
images: {
  formats: ["image/avif", "image/webp"], // Modern formats
  minimumCacheTTL: 60 * 60 * 24 * 30, // 30 days
  deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
  imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
}
```

**Benefits**:
- AVIF format: ~50% smaller than JPEG
- WebP fallback: ~30% smaller than JPEG
- Responsive sizes reduce bandwidth
- Proper caching improves repeat visits

### 4. Caching Headers (`next.config.ts`)

**Static Assets** (1 year cache):
- `/images/*` - Gallery and site images
- `/_next/static/*` - Next.js static assets
- `/_next/image` - Optimized images
- `/fonts/*` - Font files

**Benefits**:
- Faster repeat visits
- Reduced server load
- Better Core Web Vitals scores

### 5. Suspense Boundaries

**Implemented**:
- ✅ Gallery page: `<Suspense fallback={<GallerySkeleton />}>`
- ✅ Schedule page: `<Suspense fallback={<FormSkeleton />}>` for ContactForm

**Benefits**:
- Progressive loading
- Better perceived performance
- Prevents layout shift

### 6. Image Size Attributes

**Verified**:
- ✅ Gallery images: Have `width` and `height` from data
- ✅ Hero image: Uses `fill` with container aspect ratio
- ✅ Lightbox images: Have explicit dimensions
- ✅ All images: Use `sizes` attribute for responsive loading

**Example**:
```tsx
<Image
  src={image.url}
  alt={image.alt}
  width={image.width}  // ✅ Prevents CLS
  height={image.height} // ✅ Prevents CLS
  sizes="(max-width: 768px) 100vw, 33vw"
  placeholder="blur"
  blurDataURL={image.blurDataURL}
/>
```

### 7. Build Optimizations (`next.config.ts`)

**Enabled**:
- ✅ `compress: true` - Gzip compression
- ✅ `swcMinify: true` - Faster, smaller builds
- ✅ `optimizePackageImports` - Tree-shaking for icon libraries

**Benefits**:
- Smaller bundle sizes
- Faster page loads
- Better FID scores

## Performance Checklist

### Images
- ✅ All images use Next.js `<Image>` component
- ✅ Explicit width/height attributes
- ✅ Blur placeholders configured
- ✅ Proper `sizes` attributes
- ✅ Priority loading for LCP elements
- ✅ AVIF/WebP format support

### Fonts
- ✅ Font preloading configured
- ✅ `display: "swap"` prevents FOIT
- ✅ Only critical fonts preloaded

### JavaScript
- ✅ Server components by default
- ✅ Client components only when needed
- ✅ Code splitting automatic
- ✅ Package imports optimized

### Caching
- ✅ Static assets cached (1 year)
- ✅ Image optimization cached (30 days)
- ✅ Proper cache headers set

### Loading States
- ✅ Gallery skeleton implemented
- ✅ Form skeleton implemented
- ✅ Suspense boundaries added

## Testing Core Web Vitals

### Tools
1. **Lighthouse** (Chrome DevTools)
   - Run: F12 → Lighthouse → Performance
   - Check Core Web Vitals scores

2. **PageSpeed Insights**
   - URL: https://pagespeed.web.dev/
   - Enter your site URL
   - Review Core Web Vitals report

3. **Web Vitals Extension**
   - Chrome extension for real-time monitoring
   - Shows LCP, FID, CLS as you browse

4. **Next.js Analytics** (Optional)
   - Enable Vercel Analytics
   - Get real user metrics (RUM)

### Expected Scores

**Target Scores**:
- LCP: < 2.5s ✅
- FID: < 100ms ✅
- CLS: < 0.1 ✅

**Current Status**: All optimizations implemented. Test with Lighthouse to verify scores.

## Additional Recommendations

### Future Optimizations

1. **Image CDN** (Optional)
   - Consider Cloudinary or Vercel Blob
   - Automatic format conversion
   - Advanced optimization

2. **Service Worker** (Optional)
   - Offline support
   - Faster repeat visits
   - Background sync

3. **Resource Hints** (If needed)
   - `dns-prefetch` for external domains
   - `preconnect` for critical resources
   - `prefetch` for likely next pages

4. **Critical CSS** (If needed)
   - Extract above-the-fold CSS
   - Inline critical styles
   - Defer non-critical CSS

## Monitoring

### Production Monitoring

1. **Vercel Analytics**
   - Automatic Core Web Vitals tracking
   - Real user metrics
   - Performance insights

2. **Google Search Console**
   - Core Web Vitals report
   - Page experience signals
   - Mobile usability

3. **Custom Monitoring**
   - Web Vitals API
   - Custom analytics events
   - Performance budgets

## Files Modified

1. `next.config.ts` - Caching headers, image optimization, build config
2. `src/app/layout.tsx` - Font optimization
3. `src/components/forms/FormSkeleton.tsx` - NEW: Form loading skeleton
4. `src/app/(routes)/schedule/page.tsx` - Added Suspense boundary

## Summary

All Core Web Vitals optimizations have been implemented:
- ✅ Loading skeletons for gallery and forms
- ✅ Proper image sizes to prevent layout shift
- ✅ Critical fonts preloaded
- ✅ Caching headers configured
- ✅ Client-side JavaScript minimized
- ✅ Suspense boundaries added

The site is now optimized for excellent Core Web Vitals scores. Test with Lighthouse to verify improvements.

