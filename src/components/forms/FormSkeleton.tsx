/**
 * Form skeleton loading component
 * Shows placeholder fields while form loads
 * Prevents layout shift and improves perceived performance
 */
export function FormSkeleton() {
  return (
    <div className="space-y-6 animate-pulse">
      {/* Name Field Skeleton */}
      <div className="space-y-2">
        <div className="h-4 w-20 bg-muted rounded" />
        <div className="h-10 w-full bg-muted rounded" />
      </div>

      {/* Email Field Skeleton */}
      <div className="space-y-2">
        <div className="h-4 w-16 bg-muted rounded" />
        <div className="h-10 w-full bg-muted rounded" />
      </div>

      {/* Phone Field Skeleton */}
      <div className="space-y-2">
        <div className="h-4 w-20 bg-muted rounded" />
        <div className="h-10 w-full bg-muted rounded" />
      </div>

      {/* Project Type Field Skeleton */}
      <div className="space-y-2">
        <div className="h-4 w-24 bg-muted rounded" />
        <div className="h-10 w-full bg-muted rounded" />
      </div>

      {/* Message Field Skeleton */}
      <div className="space-y-2">
        <div className="h-4 w-20 bg-muted rounded" />
        <div className="h-32 w-full bg-muted rounded" />
      </div>

      {/* Submit Button Skeleton */}
      <div className="h-10 w-32 bg-muted rounded" />
    </div>
  );
}

