# Gallery Images Setup Guide

This guide explains how to add your own images to the gallery.

## Directory Structure

Place your images in the following structure:

```
public/
  images/
    gallery/
      kitchens/
        kitchen-001-1.webp
        kitchen-001-2.webp
        kitchen-001-3.webp
        kitchen-002-1.webp
        kitchen-002-2.webp
        kitchen-003-1.webp
        ...
      bathrooms/
        bathroom-001-1.webp
        bathroom-001-2.webp
        bathroom-001-3.webp
        bathroom-002-1.webp
        ...
```

**Note**: Images are automatically optimized to WebP format. You can add JPG/PNG files and run the optimization script to convert them.

## Image Naming Convention

- **Kitchens**: `kitchen-XXX-N.webp` where XXX is the project number (001, 002, etc.) and N is the image number (1, 2, 3, etc.)
- **Bathrooms**: `bathroom-XXX-N.webp` with the same numbering system
- **Sunrooms**: `sunroom-XXX-N.webp` with the same numbering system
- **Millwork**: `millwork-XXX-N.webp` with the same numbering system

**Note**: All images are optimized to WebP format. Use `.webp` extension in gallery-data.ts.

## Image Requirements

### Standard Specifications:
- **Format**: WebP (automatically optimized)
- **Dimensions**: 1920x1440px (4:3 aspect ratio - matches gallery grid)
- **File Size**: < 500KB per image (automatically optimized)
- **Quality**: 85% (optimal balance of quality and file size)

### Why 1920x1440 (4:3)?
- Matches gallery grid aspect ratio (`aspect-[4/3]`)
- 1920px width is sufficient for Retina/high-DPI displays
- Next.js automatically generates smaller responsive sizes
- Prevents layout shifts with consistent aspect ratios

### Getting Image Dimensions

You need the actual width and height in pixels for each image. You can:

1. **Right-click image → Properties** (Windows) or **Get Info** (Mac)
2. **Use image editing software** (Photoshop, GIMP, etc.)
3. **Use command line**: `identify image.jpg` (ImageMagick)
4. **Use online tools**: Upload image to get dimensions

## Updating gallery-data.ts

After adding your images, update `/src/lib/gallery-data.ts`:

1. **Update image paths** to match your filenames:
   ```typescript
   {
     url: "/images/gallery/kitchens/kitchen-001-1.webp",
     alt: "Descriptive alt text",
     width: 1920,  // Standard width (all images are 1920x1440)
     height: 1440, // Standard height (4:3 aspect ratio)
     blurDataURL: KITCHEN_BLUR_DATA_URL, // Already included
   }
   ```

2. **Update project information**:
   - Title
   - Description
   - Featured status
   - Number of images

## Blur Placeholders

Blur placeholders are automatically included:
- **Kitchens**: Warm-toned blur (`KITCHEN_BLUR_DATA_URL`)
- **Bathrooms**: Cool-toned blur (`BATHROOM_BLUR_DATA_URL`)

These provide a smooth loading experience while images load.

## Example Project Entry

```typescript
{
  id: "kitchen-001",
  title: "Your Project Title",
  category: "kitchen",
  description: "Your project description here...",
  featured: true,
  images: [
    {
      url: "/images/gallery/kitchens/kitchen-001-1.jpg",
      alt: "Main view of the kitchen",
      width: 1920,
      height: 1280,
      blurDataURL: KITCHEN_BLUR_DATA_URL,
    },
    {
      url: "/images/gallery/kitchens/kitchen-001-2.jpg",
      alt: "Kitchen island detail",
      width: 1920,
      height: 1280,
      blurDataURL: KITCHEN_BLUR_DATA_URL,
    },
  ],
}
```

## Image Optimization

### Automatic Optimization

All images are automatically optimized using the built-in script:

```bash
npm run optimize-images
```

This script will:
- Resize images to 1920x1440px (4:3 aspect ratio)
- Convert to WebP format (quality 85%)
- Reduce file sizes to < 500KB average
- Create backups of originals in `public/images/gallery-backup/`

### Manual Optimization (Optional)

If you prefer to optimize images manually before adding:

1. **Resize to 1920x1440px** (4:3 aspect ratio)
2. **Convert to WebP** format
3. **Compress** using tools like:
   - [Squoosh](https://squoosh.app/) - Online image optimizer
   - [ImageOptim](https://imageoptim.com/) - Mac app
   - [TinyPNG](https://tinypng.com/) - Online tool
4. **Target file size**: < 500KB per image

## Next.js Image Optimization

The gallery uses Next.js `<Image>` component which automatically:
- Optimizes images on-the-fly (further compression if needed)
- Serves AVIF/WebP when supported (browser automatically selects best format)
- Generates responsive sizes (multiple sizes for different screen sizes)
- Lazy loads images (loads when visible in viewport)
- Provides blur placeholders (smooth loading experience)

**Note**: Images are pre-optimized to WebP format, but Next.js will still optimize them further for delivery.

## Troubleshooting

**Images not showing?**
- Check file paths match exactly (case-sensitive)
- Ensure images use `.webp` extension in gallery-data.ts
- Verify images are in `/public/images/gallery/` folder
- Check browser console for 404 errors
- Run `npm run optimize-images` if you added new JPG/PNG files

**Images loading slowly?**
- Images are pre-optimized, but check file sizes
- Ensure images are WebP format (< 500KB each)
- Check network tab in browser DevTools
- Verify Next.js image optimization is working

**Blur placeholders not working?**
- Blur placeholders are included automatically
- They'll show a subtle color while images load
- This is normal and improves perceived performance

