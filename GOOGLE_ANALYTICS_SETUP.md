# Google Analytics Setup Guide

## ✅ Your GA4 Measurement ID
**G-3RDJFSXLZK**

## Current Implementation

Your website is already configured to use Google Analytics 4 using Next.js's optimized `@next/third-parties/google` package. This is **better than manual installation** because:

- ✅ **Optimized loading** - Scripts load efficiently without blocking page rendering
- ✅ **Automatic page view tracking** - Tracks page views automatically via Next.js router
- ✅ **Better performance** - Uses Next.js optimizations for third-party scripts
- ✅ **Type-safe** - Full TypeScript support
- ✅ **Production-only** - Only loads in production (not in development)

## Setup Instructions

### 1. Local Development

Add to your `.env.local` file (already done if you ran the setup):

```bash
NEXT_PUBLIC_GA_ID=G-3RDJFSXLZK
```

### 2. Vercel Production

1. Go to your [Vercel Dashboard](https://vercel.com/dashboard)
2. Select your project
3. Go to **Settings** → **Environment Variables**
4. Add:
   - **Name**: `NEXT_PUBLIC_GA_ID`
   - **Value**: `G-3RDJFSXLZK`
   - **Environment**: Select all (Production, Preview, Development)
5. Click **Save**
6. Redeploy your application (or wait for next deployment)

### 3. Verify Installation

#### Local Testing (Production Mode)
```bash
npm run build
npm start
```

Then visit `http://localhost:3000` and check:
- Browser DevTools → Network tab → Look for requests to `google-analytics.com`
- Browser DevTools → Console → Should see GA4 script loading

#### Production Testing
1. Deploy to Vercel
2. Visit your live site
3. Open Browser DevTools → Network tab
4. Look for requests to `googletagmanager.com` or `google-analytics.com`
5. Check Google Analytics Real-Time reports (should see your visit within seconds)

## How It Works

The current implementation uses `@next/third-parties/google` which:

1. **Automatically injects** the Google Analytics script (equivalent to the manual script you provided)
2. **Tracks page views** automatically when users navigate
3. **Supports custom events** via the `trackEvent()` functions in `src/lib/analytics.ts`

### Equivalent Manual Script (for reference)

The Next.js implementation is equivalent to this manual script:

```html
<!-- Google tag (gtag.js) -->
<script async src="https://www.googletagmanager.com/gtag/js?id=G-3RDJFSXLZK"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'G-3RDJFSXLZK');
</script>
```

But Next.js handles it more efficiently!

## Custom Event Tracking

Your website already tracks:
- ✅ Page views (automatic)
- ✅ Form submissions
- ✅ Gallery interactions
- ✅ CTA clicks
- ✅ Button clicks
- ✅ External links
- ✅ Image/video views

See `ANALYTICS_TRACKING.md` for complete details.

## Viewing Analytics Data

### Google Analytics Dashboard
1. Go to [Google Analytics](https://analytics.google.com/)
2. Select your property
3. Navigate to **Reports** → **Realtime** to see live data
4. Navigate to **Reports** → **Engagement** → **Events** to see custom events

### Real-Time Reports
- Visit your site
- Open GA4 Real-Time reports
- You should see your visit within seconds

## Troubleshooting

### Analytics Not Working?

1. **Check Environment Variable**:
   ```bash
   # Local
   cat .env.local | grep NEXT_PUBLIC_GA_ID
   
   # Should output: NEXT_PUBLIC_GA_ID=G-3RDJFSXLZK
   ```

2. **Check Production Mode**:
   - Analytics only loads when `NODE_ENV === "production"`
   - Test locally: `npm run build && npm start`

3. **Check Browser Console**:
   - Open DevTools → Console
   - Look for GA4 script loading
   - Check for errors

4. **Verify GA4 Property**:
   - Ensure Measurement ID is correct: `G-3RDJFSXLZK`
   - Check GA4 property is active
   - Verify data stream is configured correctly

5. **Check Network Tab**:
   - Open DevTools → Network
   - Filter by "google" or "gtag"
   - Should see requests to `googletagmanager.com`

### Events Not Showing?

- **Wait 24-48 hours** - GA4 can have delays for historical data
- **Check Real-Time reports** - Events appear immediately in Real-Time
- **Verify event names** - Check `src/lib/analytics.ts` for event names
- **Check console logs** - In development, events log to console

## Next Steps

1. ✅ Add `NEXT_PUBLIC_GA_ID=G-3RDJFSXLZK` to Vercel environment variables
2. ✅ Deploy to production
3. ✅ Visit your site and verify in GA4 Real-Time reports
4. ✅ Check custom events in GA4 after 24-48 hours

## Summary

- **GA4 ID**: `G-3RDJFSXLZK`
- **Implementation**: Next.js optimized (better than manual)
- **Status**: Ready to use once environment variable is set
- **Tracking**: Automatic page views + custom events

Your Google Analytics is now configured! 🎉

