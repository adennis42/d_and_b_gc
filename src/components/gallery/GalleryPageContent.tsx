"use client";

import { useState } from "react";
import Link from "next/link";
import { GalleryGrid } from "./GalleryGrid";
import { Lightbox } from "./Lightbox";
import type { Project } from "@/types";

/**
 * Gallery page content component (Client Component)
 * Handles interactive gallery features including lightbox
 */
export function GalleryPageContent() {
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);

  const handleProjectClick = (project: Project, imageIndex: number) => {
    setSelectedProject(project);
    setSelectedImageIndex(imageIndex);
    setLightboxOpen(true);
  };

  const handleCloseLightbox = () => {
    setLightboxOpen(false);
    // Small delay before clearing project to allow animation
    setTimeout(() => {
      setSelectedProject(null);
    }, 200);
  };

  return (
    <>
      {/* Hero Section */}
      <section className="py-12 md:py-16 bg-muted/30">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-4">
              Our Work
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground">
              Browse our portfolio of completed kitchen and bathroom remodeling
              projects. Each project showcases our commitment to quality
              craftsmanship, attention to detail, and exceptional design.
            </p>
          </div>
        </div>
      </section>

      {/* Gallery Grid */}
      <section className="py-8 md:py-12">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <GalleryGrid onProjectClick={handleProjectClick} />
        </div>
      </section>

      {/* Call-to-Action Section */}
      <section className="py-16 md:py-24 bg-primary text-primary-foreground">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">
              Ready to Start Your Project?
            </h2>
            <p className="text-lg mb-8 opacity-90">
              Schedule a free consultation to discuss your remodeling vision and
              get a personalized quote for your project.
            </p>
            <Link
              href="/schedule"
              className="inline-flex items-center justify-center rounded-md bg-background px-8 py-4 text-base font-medium text-foreground hover:bg-background/90 transition-colors"
            >
              Schedule Your Consultation
            </Link>
          </div>
        </div>
      </section>

      {/* Lightbox */}
      <Lightbox
        project={selectedProject}
        initialImageIndex={selectedImageIndex}
        open={lightboxOpen}
        onClose={handleCloseLightbox}
      />
    </>
  );
}

