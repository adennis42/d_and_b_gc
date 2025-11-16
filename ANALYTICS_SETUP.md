# Analytics Setup Guide

This guide explains how Google Analytics is integrated into the contractor website and how to use the analytics tracking functions.

## Overview

The site uses Google Analytics 4 (GA4) for tracking user interactions and page views. Analytics only loads in production to avoid polluting development data.

## Components

### 1. GoogleAnalytics Component (`src/components/analytics/GoogleAnalytics.tsx`)

**Features**:
- ✅ Loads only in production (`NODE_ENV === "production"`)
- ✅ Uses `NEXT_PUBLIC_GA_ID` environment variable
- ✅ Tracks page views automatically
- ✅ Uses Next.js `Script` component for optimal loading
- ✅ No cookies (privacy-friendly)

**Usage**: Automatically included in root layout (`src/app/layout.tsx`)

### 2. Analytics Utility Functions (`src/lib/analytics.ts`)

Provides clean API for tracking custom events:

- `trackFormSubmission()` - Track form submissions
- `trackGalleryView()` - Track gallery interactions
- `trackCallToAction()` - Track CTA clicks
- `trackPageView()` - Manual page view tracking
- `trackButtonClick()` - Generic button click tracking
- `trackExternalLink()` - External link tracking
- `trackSearch()` - Search functionality tracking

## Environment Setup

### Required Environment Variable

Add to `.env.local` (local) and Vercel dashboard (production):

```bash
NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX
```

**Getting Your GA4 Measurement ID**:
1. Go to [Google Analytics](https://analytics.google.com/)
2. Create a new GA4 property (if you don't have one)
3. Go to Admin → Data Streams → Web
4. Copy your Measurement ID (format: `G-XXXXXXXXXX`)

## Integrated Tracking

### Form Submissions

**Location**: `src/components/forms/ContactForm.tsx`

Tracks:
- ✅ Successful form submissions
- ✅ Failed form submissions
- Form type: `"contact"`
- Form location: `"schedule"`

**Example Event**:
```javascript
trackFormSubmission("contact", "schedule", true); // success
trackFormSubmission("contact", "schedule", false); // failure
```

### Gallery Interactions

**Location**: `src/components/gallery/GalleryGrid.tsx`

Tracks:
- ✅ Gallery views (when page loads)
- ✅ Filter changes (when user filters by category)
- ✅ Lightbox opens (when user clicks a project)

**Example Events**:
```javascript
trackGalleryView("all", undefined, "view"); // View all projects
trackGalleryView("kitchen", undefined, "filter"); // Filter by kitchen
trackGalleryView("bathroom", "bathroom-001", "lightbox_open"); // Open project
```

### Call-to-Action Clicks

**Location**: `src/components/home/Hero.tsx`

Tracks:
- ✅ Hero CTA clicks
- CTA location: `"hero"`
- CTA text: `"view-gallery"` or `"schedule-consultation"`
- Destination: `/gallery` or `/schedule`

**Example Events**:
```javascript
trackCallToAction("hero", "view-gallery", "/gallery");
trackCallToAction("hero", "schedule-consultation", "/schedule");
```

## Using Analytics Functions

### Basic Usage

```tsx
import { trackFormSubmission, trackGalleryView, trackCallToAction } from '@/lib/analytics';

// Track form submission
trackFormSubmission('contact', 'schedule', true);

// Track gallery view
trackGalleryView('kitchen', 'kitchen-001', 'lightbox_open');

// Track CTA click
trackCallToAction('hero', 'view-gallery', '/gallery');
```

### In Event Handlers

```tsx
<Button onClick={() => {
  trackCallToAction('services', 'learn-more', '/about');
  // ... other logic
}}>
  Learn More
</Button>
```

### In Form Submissions

```tsx
const handleSubmit = async (data) => {
  try {
    await submitForm(data);
    trackFormSubmission('contact', 'footer', true);
  } catch (error) {
    trackFormSubmission('contact', 'footer', false);
  }
};
```

## Event Parameters

### Form Submission
- `form_type`: Type of form (e.g., "contact", "newsletter")
- `form_location`: Where form is located (e.g., "schedule", "footer")
- `success`: Boolean indicating success/failure

### Gallery View
- `category`: Project category ("kitchen", "bathroom", "all", etc.)
- `project_id`: Optional project ID
- `action`: Action type ("view", "filter", "lightbox_open")

### Call-to-Action
- `cta_location`: Where CTA is located (e.g., "hero", "services", "footer")
- `cta_text`: CTA text/label
- `destination`: Where CTA leads (URL path)

## Viewing Analytics Data

### Google Analytics Dashboard

1. Go to [Google Analytics](https://analytics.google.com/)
2. Select your property
3. Navigate to **Reports** → **Engagement** → **Events**
4. View custom events:
   - `form_submission`
   - `gallery_interaction`
   - `cta_click`

### Real-Time Reports

1. Go to **Reports** → **Realtime**
2. See events as they happen
3. Useful for testing

### Custom Reports

Create custom reports in GA4:
1. Go to **Explore** → **Blank**
2. Add dimensions: `event_name`, `form_type`, `cta_location`, etc.
3. Add metrics: `Event count`, `Users`, etc.

## Development vs Production

### Development
- Analytics scripts **do not load**
- Functions log to console for debugging
- No data sent to Google Analytics

### Production
- Analytics scripts load automatically
- All events tracked normally
- Data sent to Google Analytics

## Privacy Considerations

- ✅ No cookies used (GA4 can work without cookies)
- ✅ Respects user privacy
- ✅ GDPR-friendly (consider adding consent banner if required)
- ✅ Can be disabled by users via browser extensions

## Troubleshooting

### Analytics Not Working?

1. **Check Environment Variable**:
   ```bash
   echo $NEXT_PUBLIC_GA_ID
   ```
   Should output: `G-XXXXXXXXXX`

2. **Check Production Mode**:
   - Analytics only loads when `NODE_ENV === "production"`
   - Test with `npm run build && npm start`

3. **Check Browser Console**:
   - Open DevTools → Console
   - Look for GA4 script loading
   - Check for errors

4. **Verify GA4 Property**:
   - Ensure Measurement ID is correct
   - Check GA4 property is active
   - Verify data stream is configured

### Events Not Showing?

1. **Wait 24-48 hours** for data to appear (GA4 can have delays)
2. **Check Real-Time Reports** for immediate verification
3. **Verify event names** match what's in GA4
4. **Check browser extensions** that might block analytics

## Best Practices

1. **Don't Track Sensitive Data**:
   - Never track PII (personally identifiable information)
   - Don't track passwords or credit card numbers

2. **Use Consistent Event Names**:
   - Follow naming conventions
   - Use lowercase with underscores

3. **Test Before Deploying**:
   - Test in development (check console logs)
   - Verify in production Real-Time reports

4. **Monitor Performance**:
   - Analytics shouldn't slow down the site
   - Scripts load asynchronously

## Files Modified

1. `src/components/analytics/GoogleAnalytics.tsx` - NEW: Analytics component
2. `src/lib/analytics.ts` - NEW: Analytics utility functions
3. `src/app/layout.tsx` - Added GoogleAnalytics component
4. `src/components/forms/ContactForm.tsx` - Added form tracking
5. `src/components/home/Hero.tsx` - Added CTA tracking
6. `src/components/gallery/GalleryGrid.tsx` - Added gallery tracking

## Summary

✅ Google Analytics 4 integrated
✅ Production-only loading
✅ Automatic page view tracking
✅ Custom event tracking functions
✅ Integrated into key components
✅ Privacy-friendly implementation

The analytics system is ready to track user interactions and provide valuable insights into website performance and user behavior.

