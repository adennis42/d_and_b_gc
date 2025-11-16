import { Loader2 } from "lucide-react";

/**
 * Global loading UI component
 * 
 * Displays a loading spinner while pages or data are being fetched.
 * This is shown automatically by Next.js during route transitions and
 * while Suspense boundaries are resolving.
 * 
 * Features:
 * - Centered loading spinner
 * - Accessible (screen reader friendly)
 * - Consistent with app design
 * - Smooth animations
 */
export default function Loading() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="flex flex-col items-center gap-4">
        {/* Loading spinner */}
        <Loader2
          className="h-8 w-8 animate-spin text-primary"
          aria-hidden="true"
        />
        {/* Loading text */}
        <p className="text-sm text-muted-foreground" aria-live="polite">
          Loading...
        </p>
      </div>
    </div>
  );
}

