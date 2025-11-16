/**
 * Gallery skeleton loading component
 * Shows placeholder cards while gallery data loads
 */
export function GallerySkeleton() {
  return (
    <div className="space-y-8">
      {/* Filter Buttons Skeleton */}
      <div className="flex flex-wrap gap-3 justify-center">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="h-10 w-32 bg-muted animate-pulse rounded-md"
          />
        ))}
      </div>

      {/* Gallery Grid Skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div
            key={i}
            className="rounded-lg border bg-card overflow-hidden animate-pulse"
          >
            {/* Image Skeleton */}
            <div className="aspect-[4/3] bg-muted" />
            {/* Content Skeleton */}
            <div className="p-4 space-y-3">
              <div className="h-5 bg-muted rounded w-3/4" />
              <div className="h-4 bg-muted rounded w-full" />
              <div className="h-4 bg-muted rounded w-2/3" />
              <div className="h-3 bg-muted rounded w-1/4" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

