# SEO Setup Guide

This guide explains the SEO features implemented in the contractor website and how to configure them.

## SEO Features Implemented

### 1. Dynamic Sitemap (`/sitemap.xml`)

**File**: `src/app/sitemap.ts`

- Automatically generates a sitemap including all static pages
- Includes: Home, About, Gallery, Schedule
- Ready for future individual project pages (commented out)
- Accessible at: `https://yourdomain.com/sitemap.xml`

**Features**:
- ✅ Dynamic generation based on routes
- ✅ Proper priorities and change frequencies
- ✅ Last modified dates
- ✅ Automatically served by Next.js

### 2. Robots.txt (`/robots.txt`)

**File**: `src/app/robots.ts`

- Allows all search engine crawlers
- Disallows API routes and Next.js internal files
- Links to sitemap
- Accessible at: `https://yourdomain.com/robots.txt`

**Configuration**:
- Allows: All pages except `/api/`, `/_next/`, `/admin/`
- Sitemap: Automatically links to `/sitemap.xml`

### 3. JSON-LD Structured Data (LocalBusiness Schema)

**File**: `src/components/StructuredData.tsx`

Implements Google's LocalBusiness schema to help search engines understand your business information. This can enable rich snippets in search results.

**Includes**:
- Business name and description
- Physical address
- Phone number and email
- Opening hours
- Service areas
- Aggregate rating (when reviews are available)
- Logo and business image

**Location**: Added to root layout (`src/app/layout.tsx`)

## Configuration

### Required Environment Variables

Add these to your `.env.local` file (for local development) and Vercel dashboard (for production):

```bash
# Site URL
NEXT_PUBLIC_SITE_URL=https://dbcontractorsny.com

# Business Address
NEXT_PUBLIC_BUSINESS_STREET=123 Main Street
NEXT_PUBLIC_BUSINESS_CITY=New York
NEXT_PUBLIC_BUSINESS_STATE=NY
NEXT_PUBLIC_BUSINESS_ZIP=10001
NEXT_PUBLIC_BUSINESS_COUNTRY=US

# Contact Information
NEXT_PUBLIC_BUSINESS_PHONE=+1-555-123-4567
NEXT_PUBLIC_BUSINESS_EMAIL=info@dbcontractorsny.com

# Business Hours
# Format: "Mo-Fr 08:00-17:00,Sa 09:00-13:00"
# Day abbreviations: Mo, Tu, We, Th, Fr, Sa, Su
NEXT_PUBLIC_BUSINESS_HOURS=Mo-Fr 08:00-17:00,Sa 09:00-13:00

# Service Areas
# Format: Comma-separated list
NEXT_PUBLIC_SERVICE_AREAS=New York,Long Island,Westchester County

# Ratings (Optional - only if you have reviews)
NEXT_PUBLIC_RATING_VALUE=4.8
NEXT_PUBLIC_REVIEW_COUNT=25

# Images (Optional - defaults provided)
NEXT_PUBLIC_BUSINESS_LOGO=/images/logo.png
NEXT_PUBLIC_BUSINESS_IMAGE=/images/og-image.jpg
```

## Testing SEO Features

### 1. Test Sitemap

Visit: `http://localhost:3000/sitemap.xml` (local) or `https://yourdomain.com/sitemap.xml` (production)

You should see XML with all your pages listed.

### 2. Test Robots.txt

Visit: `http://localhost:3000/robots.txt` (local) or `https://yourdomain.com/robots.txt` (production)

You should see:
```
User-agent: *
Allow: /
Disallow: /api/
Disallow: /_next/
Disallow: /admin/

Sitemap: https://yourdomain.com/sitemap.xml
```

### 3. Test Structured Data

1. **View Source**: Right-click on your homepage → "View Page Source"
2. **Search for**: `application/ld+json`
3. **Validate**: Use [Google's Rich Results Test](https://search.google.com/test/rich-results) or [Schema.org Validator](https://validator.schema.org/)

You should see JSON-LD structured data with your business information.

## Google Search Console Setup

1. **Submit Sitemap**:
   - Go to [Google Search Console](https://search.google.com/search-console)
   - Add your property (website)
   - Go to "Sitemaps" → Add `https://yourdomain.com/sitemap.xml`

2. **Verify Structured Data**:
   - Use "URL Inspection" tool
   - Check that structured data is detected
   - Look for "LocalBusiness" schema

3. **Monitor Performance**:
   - Check "Performance" for search analytics
   - Monitor "Coverage" for indexing issues
   - Review "Enhancements" for rich results eligibility

## Additional SEO Best Practices

### 1. Meta Tags
- ✅ Already implemented in `src/lib/metadata.ts`
- ✅ Open Graph tags for social sharing
- ✅ Twitter Card tags
- ✅ Proper title templates

### 2. Image Optimization
- ✅ Using Next.js `<Image>` component
- ✅ Proper alt text on all images
- ✅ Lazy loading for gallery images

### 3. Semantic HTML
- ✅ Proper heading hierarchy (h1, h2, h3)
- ✅ Semantic elements (nav, main, footer, section)
- ✅ ARIA labels where needed

### 4. Performance
- ✅ Server-side rendering
- ✅ Static generation where possible
- ✅ Optimized images and fonts

## Future Enhancements

Consider adding:
- Individual project pages with their own structured data
- Blog posts with Article schema
- FAQ schema for common questions
- Review schema when testimonials are added
- BreadcrumbList schema for navigation

## Troubleshooting

**Sitemap not updating?**
- Clear Next.js cache: `rm -rf .next`
- Redeploy on Vercel

**Structured data not showing?**
- Check environment variables are set correctly
- Verify JSON-LD is valid using Schema.org validator
- Ensure all required fields are filled

**Robots.txt not working?**
- Check file is at `src/app/robots.ts` (not `.txt`)
- Restart dev server
- Clear browser cache

## Resources

- [Google Search Central](https://developers.google.com/search)
- [Schema.org LocalBusiness](https://schema.org/LocalBusiness)
- [Next.js SEO Guide](https://nextjs.org/learn/seo/introduction-to-seo)
- [Google Rich Results Test](https://search.google.com/test/rich-results)

