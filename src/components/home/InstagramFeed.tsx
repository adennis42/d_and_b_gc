"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { Instagram } from "lucide-react";
import { ScrollReveal } from "@/components/animations/ScrollReveal";
import { StaggerChildren } from "@/components/animations/StaggerChildren";
import { trackExternalLink } from "@/lib/analytics";
import type { InstagramPost } from "@/lib/site-content";

interface InstagramFeedProps {
  posts?: InstagramPost[];
  instagramUrl?: string;
}

export function InstagramFeed({
  posts = [],
  instagramUrl = "https://instagram.com",
}: InstagramFeedProps) {
  // Fill to 6 slots so layout is always consistent
  const slots = [...posts, ...Array(Math.max(0, 6 - posts.length)).fill({ imageUrl: null, caption: "", permalink: "" })].slice(0, 6);

  return (
    <section className="py-20 md:py-32 bg-neutral-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <ScrollReveal direction="fade" className="text-center mb-16 md:mb-24">
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-6 text-neutral-900">
            Our Work
          </h2>
          <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto font-light">
            Follow our latest projects on Instagram
          </p>
        </ScrollReveal>

        <StaggerChildren staggerDelay={0.1}>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6 mb-12">
            {slots.map((post, index) => {
              const href = post.permalink || instagramUrl;
              return (
                <motion.a
                  key={index}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group relative aspect-square overflow-hidden rounded-lg cursor-pointer block"
                  whileHover={{ scale: 1.05 }}
                  transition={{ duration: 0.3, ease: "easeOut" }}
                  onClick={() => trackExternalLink(href, `Instagram post ${index + 1}`, "instagram-grid")}
                  aria-label={post.caption || `View on Instagram`}
                >
                  {post.imageUrl ? (
                    <Image
                      src={post.imageUrl}
                      alt={post.caption || `Instagram post ${index + 1}`}
                      fill
                      className="object-cover group-hover:scale-110 transition-transform duration-700"
                      sizes="(max-width: 768px) 50vw, 33vw"
                    />
                  ) : (
                    <div className="absolute inset-0 bg-gradient-to-br from-neutral-200 to-neutral-300 flex items-center justify-center">
                      <Instagram className="h-12 w-12 text-neutral-400" />
                    </div>
                  )}

                  {/* Hover overlay */}
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors duration-300 flex items-center justify-center">
                    <motion.div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <Instagram className="h-8 w-8 text-white" />
                    </motion.div>
                  </div>
                </motion.a>
              );
            })}
          </div>
        </StaggerChildren>

        {/* CTA */}
        <ScrollReveal direction="fade" className="text-center">
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <a
              href={instagramUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-3 px-8 py-4 bg-neutral-900 text-white rounded-lg font-medium text-lg hover:bg-neutral-800 transition-colors duration-300"
              onClick={() => trackExternalLink(instagramUrl, "Instagram", "instagram-feed-cta")}
            >
              <Instagram className="h-5 w-5" />
              View More on Instagram
            </a>
          </motion.div>
        </ScrollReveal>
      </div>
    </section>
  );
}
