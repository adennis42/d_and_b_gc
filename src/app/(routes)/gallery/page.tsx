"use client";

import { useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Instagram, ArrowRight } from "lucide-react";
import { trackExternalLink } from "@/lib/analytics";

/**
 * Gallery page - Redirects to Instagram
 * Simple landing page directing users to view portfolio on Instagram
 */
export default function GalleryPage() {
  const instagramUrl = process.env.NEXT_PUBLIC_INSTAGRAM_URL || "https://instagram.com";

  // Optional: Auto-redirect after 2 seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      window.location.href = instagramUrl;
    }, 2000);
    return () => clearTimeout(timer);
  }, [instagramUrl]);

  return (
    <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-neutral-50 to-neutral-100">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-2xl mx-auto text-center space-y-8"
        >
          <motion.div
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            className="inline-block"
          >
            <Instagram className="h-16 w-16 md:h-20 md:w-20 text-neutral-900 mx-auto" />
          </motion.div>

          <div className="space-y-4">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-neutral-900">
              View Our Work
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground font-light">
              Follow us on Instagram to see our latest projects
            </p>
          </div>

          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="pt-4"
          >
            <a
              href={instagramUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-3 px-8 py-4 bg-neutral-900 text-white rounded-lg font-medium text-lg hover:bg-neutral-800 transition-colors duration-300 shadow-lg"
              onClick={() => trackExternalLink(instagramUrl, "Instagram", "gallery-redirect")}
            >
              <Instagram className="h-5 w-5" />
              Visit Our Instagram
              <ArrowRight className="h-5 w-5" />
            </a>
          </motion.div>

          <p className="text-sm text-muted-foreground pt-4">
            Redirecting automatically in 2 seconds...
          </p>

          <div className="pt-8">
            <Link
              href="/"
              className="text-sm text-muted-foreground hover:text-neutral-900 transition-colors underline"
            >
              Return to Home
            </Link>
          </div>
        </motion.div>
      </div>
    </main>
  );
}
