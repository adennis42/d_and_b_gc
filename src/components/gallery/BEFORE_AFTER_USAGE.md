# BeforeAfter Component Usage Guide

The `BeforeAfter` component provides a side-by-side before/after image comparison with a draggable slider.

## Basic Usage

```tsx
import { BeforeAfter } from "@/components/gallery/BeforeAfter";

<BeforeAfter
  beforeImage={{
    url: "/images/gallery/kitchens/kitchen-001-before.jpg",
    alt: "Kitchen before renovation",
    width: 1920,
    height: 1280,
  }}
  afterImage={{
    url: "/images/gallery/kitchens/kitchen-001-after.jpg",
    alt: "Kitchen after renovation",
    width: 1920,
    height: 1280,
  }}
  beforeLabel="Before"
  afterLabel="After"
/>
```

## Custom Labels

```tsx
<BeforeAfter
  beforeImage={beforeImage}
  afterImage={afterImage}
  beforeLabel="Original"
  afterLabel="Renovated"
/>
```

## Custom Aspect Ratio

```tsx
// Square aspect ratio
<BeforeAfter
  beforeImage={beforeImage}
  afterImage={afterImage}
  aspectRatio="square"
/>

// Video aspect ratio (16:9)
<BeforeAfter
  beforeImage={beforeImage}
  afterImage={afterImage}
  aspectRatio="video"
/>

// Custom ratio
<BeforeAfter
  beforeImage={beforeImage}
  afterImage={afterImage}
  aspectRatio="4/3"
/>

// Auto (uses image dimensions)
<BeforeAfter
  beforeImage={beforeImage}
  afterImage={afterImage}
  aspectRatio="auto"
/>
```

## Hide Labels

```tsx
<BeforeAfter
  beforeImage={beforeImage}
  afterImage={afterImage}
  showLabels={false}
/>
```

## Custom Initial Position

```tsx
// Start with 30% showing the "after" image
<BeforeAfter
  beforeImage={beforeImage}
  afterImage={afterImage}
  initialPosition={30}
/>
```

## Using with Project Data

If your project has before/after images, you can use them like this:

```tsx
import { BeforeAfter, type BeforeAfterImage } from "@/components/gallery/BeforeAfter";
import type { Project } from "@/types";

function ProjectBeforeAfter({ project }: { project: Project }) {
  // Assuming first image is "before" and second is "after"
  const beforeImage: BeforeAfterImage = project.images[0];
  const afterImage: BeforeAfterImage = project.images[1];

  return (
    <BeforeAfter
      beforeImage={beforeImage}
      afterImage={afterImage}
      beforeLabel="Before Renovation"
      afterLabel="After Renovation"
      className="my-8"
    />
  );
}
```

## Features

- ✅ Draggable slider handle
- ✅ Responsive (side-by-side desktop, works on mobile)
- ✅ Customizable labels
- ✅ Custom aspect ratios
- ✅ Accessible (ARIA labels)
- ✅ Smooth transitions
- ✅ SSR-safe (handles hydration)

## Notes

- The component uses `react-compare-slider` library for the slider functionality
- Images should have the same dimensions for best results
- The component is client-side only (uses `"use client"`)
- Labels are positioned absolutely and won't interfere with dragging

