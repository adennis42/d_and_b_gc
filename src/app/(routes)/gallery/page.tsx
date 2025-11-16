import { Suspense } from "react";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { GalleryPageContent } from "@/components/gallery/GalleryPageContent";
import { GallerySkeleton } from "@/components/gallery/GallerySkeleton";
import { getGalleryMetadata } from "@/lib/metadata";

/**
 * Gallery page metadata for SEO
 * Generated using centralized metadata utility
 */
export const metadata = getGalleryMetadata();

/**
 * Gallery page component
 * Displays portfolio of completed kitchen and bathroom remodeling projects
 * Features:
 * - Hero section with title and description
 * - Interactive gallery grid with filtering
 * - Lightbox for full-size image viewing
 * - Call-to-action section
 * - Loading skeleton states
 * - Proper semantic HTML structure
 */
export default function GalleryPage() {
  return (
    <main>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        {/* Breadcrumb Navigation */}
        <Breadcrumbs items={[{ label: "Gallery", href: undefined }]} />
      </div>

      {/* Gallery Content with Suspense for Loading State */}
      <Suspense fallback={<GallerySkeleton />}>
        <GalleryPageContent />
      </Suspense>
    </main>
  );
}
