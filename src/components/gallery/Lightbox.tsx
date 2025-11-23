"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import Image from "next/image";
import { useSwipeable } from "react-swipeable";
import { X, ChevronLeft, ChevronRight } from "lucide-react";
import * as VisuallyHidden from "@radix-ui/react-visually-hidden";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { YouTubeVideo } from "./YouTubeVideo";
import { trackGalleryView } from "@/lib/analytics";
import type { Project } from "@/types";

interface LightboxProps {
  project: Project | null;
  initialImageIndex?: number;
  open: boolean;
  onClose: () => void;
}

/**
 * Lightbox component - Full-screen image and video viewer with navigation
 * Features:
 * - Full-screen overlay with dark background
 * - Large image display with Next.js Image optimization
 * - YouTube video embeds with lazy loading
 * - Navigation arrows to browse project media (images + videos)
 * - Project title and description display
 * - Close button (X) and ESC key support
 * - Click outside to close (via Radix Dialog)
 * - Keyboard arrow navigation (left/right arrows)
 * - Smooth transitions and animations
 * - Mobile-friendly with swipe gestures
 * - Prevents body scroll when open (handled by Radix Dialog)
 */
export function Lightbox({
  project,
  initialImageIndex = 0,
  open,
  onClose,
}: LightboxProps) {
  const [currentMediaIndex, setCurrentMediaIndex] = useState(initialImageIndex);

  // Combine images and videos into a single media array
  const mediaItems = useMemo(() => {
    if (!project) return [];
    const items: Array<{ type: 'image' | 'video'; index: number }> = [];
    
    // Add images
    project.images.forEach((_, index) => {
      items.push({ type: 'image', index });
    });
    
    // Add videos
    if (project.videos) {
      project.videos.forEach((_, index) => {
        items.push({ type: 'video', index });
      });
    }
    
    return items;
  }, [project]);

  // Get current media item
  const currentMedia = mediaItems[currentMediaIndex];
  const isVideo = currentMedia?.type === 'video';
  const isImage = currentMedia?.type === 'image';
  
  const currentImage = isImage && project ? project.images[currentMedia.index] : null;
  const currentVideo = isVideo && project ? project.videos?.[currentMedia.index] : null;
  
  const hasMultipleItems = mediaItems.length > 1;

  // Reset media index when project changes
  useEffect(() => {
    if (project) {
      // Clamp initial index to valid range
      const maxIndex = mediaItems.length > 0 ? mediaItems.length - 1 : 0;
      setCurrentMediaIndex(Math.min(initialImageIndex, maxIndex));
    }
  }, [project, initialImageIndex, mediaItems.length]);

  // Track image/video views when lightbox opens or media changes
  useEffect(() => {
    if (open && project && currentMedia) {
      if (isImage && currentImage) {
        trackGalleryView(project.category, project.id, "image_click");
      } else if (isVideo && currentVideo) {
        trackGalleryView(project.category, project.id, "video_play");
      }
    }
  }, [open, project, currentMediaIndex, isImage, isVideo, currentImage, currentVideo, currentMedia]);

  // Prevent body scroll when lightbox is open (Radix Dialog handles this, but we ensure it)
  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [open]);

  // Focus management: Focus close button when lightbox opens
  useEffect(() => {
    if (open && project) {
      // Small delay to ensure dialog is rendered
      const timer = setTimeout(() => {
        const closeButton = document.querySelector(
          '[aria-label="Close lightbox"]'
        ) as HTMLButtonElement;
        if (closeButton) {
          closeButton.focus();
        }
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [open, project]);

  // Keyboard navigation
  useEffect(() => {
    if (!open || !project) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      } else if (e.key === "ArrowLeft") {
        handlePrevious();
      } else if (e.key === "ArrowRight") {
        handleNext();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [open, project, currentMediaIndex]);

  // Navigation handlers
  const handleNext = useCallback(() => {
    if (mediaItems.length === 0) return;
    setCurrentMediaIndex((prev) =>
      prev < mediaItems.length - 1 ? prev + 1 : 0
    );
  }, [mediaItems.length]);

  const handlePrevious = useCallback(() => {
    if (mediaItems.length === 0) return;
    setCurrentMediaIndex((prev) =>
      prev > 0 ? prev - 1 : mediaItems.length - 1
    );
  }, [mediaItems.length]);

  // Swipe handlers for mobile
  const swipeHandlers = useSwipeable({
    onSwipedLeft: handleNext,
    onSwipedRight: handlePrevious,
    trackMouse: false,
    preventScrollOnSwipe: true,
  });

  if (!project || mediaItems.length === 0) return null;

  return (
    <Dialog open={open} onOpenChange={(isOpen) => !isOpen && onClose()}>
      <DialogContent
        className="max-w-7xl w-full h-full max-h-[95vh] p-0 gap-0 bg-black/95 border-none"
        showCloseButton={false}
        aria-labelledby="lightbox-title"
        aria-describedby="lightbox-description"
        onInteractOutside={(e) => {
          // Prevent closing when clicking on navigation buttons
          const target = e.target as HTMLElement;
          if (
            target.closest("[data-navigation]") ||
            target.closest("[data-image-container]")
          ) {
            e.preventDefault();
          }
        }}
      >
        {/* Dialog Title and Description (hidden but accessible to screen readers) */}
        <VisuallyHidden.Root>
          <DialogTitle id="lightbox-title">
            {project.title} - {isVideo ? 'Video' : 'Image'} {currentMediaIndex + 1} of {mediaItems.length}
          </DialogTitle>
          <DialogDescription id="lightbox-description">
            {project.description || `Viewing ${isVideo ? 'video' : 'images'} from ${project.title} project`}
          </DialogDescription>
        </VisuallyHidden.Root>

        {/* Close Button */}
        <Button
          variant="ghost"
          size="icon"
          onClick={onClose}
          className="absolute top-4 right-4 z-50 text-white hover:bg-white/20 hover:text-white focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-black"
          aria-label="Close lightbox"
        >
          <X className="h-6 w-6" aria-hidden="true" />
        </Button>

        {/* Image Container with Swipe Support */}
        <div
          {...swipeHandlers}
          className="relative flex-1 flex items-center justify-center p-4 md:p-8 min-h-0"
          data-image-container
        >
          {/* Previous Button */}
          {hasMultipleItems && (
            <Button
              variant="ghost"
              size="icon"
              onClick={handlePrevious}
              className="absolute left-4 z-50 text-white bg-black/50 hover:bg-black/70 backdrop-blur-sm border border-white/20 hover:border-white/40 rounded-full h-12 w-12 md:h-14 md:w-14 shadow-lg hover:shadow-xl transition-all duration-200 flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-black"
              aria-label={`Previous ${isVideo ? 'video' : 'image'} (${currentMediaIndex} of ${mediaItems.length})`}
              data-navigation
            >
              <ChevronLeft className="h-6 w-6 md:h-8 md:w-8" aria-hidden="true" />
            </Button>
          )}

          {/* Media Container */}
          <div className="relative w-full h-full max-w-6xl max-h-[80vh] flex items-center justify-center">
            {isImage && currentImage && (
              <Image
                src={currentImage.url}
                alt={currentImage.alt}
                width={currentImage.width}
                height={currentImage.height}
                className="object-contain max-w-full max-h-full rounded-lg"
                priority
                quality={90}
                sizes="(max-width: 768px) 100vw, 90vw"
                placeholder={currentImage.blurDataURL ? "blur" : "empty"}
                blurDataURL={currentImage.blurDataURL}
              />
            )}
            {isVideo && currentVideo && (
              <div className="w-full max-w-5xl">
                <YouTubeVideo video={currentVideo} autoplay={false} />
              </div>
            )}
          </div>

          {/* Next Button */}
          {hasMultipleItems && (
            <Button
              variant="ghost"
              size="icon"
              onClick={handleNext}
              className="absolute right-4 z-50 text-white bg-black/50 hover:bg-black/70 backdrop-blur-sm border border-white/20 hover:border-white/40 rounded-full h-12 w-12 md:h-14 md:w-14 shadow-lg hover:shadow-xl transition-all duration-200 flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-black"
              aria-label={`Next ${isVideo ? 'video' : 'image'} (${currentMediaIndex + 2} of ${mediaItems.length})`}
              data-navigation
            >
              <ChevronRight className="h-6 w-6 md:h-8 md:w-8" aria-hidden="true" />
            </Button>
          )}

          {/* Mobile Navigation Dots */}
          {hasMultipleItems && (
            <div
              className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 md:hidden"
              role="tablist"
              aria-label="Media navigation"
            >
              {mediaItems.map((item, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentMediaIndex(index)}
                  className={`h-2 rounded-full transition-all focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-black ${
                    index === currentMediaIndex
                      ? "w-8 bg-white"
                      : "w-2 bg-white/50"
                  }`}
                  aria-label={`Go to ${item.type} ${index + 1} of ${mediaItems.length}`}
                  aria-selected={index === currentMediaIndex}
                  role="tab"
                />
              ))}
            </div>
          )}
        </div>

        {/* Project Info */}
        <div className="px-4 md:px-8 py-4 md:py-6 bg-black/50 border-t border-white/10">
          <h2 className="text-white text-xl md:text-2xl mb-2 font-semibold">
            {project.title}
          </h2>
          {project.description && (
            <p className="text-white/80 text-sm md:text-base">
              {project.description}
            </p>
          )}
          {hasMultipleItems && (
            <div className="mt-3 text-white/60 text-sm">
              {isVideo ? 'Video' : 'Image'} {currentMediaIndex + 1} of {mediaItems.length}
            </div>
          )}
        </div>

        {/* Desktop Media Counter */}
        {hasMultipleItems && (
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 hidden md:block">
            <div className="bg-black/50 backdrop-blur-sm px-4 py-2 rounded-full text-white text-sm">
              {currentMediaIndex + 1} / {mediaItems.length}
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
