import Link from "next/link";
import { Home, Image, Calendar, Users, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

/**
 * Custom 404 Not Found page
 * 
 * Displays a friendly message when a page is not found and provides
 * navigation options to help users find what they're looking for.
 */
export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4 py-12">
      <Card className="max-w-lg w-full text-center">
        <CardHeader>
          {/* 404 Visual */}
          <div className="mx-auto mb-6">
            <div className="text-8xl font-bold text-muted-foreground/20">
              404
            </div>
          </div>
          <CardTitle className="text-3xl mb-2">Page Not Found</CardTitle>
          <CardDescription className="text-base">
            Sorry, we couldn't find the page you're looking for. It may have been moved, deleted, or the URL might be incorrect.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Primary action */}
          <Button asChild size="lg" className="w-full sm:w-auto">
            <Link href="/">
              <Home className="mr-2 h-4 w-4" aria-hidden="true" />
              Go to Homepage
            </Link>
          </Button>

          {/* Quick navigation */}
          <div className="pt-6 border-t">
            <p className="text-sm font-medium text-muted-foreground mb-4">
              Popular Pages:
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <Button asChild variant="outline" className="justify-start">
                <Link href="/gallery">
                  <Image className="mr-2 h-4 w-4" aria-hidden="true" />
                  View Gallery
                </Link>
              </Button>
              <Button asChild variant="outline" className="justify-start">
                <Link href="/schedule">
                  <Calendar className="mr-2 h-4 w-4" aria-hidden="true" />
                  Schedule Consultation
                </Link>
              </Button>
              <Button asChild variant="outline" className="justify-start">
                <Link href="/about">
                  <Users className="mr-2 h-4 w-4" aria-hidden="true" />
                  About Us
                </Link>
              </Button>
              <Button asChild variant="outline" className="justify-start">
                <Link href="/">
                  <ArrowLeft className="mr-2 h-4 w-4" aria-hidden="true" />
                  Back to Home
                </Link>
              </Button>
            </div>
          </div>

          {/* Help text */}
          <div className="pt-4">
            <p className="text-sm text-muted-foreground">
              If you believe this is an error, please{" "}
              <Link
                href="/schedule"
                className="text-primary hover:underline font-medium"
              >
                contact us
              </Link>
              {" "}and let us know.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

