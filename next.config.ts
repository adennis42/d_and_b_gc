import type { NextConfig } from "next";

const isDevelopment = process.env.NODE_ENV === "development";

const nextConfig: NextConfig = {
  reactCompiler: true,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "*.public.blob.vercel-storage.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "*.blob.vercel-storage.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "i.ytimg.com",
        pathname: "/**",
      },
    ],
    // Configure allowed image qualities
    // Next.js 16 requires explicit quality configuration
    qualities: [75, 85, 90, 100],
    // Optimize image loading for Core Web Vitals
    formats: ["image/avif", "image/webp"],
    minimumCacheTTL: 60 * 60 * 24 * 30, // 30 days
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  },
  // Add caching headers for static assets
  async headers() {
    const headers = [];

    if (isDevelopment) {
      // Development: Prevent all caching to avoid stale code
      headers.push(
        {
          source: "/:path*",
          headers: [
            {
              key: "Cache-Control",
              value: "no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0",
            },
            {
              key: "Pragma",
              value: "no-cache",
            },
            {
              key: "Expires",
              value: "0",
            },
            {
              key: "X-Content-Type-Options",
              value: "nosniff",
            },
          ],
        },
        // But allow long cache for static assets that have content hashes
        {
          source: "/_next/static/:path*",
          headers: [
            {
              key: "Cache-Control",
              value: "public, max-age=31536000, immutable",
            },
          ],
        }
      );
    } else {
      // Production: Smart caching strategy
      headers.push(
        // HTML pages: Short cache with revalidation to prevent stale content
        {
          source: "/:path*",
          headers: [
            {
              key: "Cache-Control",
              value: "public, s-maxage=60, stale-while-revalidate=300",
            },
            {
              key: "X-Content-Type-Options",
              value: "nosniff",
            },
          ],
        },
        // Static assets with content hashes: Long cache (immutable)
        {
          source: "/_next/static/:path*",
          headers: [
            {
              key: "Cache-Control",
              value: "public, max-age=31536000, immutable",
            },
          ],
        },
        // Images: Long cache with revalidation
        {
          source: "/images/:path*",
          headers: [
            {
              key: "Cache-Control",
              value: "public, max-age=31536000, immutable",
            },
          ],
        },
        // Optimized images: Long cache
        {
          source: "/_next/image",
          headers: [
            {
              key: "Cache-Control",
              value: "public, max-age=31536000, immutable",
            },
          ],
        },
        // Fonts: Long cache
        {
          source: "/fonts/:path*",
          headers: [
            {
              key: "Cache-Control",
              value: "public, max-age=31536000, immutable",
            },
          ],
        },
        // API routes: No cache
        {
          source: "/api/:path*",
          headers: [
            {
              key: "Cache-Control",
              value: "no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0",
            },
            {
              key: "Pragma",
              value: "no-cache",
            },
            {
              key: "Expires",
              value: "0",
            },
          ],
        }
      );
    }

    return headers;
  },
  // Compress responses
  compress: true,
  // Enable experimental features for better performance
  experimental: {
    optimizePackageImports: ["lucide-react", "@radix-ui/react-icons"],
  },
  // Ensure proper cache invalidation
  generateBuildId: async () => {
    // Use timestamp + git commit hash for build ID to ensure cache invalidation
    const timestamp = Date.now();
    // Try to get git commit hash, fallback to timestamp
    try {
      const { execSync } = require("child_process");
      const gitHash = execSync("git rev-parse --short HEAD").toString().trim();
      return `${timestamp}-${gitHash}`;
    } catch {
      return `build-${timestamp}`;
    }
  },
};

export default nextConfig;
