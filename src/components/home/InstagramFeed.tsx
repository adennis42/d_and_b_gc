"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { Instagram } from "lucide-react";
import { ScrollReveal } from "@/components/animations/ScrollReveal";
import { StaggerChildren } from "@/components/animations/StaggerChildren";
import { trackExternalLink } from "@/lib/analytics";

/**
 * InstagramFeed component - Showcase Instagram posts with scroll animations
 * Features:
 * - Grid layout: 3 columns desktop, 2 mobile
 * - Hover effects: scale + caption overlay
 * - Scroll-triggered sequential fade-in animations
 * - "View More on Instagram" CTA button
 * - Design-focused presentation
 */
interface InstagramPost {
  id: string;
  imageUrl: string;
  caption?: string;
  permalink: string;
}

interface InstagramFeedProps {
  posts?: InstagramPost[];
  instagramUrl?: string;
}

export function InstagramFeed({
  posts = [],
  instagramUrl = "https://instagram.com", // Default - should be set via env or admin
}: InstagramFeedProps) {
  // Placeholder posts for demonstration
  // In production, these would come from Instagram API or admin-selected posts
  const placeholderPosts: InstagramPost[] = posts.length > 0 
    ? posts 
    : Array.from({ length: 6 }, (_, i) => ({
        id: `placeholder-${i}`,
        imageUrl: `/images/instagram/placeholder-${i + 1}.jpg`,
        caption: `Featured project ${i + 1}`,
        permalink: instagramUrl,
      }));

  return (
    <section className="py-20 md:py-32 bg-neutral-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <ScrollReveal direction="fade" className="text-center mb-16 md:mb-24">
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-6 text-neutral-900">
            Our Work
          </h2>
          <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto font-light">
            Follow our latest projects on Instagram
          </p>
        </ScrollReveal>

        {/* Instagram Grid */}
        <StaggerChildren staggerDelay={0.1}>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6 mb-12">
            {placeholderPosts.slice(0, 6).map((post, index) => (
              <motion.div
                key={post.id}
                className="group relative aspect-square overflow-hidden rounded-lg cursor-pointer"
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.3, ease: "easeOut" }}
              >
                {/* Image */}
                <div className="absolute inset-0 bg-gradient-to-br from-neutral-200 to-neutral-300">
                  {/* Placeholder gradient - replace with actual Instagram images */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Instagram className="h-12 w-12 text-neutral-400" />
                  </div>
                  {/* When images are available, uncomment this:
                  <Image
                    src={post.imageUrl}
                    alt={post.caption || `Instagram post ${index + 1}`}
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-700"
                    sizes="(max-width: 768px) 50vw, 33vw"
                  />
                  */}
                </div>

                {/* Hover Overlay */}
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors duration-300 flex items-center justify-center">
                  <motion.div
                    className="opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                    initial={{ scale: 0.8 }}
                    whileHover={{ scale: 1 }}
                  >
                    <Instagram className="h-8 w-8 text-white" />
                  </motion.div>
                </div>
              </motion.div>
            ))}
          </div>
        </StaggerChildren>

        {/* CTA Button */}
        <ScrollReveal direction="fade" className="text-center">
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Link
              href={instagramUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-3 px-8 py-4 bg-neutral-900 text-white rounded-lg font-medium text-lg hover:bg-neutral-800 transition-colors duration-300"
              onClick={() => trackExternalLink(instagramUrl, "Instagram", "instagram-feed-cta")}
            >
              <Instagram className="h-5 w-5" />
              View More on Instagram
            </Link>
          </motion.div>
        </ScrollReveal>
      </div>
    </section>
  );
}
