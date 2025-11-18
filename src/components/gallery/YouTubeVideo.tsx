"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { Play } from "lucide-react";
import { getYouTubeThumbnail, getYouTubeEmbedUrl } from "@/lib/video-utils";
import type { Video } from "@/types";

interface YouTubeVideoProps {
  video: Video;
  autoplay?: boolean;
  className?: string;
}

/**
 * YouTubeVideo component - Lazy-loaded YouTube embed with thumbnail placeholder
 * 
 * Features:
 * - Lazy loading (only loads iframe when clicked)
 * - YouTube thumbnail as placeholder
 * - Click-to-play functionality
 * - Responsive 16:9 aspect ratio
 * - Privacy-enhanced mode (youtube-nocookie.com)
 * - Accessibility: ARIA labels, keyboard navigation
 * - Error handling for invalid video IDs
 */
export function YouTubeVideo({
  video,
  autoplay = false,
  className = "",
}: YouTubeVideoProps) {
  const [isPlaying, setIsPlaying] = useState(false); // Always start false to prevent hydration mismatch
  const [hasError, setHasError] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Handle hydration - set autoplay after mount
  useEffect(() => {
    setIsMounted(true);
    if (autoplay) {
      setIsPlaying(true);
    }
  }, [autoplay]);

  const thumbnailUrl = video.thumbnailUrl || getYouTubeThumbnail(video.videoId, 'hq');
  
  // Only calculate embedUrl when needed (after mount) to prevent hydration mismatch
  const embedUrl = isMounted && isPlaying
    ? getYouTubeEmbedUrl(video.videoId, {
        usePrivacyMode: true,
        autoplay: true,
      })
    : '';

  // Calculate aspect ratio
  const aspectRatio = video.width / video.height;

  const handlePlay = () => {
    setIsPlaying(true);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      handlePlay();
    }
  };

  // Handle iframe load errors
  useEffect(() => {
    if (isPlaying && isMounted) {
      // Set a timeout to detect if video fails to load
      const timeout = setTimeout(() => {
        // Check if iframe is actually loaded (basic check)
        const iframe = containerRef.current?.querySelector('iframe');
        if (iframe && !iframe.contentWindow) {
          setHasError(true);
        }
      }, 5000);

      return () => clearTimeout(timeout);
    }
  }, [isPlaying, isMounted]);

  // Prevent hydration mismatch by showing placeholder during SSR
  if (!isMounted) {
    return (
      <div
        className={`relative w-full bg-black rounded-lg overflow-hidden ${className}`}
        style={{ aspectRatio: `${video.width} / ${video.height}` }}
      >
        <div className="absolute inset-0 bg-muted animate-pulse flex items-center justify-center">
          <Play className="h-12 w-12 text-muted-foreground" aria-hidden="true" />
        </div>
      </div>
    );
  }

  if (hasError) {
    return (
      <div
        className={`flex items-center justify-center bg-muted rounded-lg ${className}`}
        style={{ aspectRatio: `${video.width} / ${video.height}` }}
        role="alert"
        aria-live="polite"
      >
        <div className="text-center p-8">
          <p className="text-muted-foreground mb-2">Unable to load video</p>
          <p className="text-sm text-muted-foreground">
            Video ID: {video.videoId}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className={`relative w-full bg-black rounded-lg overflow-hidden ${className}`}
      style={{ aspectRatio: `${video.width} / ${video.height}` }}
    >
      {!isPlaying ? (
        // Thumbnail placeholder with play button
        <div
          className="relative w-full h-full cursor-pointer group"
          onClick={handlePlay}
          onKeyDown={handleKeyDown}
          role="button"
          tabIndex={0}
          aria-label={`Play video: ${video.alt}`}
        >
          <Image
            src={thumbnailUrl}
            alt={video.alt}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, (max-width: 1024px) 80vw, 70vw"
            loading="lazy"
            unoptimized={false}
          />
          {/* Play button overlay */}
          <div className="absolute inset-0 flex items-center justify-center bg-black/30 group-hover:bg-black/40 transition-colors">
            <div className="bg-white/90 rounded-full p-4 group-hover:bg-white group-hover:scale-110 transition-transform">
              <Play className="h-12 w-12 text-black ml-1" fill="currentColor" aria-hidden="true" />
            </div>
          </div>
          {/* Video duration or other info could go here */}
        </div>
      ) : (
        // YouTube iframe embed
        embedUrl && (
          <iframe
            src={embedUrl}
            title={video.alt}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
            className="absolute inset-0 w-full h-full"
            loading="lazy"
            aria-label={video.alt}
          />
        )
      )}
    </div>
  );
}

