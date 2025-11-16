# Gallery Images Setup Guide

This guide explains how to add your own images to the gallery.

## Directory Structure

Place your images in the following structure:

```
public/
  images/
    gallery/
      kitchens/
        kitchen-001-1.jpg
        kitchen-001-2.jpg
        kitchen-001-3.jpg
        kitchen-002-1.jpg
        kitchen-002-2.jpg
        kitchen-003-1.jpg
        ...
      bathrooms/
        bathroom-001-1.jpg
        bathroom-001-2.jpg
        bathroom-001-3.jpg
        bathroom-002-1.jpg
        ...
```

## Image Naming Convention

- **Kitchens**: `kitchen-XXX-N.jpg` where XXX is the project number (001, 002, etc.) and N is the image number (1, 2, 3, etc.)
- **Bathrooms**: `bathroom-XXX-N.jpg` with the same numbering system

## Image Requirements

### Recommended Specifications:
- **Format**: JPG, PNG, or WebP (WebP recommended for best performance)
- **Dimensions**: 1920x1280px (or maintain 3:2 aspect ratio)
- **File Size**: Optimize images before adding (aim for < 500KB per image)
- **Quality**: High quality but optimized (use tools like ImageOptim, TinyPNG, or Squoosh)

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
     url: "/images/gallery/kitchens/kitchen-001-1.jpg",
     alt: "Descriptive alt text",
     width: 1920,  // Your actual image width
     height: 1280, // Your actual image height
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

## Image Optimization Tips

1. **Use WebP format** when possible (better compression)
2. **Resize images** to appropriate dimensions (1920px width is sufficient)
3. **Compress images** using tools like:
   - [Squoosh](https://squoosh.app/) - Online image optimizer
   - [ImageOptim](https://imageoptim.com/) - Mac app
   - [TinyPNG](https://tinypng.com/) - Online tool
4. **Maintain aspect ratio** - Keep consistent 3:2 or 4:3 ratios
5. **Use descriptive filenames** - Makes organization easier

## Next.js Image Optimization

The gallery uses Next.js `<Image>` component which automatically:
- Optimizes images on-the-fly
- Serves WebP when supported
- Generates responsive sizes
- Lazy loads images
- Provides blur placeholders

No additional optimization needed beyond adding properly sized images!

## Troubleshooting

**Images not showing?**
- Check file paths match exactly (case-sensitive)
- Ensure images are in `/public/images/gallery/` folder
- Verify image dimensions are correct
- Check browser console for 404 errors

**Images loading slowly?**
- Optimize image file sizes
- Use WebP format
- Ensure images aren't too large (> 2MB)

**Blur placeholders not working?**
- Blur placeholders are included automatically
- They'll show a subtle color while images load
- This is normal and improves perceived performance

