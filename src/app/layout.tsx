import { Geist, Geist_Mono } from "next/font/google";
import { Toaster } from "sonner";
import "./globals.css";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { StructuredData } from "@/components/StructuredData";
import { GoogleAnalytics } from "@/components/analytics/GoogleAnalytics";
import { SkipToContent } from "@/components/accessibility/SkipToContent";
import { defaultMetadata } from "@/lib/metadata";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap", // Optimize font loading
  preload: true, // Preload critical font
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap", // Optimize font loading
  preload: false, // Not critical, don't preload
});

/**
 * Root layout metadata
 * Uses default metadata as base, can be overridden by page-specific metadata
 */
export const metadata = defaultMetadata;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        {/* Preload critical fonts for better LCP */}
        {/* Next.js automatically handles font preloading via next/font */}
        {/* The display: "swap" ensures text remains visible during font load */}
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased flex flex-col min-h-screen`}
        suppressHydrationWarning
      >
        {/* Skip to main content link for accessibility */}
        <SkipToContent />
        {/* JSON-LD Structured Data for LocalBusiness schema */}
        {/* Note: JSON-LD structured data works fine in the body and is recommended by Google */}
        <StructuredData
          address={{
            streetAddress: process.env.NEXT_PUBLIC_BUSINESS_STREET || "",
            addressLocality: process.env.NEXT_PUBLIC_BUSINESS_CITY || "",
            addressRegion: process.env.NEXT_PUBLIC_BUSINESS_STATE || "",
            postalCode: process.env.NEXT_PUBLIC_BUSINESS_ZIP || "",
            addressCountry: process.env.NEXT_PUBLIC_BUSINESS_COUNTRY || "US",
          }}
          telephone={process.env.NEXT_PUBLIC_BUSINESS_PHONE}
          email={process.env.NEXT_PUBLIC_BUSINESS_EMAIL}
          openingHours={
            process.env.NEXT_PUBLIC_BUSINESS_HOURS
              ? process.env.NEXT_PUBLIC_BUSINESS_HOURS.split(",")
              : ["Mo-Fr 08:00-17:00", "Sa 09:00-13:00"]
          }
          serviceAreas={
            process.env.NEXT_PUBLIC_SERVICE_AREAS
              ? process.env.NEXT_PUBLIC_SERVICE_AREAS.split(",")
              : ["New York", "Long Island", "Westchester County"]
          }
          aggregateRating={
            process.env.NEXT_PUBLIC_RATING_VALUE &&
            process.env.NEXT_PUBLIC_REVIEW_COUNT
              ? {
                  ratingValue: parseFloat(
                    process.env.NEXT_PUBLIC_RATING_VALUE
                  ),
                  reviewCount: parseInt(
                    process.env.NEXT_PUBLIC_REVIEW_COUNT
                  ),
                }
              : undefined
          }
          logo={process.env.NEXT_PUBLIC_BUSINESS_LOGO || "/images/logo.png"}
          image={process.env.NEXT_PUBLIC_BUSINESS_IMAGE || "/images/og-image.jpg"}
        />
        <Header />
        <main id="main-content" className="flex-1" tabIndex={-1}>
          {children}
        </main>
        <Footer />
        <Toaster position="top-center" richColors />
        {/* Google Analytics - Only loads in production */}
        {/* Page views are tracked automatically by GA4 */}
        <GoogleAnalytics />
      </body>
    </html>
  );
}
