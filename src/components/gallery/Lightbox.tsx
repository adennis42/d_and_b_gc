"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import { useSwipeable } from "react-swipeable";
import { X, ChevronLeft, ChevronRight } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import type { Project } from "@/types";

interface LightboxProps {
  project: Project | null;
  initialImageIndex?: number;
  open: boolean;
  onClose: () => void;
}

/**
 * Lightbox component - Full-screen image viewer with navigation
 * Features:
 * - Full-screen overlay with dark background
 * - Large image display with Next.js Image optimization
 * - Navigation arrows to browse project images
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
  const [currentImageIndex, setCurrentImageIndex] = useState(initialImageIndex);

  // Reset image index when project changes
  useEffect(() => {
    if (project) {
      setCurrentImageIndex(initialImageIndex);
    }
  }, [project, initialImageIndex]);

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
  }, [open, project, currentImageIndex]);

  // Navigation handlers
  const handleNext = useCallback(() => {
    if (!project) return;
    setCurrentImageIndex((prev) =>
      prev < project.images.length - 1 ? prev + 1 : 0
    );
  }, [project]);

  const handlePrevious = useCallback(() => {
    if (!project) return;
    setCurrentImageIndex((prev) =>
      prev > 0 ? prev - 1 : project.images.length - 1
    );
  }, [project]);

  // Swipe handlers for mobile
  const swipeHandlers = useSwipeable({
    onSwipedLeft: handleNext,
    onSwipedRight: handlePrevious,
    trackMouse: false,
    preventScrollOnSwipe: true,
  });

  if (!project) return null;

  const currentImage = project.images[currentImageIndex];
  const hasMultipleImages = project.images.length > 1;

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
        <DialogTitle id="lightbox-title" className="sr-only">
          {project.title} - Image {currentImageIndex + 1} of {project.images.length}
        </DialogTitle>
        <DialogDescription id="lightbox-description" className="sr-only">
          {project.description || `Viewing images from ${project.title} project`}
        </DialogDescription>

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
          {hasMultipleImages && (
            <Button
              variant="ghost"
              size="icon"
              onClick={handlePrevious}
              className="absolute left-4 z-50 text-white hover:bg-white/20 hover:text-white hidden md:flex focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-black"
              aria-label={`Previous image (${currentImageIndex} of ${project.images.length})`}
              data-navigation
            >
              <ChevronLeft className="h-8 w-8" aria-hidden="true" />
            </Button>
          )}

          {/* Image */}
          <div className="relative w-full h-full max-w-6xl max-h-[80vh] flex items-center justify-center">
            {currentImage && (
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
          </div>

          {/* Next Button */}
          {hasMultipleImages && (
            <Button
              variant="ghost"
              size="icon"
              onClick={handleNext}
              className="absolute right-4 z-50 text-white hover:bg-white/20 hover:text-white hidden md:flex focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-black"
              aria-label={`Next image (${currentImageIndex + 2} of ${project.images.length})`}
              data-navigation
            >
              <ChevronRight className="h-8 w-8" aria-hidden="true" />
            </Button>
          )}

          {/* Mobile Navigation Dots */}
          {hasMultipleImages && (
            <div
              className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 md:hidden"
              role="tablist"
              aria-label="Image navigation"
            >
              {project.images.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentImageIndex(index)}
                  className={`h-2 rounded-full transition-all focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-black ${
                    index === currentImageIndex
                      ? "w-8 bg-white"
                      : "w-2 bg-white/50"
                  }`}
                  aria-label={`Go to image ${index + 1} of ${project.images.length}`}
                  aria-selected={index === currentImageIndex}
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
          {hasMultipleImages && (
            <div className="mt-3 text-white/60 text-sm">
              Image {currentImageIndex + 1} of {project.images.length}
            </div>
          )}
        </div>

        {/* Desktop Image Counter */}
        {hasMultipleImages && (
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 hidden md:block">
            <div className="bg-black/50 backdrop-blur-sm px-4 py-2 rounded-full text-white text-sm">
              {currentImageIndex + 1} / {project.images.length}
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
