"use client";

import { useEffect } from "react";
import { AlertCircle, RefreshCw, Home } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

/**
 * Error boundary component for Next.js App Router
 * 
 * This component catches errors in the app and displays a friendly error message.
 * It provides a retry button to attempt recovery and a link back to home.
 * 
 * Props:
 * - error: The error object
 * - reset: Function to reset the error boundary and retry rendering
 */
interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function Error({ error, reset }: ErrorProps) {
  useEffect(() => {
    // Log error to console in development
    if (process.env.NODE_ENV === "development") {
      console.error("Error boundary caught an error:", error);
    }

    // In production, you might want to log to an error tracking service
    // Example: Sentry.captureException(error);
  }, [error]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4 py-12">
      <Card className="max-w-md w-full">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-destructive/10">
            <AlertCircle className="h-8 w-8 text-destructive" aria-hidden="true" />
          </div>
          <CardTitle className="text-2xl">Something went wrong</CardTitle>
          <CardDescription className="mt-2">
            We encountered an unexpected error. Don't worry, our team has been notified.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Error details (only in development) */}
          {process.env.NODE_ENV === "development" && error.message && (
            <div className="rounded-lg bg-muted p-4">
              <p className="text-sm font-mono text-muted-foreground break-words">
                {error.message}
              </p>
              {error.digest && (
                <p className="mt-2 text-xs text-muted-foreground">
                  Error ID: {error.digest}
                </p>
              )}
            </div>
          )}

          {/* Action buttons */}
          <div className="flex flex-col sm:flex-row gap-3">
            <Button
              onClick={reset}
              className="flex-1"
              size="lg"
            >
              <RefreshCw className="mr-2 h-4 w-4" aria-hidden="true" />
              Try Again
            </Button>
            <Button
              asChild
              variant="outline"
              className="flex-1"
              size="lg"
            >
              <Link href="/">
                <Home className="mr-2 h-4 w-4" aria-hidden="true" />
                Go Home
              </Link>
            </Button>
          </div>

          {/* Helpful links */}
          <div className="pt-4 border-t">
            <p className="text-sm text-muted-foreground text-center mb-3">
              Need help? Try these options:
            </p>
            <div className="flex flex-wrap gap-2 justify-center">
              <Button asChild variant="ghost" size="sm">
                <Link href="/schedule">Contact Us</Link>
              </Button>
              <Button asChild variant="ghost" size="sm">
                <Link href="/about">About Us</Link>
              </Button>
              <Button asChild variant="ghost" size="sm">
                <Link href="/gallery">View Gallery</Link>
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

