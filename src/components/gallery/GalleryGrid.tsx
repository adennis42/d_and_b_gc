"use client";

import { useState, useMemo, useEffect } from "react";
import Image from "next/image";
import { Play } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { trackGalleryView } from "@/lib/analytics";
import { getYouTubeThumbnail } from "@/lib/video-utils";
import type { Project } from "@/types";

type FilterCategory = "all" | "kitchen" | "bathroom" | "sunroom" | "millwork";

/**
 * GalleryGrid component - Responsive grid layout for gallery projects
 * Features:
 * - Responsive CSS grid (1 col mobile, 2 tablet, 3 desktop)
 * - Category filter buttons (All, Kitchens, Bathrooms, Sunrooms, Millwork)
 * - Project cards with thumbnail, title, category badge
 * - Click handler for lightbox
 * - Smooth hover animations
 * - Next.js Image optimization with lazy loading
 * - Proper image sizing and aspect ratios
 */
export function GalleryGrid({
  projects,
  onProjectClick,
}: {
  projects: Project[];
  onProjectClick?: (project: Project, imageIndex: number) => void;
}) {
  const [activeFilter, setActiveFilter] = useState<FilterCategory>("all");

  // Filter projects based on active filter
  const filteredProjects = useMemo(() => {
    if (activeFilter === "all") {
      return projects;
    }
    return projects.filter((project) => project.category === activeFilter);
  }, [activeFilter, projects]);

  // Track gallery view and filter changes
  useEffect(() => {
    if (activeFilter === "all") {
      trackGalleryView("all", undefined, "view");
    } else {
      trackGalleryView(activeFilter, undefined, "filter");
    }
  }, [activeFilter]);

  // Handle project card click
  const handleProjectClick = (project: Project) => {
    // Track gallery interaction
    trackGalleryView(project.category, project.id, "lightbox_open");

    if (onProjectClick) {
      // Open lightbox with first image
      onProjectClick(project, 0);
    }
  };

  // Helper function to get projects by category
  const getProjectsByCategory = (category: FilterCategory) => {
    if (category === "all") {
      return projects;
    }
    return projects.filter((project) => project.category === category);
  };

  // Get category label
  const getCategoryLabel = (
    category: "kitchen" | "bathroom" | "sunroom" | "millwork"
  ) => {
    const labels: Record<
      "kitchen" | "bathroom" | "sunroom" | "millwork",
      string
    > = {
      kitchen: "Kitchen",
      bathroom: "Bathroom",
      sunroom: "Sunroom",
      millwork: "Millwork",
    };
    return labels[category];
  };

  // Get category badge variant color
  const getCategoryVariant = (
    category: "kitchen" | "bathroom" | "sunroom" | "millwork"
  ) => {
    const variants: Record<
      "kitchen" | "bathroom" | "sunroom" | "millwork",
      "default" | "secondary" | "outline"
    > = {
      kitchen: "default",
      bathroom: "secondary",
      sunroom: "outline",
      millwork: "outline",
    };
    return variants[category];
  };

  return (
    <div className="space-y-8">
      {/* Filter Buttons */}
      <div
        className="flex flex-wrap gap-3 justify-center"
        role="group"
        aria-label="Filter projects by category"
      >
        <Button
          variant={activeFilter === "all" ? "default" : "outline"}
          onClick={() => setActiveFilter("all")}
          className="transition-all focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
          aria-pressed={activeFilter === "all"}
          aria-label={`Show all projects (${projects.length} total)`}
        >
          All Projects
          <Badge 
            variant={activeFilter === "all" ? "secondary" : "outline"} 
            className={`ml-2 ${activeFilter === "all" ? "bg-white/20 text-white border-white/30" : ""}`}
            aria-hidden="true"
          >
            {projects.length}
          </Badge>
        </Button>
        <Button
          variant={activeFilter === "kitchen" ? "default" : "outline"}
          onClick={() => setActiveFilter("kitchen")}
          className="transition-all focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
          aria-pressed={activeFilter === "kitchen"}
          aria-label={`Filter by kitchen projects (${getProjectsByCategory("kitchen").length} projects)`}
        >
          Kitchens
          <Badge 
            variant={activeFilter === "kitchen" ? "secondary" : "outline"} 
            className={`ml-2 ${activeFilter === "kitchen" ? "bg-white/20 text-white border-white/30" : ""}`}
            aria-hidden="true"
          >
            {getProjectsByCategory("kitchen").length}
          </Badge>
        </Button>
        <Button
          variant={activeFilter === "bathroom" ? "default" : "outline"}
          onClick={() => setActiveFilter("bathroom")}
          className="transition-all focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
          aria-pressed={activeFilter === "bathroom"}
          aria-label={`Filter by bathroom projects (${getProjectsByCategory("bathroom").length} projects)`}
        >
          Bathrooms
          <Badge 
            variant={activeFilter === "bathroom" ? "secondary" : "outline"} 
            className={`ml-2 ${activeFilter === "bathroom" ? "bg-white/20 text-white border-white/30" : ""}`}
            aria-hidden="true"
          >
            {getProjectsByCategory("bathroom").length}
          </Badge>
        </Button>
        <Button
          variant={activeFilter === "sunroom" ? "default" : "outline"}
          onClick={() => setActiveFilter("sunroom")}
          className="transition-all focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
          aria-pressed={activeFilter === "sunroom"}
          aria-label={`Filter by sunroom projects (${getProjectsByCategory("sunroom").length} projects)`}
        >
          Sunrooms
          <Badge 
            variant={activeFilter === "sunroom" ? "secondary" : "outline"} 
            className={`ml-2 ${activeFilter === "sunroom" ? "bg-white/20 text-white border-white/30" : ""}`}
            aria-hidden="true"
          >
            {getProjectsByCategory("sunroom").length}
          </Badge>
        </Button>
        <Button
          variant={activeFilter === "millwork" ? "default" : "outline"}
          onClick={() => setActiveFilter("millwork")}
          className="transition-all focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
          aria-pressed={activeFilter === "millwork"}
          aria-label={`Filter by millwork projects (${getProjectsByCategory("millwork").length} projects)`}
        >
          Millwork
          <Badge 
            variant={activeFilter === "millwork" ? "secondary" : "outline"} 
            className={`ml-2 ${activeFilter === "millwork" ? "bg-white/20 text-white border-white/30" : ""}`}
            aria-hidden="true"
          >
            {getProjectsByCategory("millwork").length}
          </Badge>
        </Button>
      </div>

      {/* Gallery Grid */}
      {filteredProjects.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-muted-foreground">No projects found in this category.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProjects.map((project) => {
            const firstImage = project.images[0];
            const firstVideo = project.videos?.[0];
            const hasVideos = project.videos && project.videos.length > 0;
            const hasImages = project.images.length > 0;
            
            // Determine thumbnail source (prefer first image, fallback to video thumbnail)
            const thumbnailSource = firstImage 
              ? { type: 'image' as const, src: firstImage.url, alt: firstImage.alt, blurDataURL: firstImage.blurDataURL }
              : firstVideo 
                ? { type: 'video' as const, src: getYouTubeThumbnail(firstVideo.videoId, 'hq'), alt: firstVideo.alt }
                : null;
            
            if (!thumbnailSource) return null;

            // Calculate media counts
            const imageCount = project.images.length;
            const videoCount = project.videos?.length || 0;
            const totalMediaCount = imageCount + videoCount;

            return (
              <div
                key={project.id}
                className="group cursor-pointer"
                onClick={() => handleProjectClick(project)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    handleProjectClick(project);
                  }
                }}
                aria-label={`View ${project.title} project`}
              >
                <div className="relative overflow-hidden rounded-lg border bg-card hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                  {/* Media Container */}
                  <div className="relative aspect-[4/3] overflow-hidden bg-muted">
                    {thumbnailSource.type === 'image' ? (
                      <Image
                        src={thumbnailSource.src}
                        alt={thumbnailSource.alt}
                        fill
                        sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                        className="object-cover transition-transform duration-300 group-hover:scale-110"
                        loading="lazy"
                        quality={85}
                        placeholder={thumbnailSource.blurDataURL ? "blur" : "empty"}
                        blurDataURL={thumbnailSource.blurDataURL}
                      />
                    ) : (
                      <Image
                        src={thumbnailSource.src}
                        alt={thumbnailSource.alt}
                        fill
                        sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                        className="object-cover transition-transform duration-300 group-hover:scale-110"
                        loading="lazy"
                        quality={85}
                      />
                    )}
                    {/* Overlay on hover */}
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300" />
                    {/* Video play indicator */}
                    {hasVideos && (
                      <div className="absolute inset-0 flex items-center justify-center bg-black/20 group-hover:bg-black/30 transition-colors">
                        <div className="bg-white/90 rounded-full p-3 group-hover:bg-white group-hover:scale-110 transition-transform">
                          <Play className="h-8 w-8 text-black ml-1" fill="currentColor" aria-hidden="true" />
                        </div>
                      </div>
                    )}
                    {/* Category Badge */}
                    <div className="absolute top-3 right-3">
                      <Badge variant={getCategoryVariant(project.category)}>
                        {getCategoryLabel(project.category)}
                      </Badge>
                    </div>
                    {/* Featured Badge */}
                    {project.featured && (
                      <div className="absolute top-3 left-3">
                        <Badge variant="default" className="bg-primary/90">
                          Featured
                        </Badge>
                      </div>
                    )}
                    {/* Video Badge */}
                    {hasVideos && (
                      <div className="absolute top-3 left-3" style={{ marginTop: project.featured ? '2.5rem' : '0' }}>
                        <Badge variant="secondary" className="bg-blue-600/90 text-white">
                          Video
                        </Badge>
                      </div>
                    )}
                  </div>

                  {/* Project Info */}
                  <div className="p-4 space-y-2">
                    <h3 className="font-semibold text-lg group-hover:text-primary transition-colors">
                      {project.title}
                    </h3>
                    {project.description && (
                      <p className="text-sm text-muted-foreground line-clamp-2">
                        {project.description}
                      </p>
                    )}
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      {hasImages && hasVideos ? (
                        <span>
                          {imageCount} photo{imageCount !== 1 ? "s" : ""}, {videoCount} video{videoCount !== 1 ? "s" : ""}
                        </span>
                      ) : hasVideos ? (
                        <span>{videoCount} video{videoCount !== 1 ? "s" : ""}</span>
                      ) : (
                        <span>{imageCount} photo{imageCount !== 1 ? "s" : ""}</span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
