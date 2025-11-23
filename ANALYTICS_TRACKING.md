# Analytics Tracking Implementation

This document outlines all the analytics tracking that has been implemented across the website.

## Overview

The website uses a comprehensive analytics tracking system that combines:
- **Google Analytics 4 (GA4)** for client-side event tracking
- **PostgreSQL Database** for server-side event storage (used by admin dashboard)
- **Automatic page view tracking** via Next.js proxy middleware

## Tracking Implementation

### 1. Page Views
- **Automatic**: Tracked via `src/proxy.ts` middleware on every page load
- **Data Captured**: Page path, referrer, user agent, device type, IP address, browser, OS
- **Storage**: Both GA4 and PostgreSQL database

### 2. Navigation Tracking

#### Header Navigation (`src/components/layout/Header.tsx`)
- ✅ Logo click → `button_click` event
- ✅ Desktop navigation links → `button_click` event
  - Location: `header-nav`
  - Tracks: Home, About, Gallery, Schedule

#### Mobile Menu (`src/components/layout/MobileMenu.tsx`)
- ✅ Mobile navigation links → `button_click` event
  - Location: `mobile-menu`
  - Tracks: Home, About, Gallery, Schedule

#### Footer Navigation (`src/components/layout/Footer.tsx`)
- ✅ Footer quick links → `button_click` event
  - Location: `footer-nav`
  - Tracks: Home, About, Gallery, Schedule
- ✅ External social links → `external_link_click` event
  - Location: `footer-social`
  - Tracks: Facebook, Yelp clicks

### 3. Call-to-Action (CTA) Tracking

#### Hero Section (`src/components/home/Hero.tsx`)
- ✅ "View Our Work" button → `cta_click` event
  - Location: `hero`
  - Destination: `/gallery`
- ✅ "Schedule Consultation" button → `cta_click` event
  - Location: `hero`
  - Destination: `/schedule`

#### CTA Section (`src/components/home/CTA.tsx`)
- ✅ "Schedule Your Consultation" button → `cta_click` event
  - Location: `cta-section`
  - Destination: `/schedule`
- ✅ "Browse Our Portfolio" button → `cta_click` event
  - Location: `cta-section`
  - Destination: `/gallery`

### 4. Form Tracking

#### Contact Form (`src/components/forms/ContactForm.tsx`)
- ✅ Successful form submission → `form_submission` event
  - Form type: `contact`
  - Location: `schedule`
  - Success: `true`
- ✅ Failed form submission → `form_submission` event
  - Form type: `contact`
  - Location: `schedule`
  - Success: `false`

### 5. Gallery Tracking

#### Gallery Grid (`src/components/gallery/GalleryGrid.tsx`)
- ✅ Gallery page view → `gallery_interaction` event
  - Action: `view`
  - Category: `all` (or specific category)
- ✅ Filter changes → `filter_use` event
  - Category: kitchen, bathroom, sunroom, millwork
- ✅ Project card click (lightbox open) → `gallery_interaction` event
  - Action: `lightbox_open`
  - Includes project ID and category

#### Lightbox (`src/components/gallery/Lightbox.tsx`)
- ✅ Image view → `image_click` event
  - Tracks when an image is displayed in the lightbox
  - Includes project ID and category
- ✅ Video play → `video_play` event
  - Tracks when a video starts playing
  - Includes project ID and category

## Event Types Tracked

### GA4 Events
1. **page_view** - Automatic (via GA4)
2. **form_submission** - Form submissions
3. **gallery_interaction** - Gallery views and interactions
4. **image_click** - Image views in lightbox
5. **video_play** - Video plays
6. **cta_click** - Call-to-action button clicks
7. **button_click** - Generic button clicks
8. **external_link_click** - External link clicks

### Database Events (for Admin Dashboard)
All events are also stored in PostgreSQL with additional metadata:
- `page_view` - Page views
- `form_submit` - Form submissions
- `image_click` - Image clicks
- `video_play` - Video plays
- `filter_use` - Filter usage
- `cta_click` - CTA clicks
- `external_link_click` - External links

## Analytics Functions

All tracking functions are available in `src/lib/analytics.ts`:

- `trackFormSubmission(formType, formLocation, success)`
- `trackGalleryView(category, projectId?, action)`
- `trackCallToAction(ctaLocation, ctaText, destination?)`
- `trackButtonClick(buttonText, buttonLocation, destination?)`
- `trackExternalLink(url, linkText, linkLocation)`
- `trackPageView(path, title?)`
- `trackSearch(searchTerm, resultsCount?)`

## Environment Setup

### Required Environment Variable
```bash
NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX
```

Add this to:
- `.env.local` (for local development)
- Vercel Dashboard → Settings → Environment Variables (for production)

### Getting Your GA4 Measurement ID
1. Go to [Google Analytics](https://analytics.google.com/)
2. Create a GA4 property (if you don't have one)
3. Go to Admin → Data Streams → Web
4. Copy your Measurement ID (format: `G-XXXXXXXXXX`)

## Viewing Analytics Data

### Google Analytics Dashboard
1. Go to [Google Analytics](https://analytics.google.com/)
2. Select your property
3. Navigate to **Reports** → **Engagement** → **Events**
4. View custom events:
   - `form_submission`
   - `gallery_interaction`
   - `image_click`
   - `video_play`
   - `cta_click`
   - `button_click`
   - `external_link_click`

### Admin Dashboard Analytics
Access the admin dashboard at `/admin-dashboard` (separate Next.js app) to view:
- Page views with device/browser breakdown
- Form submissions
- Gallery interactions
- CTA clicks
- External link clicks
- Referrer data
- Geographic data (if available)

## Development vs Production

### Development
- Analytics functions log to console for debugging
- No data sent to Google Analytics
- Database tracking still works (if database is configured)

### Production
- All events tracked normally
- Data sent to Google Analytics
- Data stored in PostgreSQL database

## Privacy Considerations

- ✅ No cookies used (GA4 can work without cookies)
- ✅ Respects user privacy
- ✅ GDPR-friendly (consider adding consent banner if required)
- ✅ Can be disabled by users via browser extensions
- ✅ IP addresses are anonymized in database (if configured)

## Testing Analytics

### Local Testing
1. Set `NEXT_PUBLIC_GA_ID` in `.env.local`
2. Run `npm run build && npm start` (production mode)
3. Open browser DevTools → Network tab
4. Look for requests to `google-analytics.com`
5. Check console for `[Analytics]` logs

### Production Testing
1. Deploy to Vercel
2. Visit your site
3. Perform actions (click buttons, submit forms, etc.)
4. Check Google Analytics Real-Time reports
5. Verify events appear within 24-48 hours

## Troubleshooting

### Events Not Showing?
1. **Wait 24-48 hours** - GA4 can have delays
2. **Check environment variable** - Ensure `NEXT_PUBLIC_GA_ID` is set
3. **Check production mode** - Analytics only loads in production
4. **Check browser console** - Look for errors
5. **Verify GA4 property** - Ensure Measurement ID is correct

### Database Events Not Storing?
1. **Check database connection** - Verify `POSTGRES_URL` is set
2. **Check API route** - Verify `/api/analytics` is accessible
3. **Check server logs** - Look for database errors
4. **Verify schema** - Ensure `analytics_events` table exists

## Summary

✅ **Page Views** - Automatic tracking on all pages
✅ **Navigation** - Header, footer, mobile menu clicks
✅ **CTAs** - Hero and CTA section buttons
✅ **Forms** - Contact form submissions (success/failure)
✅ **Gallery** - Views, filters, lightbox opens
✅ **Media** - Image clicks and video plays
✅ **External Links** - Social media and external site links

All tracking is non-intrusive, privacy-friendly, and provides comprehensive insights into user behavior.

