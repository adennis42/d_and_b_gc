"use client";

import { useState, useEffect } from "react";
import { ReactCompareSlider, ReactCompareSliderImage } from "react-compare-slider";
import { cn } from "@/lib/utils";

/**
 * Image data structure for before/after comparison
 */
export interface BeforeAfterImage {
  url: string;
  alt: string;
  width: number;
  height: number;
  blurDataURL?: string;
}

interface BeforeAfterProps {
  /**
   * Before image data
   */
  beforeImage: BeforeAfterImage;
  /**
   * After image data
   */
  afterImage: BeforeAfterImage;
  /**
   * Label for the "before" side (default: "Before")
   */
  beforeLabel?: string;
  /**
   * Label for the "after" side (default: "After")
   */
  afterLabel?: string;
  /**
   * Initial slider position (0-100, default: 50)
   */
  initialPosition?: number;
  /**
   * Additional CSS classes
   */
  className?: string;
  /**
   * Whether to show labels (default: true)
   */
  showLabels?: boolean;
  /**
   * Aspect ratio for the container (default: "auto")
   * Can be "auto", "square", "video", or a custom ratio like "16/9"
   */
  aspectRatio?: "auto" | "square" | "video" | string;
}

/**
 * BeforeAfter component - Side-by-side before/after image comparison with draggable slider
 * 
 * Features:
 * - Draggable slider handle to reveal before/after images
 * - Labels for each side (customizable)
 * - Responsive layout (side-by-side desktop, stacked mobile)
 * - Next.js Image optimization
 * - Accessible with ARIA labels
 * - Smooth transitions
 * - Supports custom aspect ratios
 * 
 * Usage:
 * ```tsx
 * <BeforeAfter
 *   beforeImage={{
 *     url: "/images/before.jpg",
 *     alt: "Before renovation",
 *     width: 1920,
 *     height: 1280,
 *   }}
 *   afterImage={{
 *     url: "/images/after.jpg",
 *     alt: "After renovation",
 *     width: 1920,
 *     height: 1280,
 *   }}
 *   beforeLabel="Before"
 *   afterLabel="After"
 * />
 * ```
 */
export function BeforeAfter({
  beforeImage,
  afterImage,
  beforeLabel = "Before",
  afterLabel = "After",
  initialPosition = 50,
  className,
  showLabels = true,
  aspectRatio = "auto",
}: BeforeAfterProps) {
  const [position, setPosition] = useState(initialPosition);
  const [isMounted, setIsMounted] = useState(false);

  // Handle hydration for client-side only component
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Calculate aspect ratio class
  const getAspectRatioClass = () => {
    switch (aspectRatio) {
      case "square":
        return "aspect-square";
      case "video":
        return "aspect-video";
      case "auto":
        return "aspect-auto";
      default:
        // Custom ratio like "16/9" -> "aspect-[16/9]"
        return `aspect-[${aspectRatio}]`;
    }
  };

  // Calculate container aspect ratio based on image dimensions if auto
  const containerAspectRatio =
    aspectRatio === "auto"
      ? afterImage.width / afterImage.height
      : undefined;

  if (!isMounted) {
    // Return a placeholder during SSR to avoid hydration mismatch
    return (
      <div
        className={cn(
          "relative w-full bg-muted animate-pulse rounded-lg overflow-hidden",
          aspectRatio !== "auto" && getAspectRatioClass(),
          className
        )}
        style={
          containerAspectRatio
            ? { aspectRatio: containerAspectRatio }
            : undefined
        }
        aria-label="Before and after image comparison loading"
      >
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-muted-foreground">Loading comparison...</span>
        </div>
      </div>
    );
  }

  return (
    <div
      className={cn(
        "relative w-full rounded-lg overflow-hidden bg-muted",
        aspectRatio !== "auto" && getAspectRatioClass(),
        className
      )}
      style={
        containerAspectRatio ? { aspectRatio: containerAspectRatio } : undefined
      }
      role="img"
      aria-label={`${beforeLabel} and ${afterLabel} image comparison`}
    >
      {/* Before/After Slider */}
      <ReactCompareSlider
        position={position}
        onPositionChange={setPosition}
        itemOne={
          <ReactCompareSliderImage
            src={beforeImage.url}
            alt={beforeImage.alt}
            style={{ objectFit: "cover" }}
          />
        }
        itemTwo={
          <ReactCompareSliderImage
            src={afterImage.url}
            alt={afterImage.alt}
            style={{ objectFit: "cover" }}
          />
        }
        className="w-full h-full"
        style={{
          width: "100%",
          height: "100%",
        }}
        onlyHandleDraggable={false}
        boundsPadding={0}
      />

      {/* Labels Overlay */}
      {showLabels && (
        <>
          {/* Before Label */}
          <div
            className="absolute top-4 left-4 z-10 px-3 py-1.5 bg-black/70 text-white text-sm font-semibold rounded-md backdrop-blur-sm pointer-events-none"
            aria-hidden="true"
          >
            {beforeLabel}
          </div>

          {/* After Label */}
          <div
            className="absolute top-4 right-4 z-10 px-3 py-1.5 bg-black/70 text-white text-sm font-semibold rounded-md backdrop-blur-sm pointer-events-none"
            aria-hidden="true"
          >
            {afterLabel}
          </div>
        </>
      )}

      {/* Mobile Instructions (optional) */}
      <div
        className="absolute bottom-4 left-1/2 -translate-x-1/2 z-10 px-3 py-1.5 bg-black/70 text-white text-xs rounded-md backdrop-blur-sm pointer-events-none md:hidden"
        aria-hidden="true"
      >
        Drag to compare
      </div>
    </div>
  );
}

