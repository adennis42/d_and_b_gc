# Gallery Videos Setup Guide

This guide explains how to add YouTube videos to your gallery projects.

## Overview

Videos can be added to projects in two ways:
1. **Mixed media projects**: Projects with both images and videos
2. **Video-only projects**: Projects with only videos (no images)

Videos are displayed in the same lightbox viewer as images, with seamless navigation between photos and videos.

## Adding Videos to Projects

### Step 1: Get Your YouTube Video ID

You can use any of these YouTube URL formats:
- `https://www.youtube.com/watch?v=VIDEO_ID`
- `https://youtu.be/VIDEO_ID`
- `https://www.youtube.com/embed/VIDEO_ID`
- Or just the video ID: `VIDEO_ID`

### Step 2: Add Video to Project

Open `/src/lib/gallery-data.ts` and add a `videos` array to your project:

```typescript
{
  id: "kitchen-020",
  title: "Kitchen Renovation Video Tour",
  category: "kitchen",
  description: "Video walkthrough of completed kitchen renovation",
  featured: true,
  images: [
    // ... existing images
  ],
  videos: [
    {
      type: 'youtube',
      videoId: extractYouTubeId('https://www.youtube.com/watch?v=YOUR_VIDEO_ID'),
      alt: 'Kitchen renovation video tour showing completed work',
      width: 1920,
      height: 1080,
    }
  ],
}
```

### Using the Helper Function

For convenience, use the `createVideoFromYouTubeUrl()` helper:

```typescript
import { createVideoFromYouTubeUrl } from "@/lib/gallery-data";

{
  id: "kitchen-020",
  // ... other fields
  videos: [
    createVideoFromYouTubeUrl(
      'https://www.youtube.com/watch?v=YOUR_VIDEO_ID',
      'Kitchen renovation video tour',
      1920, // width (optional, defaults to 1920)
      1080  // height (optional, defaults to 1080)
    )
  ],
}
```

## Video Specifications

### Required Fields

- **type**: Always `'youtube'` (for future expansion to other platforms)
- **videoId**: YouTube video ID (extracted from URL)
- **alt**: Descriptive text for accessibility (required for screen readers)
- **width**: Video width in pixels (typically 1920 for 16:9 aspect ratio)
- **height**: Video height in pixels (typically 1080 for 16:9 aspect ratio)

### Optional Fields

- **thumbnailUrl**: Custom thumbnail URL (if not provided, YouTube thumbnail is used automatically)

### Aspect Ratios

- **16:9 (Standard)**: `width: 1920, height: 1080`
- **4:3 (Classic)**: `width: 1920, height: 1440`
- **9:16 (Vertical/Mobile)**: `width: 1080, height: 1920`

## Examples

### Example 1: Mixed Media Project

A project with both images and a video:

```typescript
{
  id: "bathroom-025",
  title: "Luxury Bathroom Renovation",
  category: "bathroom",
  description: "Complete bathroom transformation with video walkthrough",
  featured: true,
  images: [
    {
      url: "/images/gallery/bathrooms/bathroom-025-1.jpg",
      alt: "Bathroom vanity detail",
      width: 1920,
      height: 1280,
      blurDataURL: BATHROOM_BLUR_DATA_URL,
    },
    {
      url: "/images/gallery/bathrooms/bathroom-025-2.jpg",
      alt: "Shower area",
      width: 1920,
      height: 1280,
      blurDataURL: BATHROOM_BLUR_DATA_URL,
    },
  ],
  videos: [
    {
      type: 'youtube',
      videoId: extractYouTubeId('https://youtu.be/YOUR_VIDEO_ID'),
      alt: 'Bathroom renovation video tour',
      width: 1920,
      height: 1080,
    }
  ],
}
```

### Example 2: Video-Only Project

A project with only videos (no images):

```typescript
{
  id: "kitchen-021",
  title: "Kitchen Installation Process",
  category: "kitchen",
  description: "Time-lapse video of kitchen installation",
  featured: false,
  images: [], // Empty array - project will use video thumbnail
  videos: [
    {
      type: 'youtube',
      videoId: extractYouTubeId('https://www.youtube.com/watch?v=YOUR_VIDEO_ID'),
      alt: 'Kitchen installation time-lapse',
      width: 1920,
      height: 1080,
    }
  ],
}
```

### Example 3: Multiple Videos

A project with multiple videos:

```typescript
{
  id: "sunroom-031",
  title: "Sunroom Construction Series",
  category: "sunroom",
  description: "Multi-part video series showing sunroom construction",
  featured: true,
  images: [
    // ... images
  ],
  videos: [
    {
      type: 'youtube',
      videoId: extractYouTubeId('https://youtu.be/VIDEO_ID_1'),
      alt: 'Sunroom construction part 1: Foundation',
      width: 1920,
      height: 1080,
    },
    {
      type: 'youtube',
      videoId: extractYouTubeId('https://youtu.be/VIDEO_ID_2'),
      alt: 'Sunroom construction part 2: Framing',
      width: 1920,
      height: 1080,
    },
    {
      type: 'youtube',
      videoId: extractYouTubeId('https://youtu.be/VIDEO_ID_3'),
      alt: 'Sunroom construction part 3: Finishing',
      width: 1920,
      height: 1080,
    },
  ],
}
```

## How Videos Appear

### In Gallery Grid

- Projects with videos show a **Video badge** on the thumbnail
- A **play button overlay** appears on hover
- Video thumbnail is used if project has no images
- Media count shows: "X photos, Y videos" or "Y videos"

### In Lightbox

- Videos load with a thumbnail placeholder (click to play)
- Seamless navigation between images and videos
- Video counter shows "Video X of Y" when viewing videos
- Keyboard navigation works (arrow keys, ESC to close)
- Mobile swipe gestures work for videos

## Best Practices

1. **Alt Text**: Always provide descriptive alt text for accessibility
2. **Aspect Ratio**: Use correct dimensions (16:9 is standard for YouTube)
3. **Video Quality**: Use high-quality videos (1080p or higher)
4. **Thumbnails**: YouTube automatically provides thumbnails, but you can use custom ones
5. **Mixed Media**: Consider adding a video to showcase projects with many photos
6. **Video Length**: Keep videos concise (2-5 minutes ideal for gallery)

## Privacy & Performance

- Videos use YouTube's privacy-enhanced mode (`youtube-nocookie.com`) by default
- Videos are lazy-loaded (only load when clicked)
- Thumbnails are used as placeholders for faster page loads
- No YouTube API key required for basic embeds

## Troubleshooting

**Video not showing?**
- Check that video ID is correct
- Verify YouTube URL format
- Ensure video is public (not private/unlisted unless embedded)

**Video thumbnail not loading?**
- YouTube thumbnails may take a moment to load
- Check video ID is valid
- Try using a custom thumbnail URL

**Video not playing?**
- Check browser console for errors
- Verify video is not age-restricted or region-blocked
- Ensure video allows embedding (check YouTube video settings)

## Technical Details

- Videos use YouTube's iframe embed API
- Privacy-enhanced mode enabled by default (GDPR compliant)
- Responsive design: videos scale to container size
- Mobile-friendly: touch gestures work for navigation
- Accessibility: ARIA labels, keyboard navigation, screen reader support

