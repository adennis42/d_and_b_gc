"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { X } from 'lucide-react';
import * as LucideIcons from 'lucide-react';
import type { PromotionalBanner } from '@/lib/banners';
import { getCountdownText } from '@/lib/banner-utils';

interface PromotionalBannerProps {
  banner: PromotionalBanner;
}

/**
 * Promotional Banner Component
 * Displays customizable promotional banners with dismiss functionality
 */
export function PromotionalBanner({ banner }: PromotionalBannerProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const [isDismissing, setIsDismissing] = useState(false);
  const [countdownText, setCountdownText] = useState<string>('');

  useEffect(() => {
    // Check if banner was dismissed in this session only (sessionStorage)
    // This allows the banner to return on each new visit
    const dismissedBanners = sessionStorage.getItem('dismissedBanners');
    if (dismissedBanners) {
      const dismissed = JSON.parse(dismissedBanners);
      if (dismissed.includes(banner.id)) {
        setIsDismissed(true);
        return;
      }
    }
    
    // If not dismissed, show the banner with animation
    setIsMounted(true);
    // Small delay to trigger slide-down animation
    setTimeout(() => {
      setIsVisible(true);
    }, 10);
  }, [banner.id]);

  useEffect(() => {
    // Update countdown if enabled
    if (banner.show_countdown) {
      const updateCountdown = () => {
        setCountdownText(getCountdownText(banner.end_date));
      };
      
      // Update immediately
      updateCountdown();
      
      // Update every minute to keep it accurate
      const interval = setInterval(updateCountdown, 60000);
      
      return () => clearInterval(interval);
    }
  }, [banner.show_countdown, banner.end_date]);

  const handleDismiss = () => {
    if (!banner.is_dismissible || isDismissing) return;
    
    // Start slide-up animation
    setIsDismissing(true);
    setIsVisible(false);
    
    // Store dismissed banner ID in sessionStorage (cleared when session ends)
    // This allows the banner to return on each new visit
    const dismissedBanners = sessionStorage.getItem('dismissedBanners');
    const dismissed = dismissedBanners ? JSON.parse(dismissedBanners) : [];
    if (!dismissed.includes(banner.id)) {
      dismissed.push(banner.id);
      sessionStorage.setItem('dismissedBanners', JSON.stringify(dismissed));
    }
    
    // After animation completes, mark as dismissed
    setTimeout(() => {
      setIsDismissed(true);
    }, 500); // Match animation duration
  };

  // Don't render if dismissed or not mounted
  if (isDismissed || !isMounted) {
    return null;
  }

  // Get icon component dynamically
  const IconComponent = banner.icon_name 
    ? (LucideIcons[banner.icon_name as keyof typeof LucideIcons] as React.ComponentType<{ className?: string; size?: number }>)
    : null;

  return (
    <div
      className={`sticky top-0 z-50 w-full overflow-hidden transition-all duration-500 ease-out shadow-lg ${
        isVisible 
          ? 'translate-y-0 opacity-100' 
          : '-translate-y-full opacity-0'
      }`}
      style={{
        backgroundColor: banner.background_color,
        color: banner.text_color,
      }}
      onTransitionEnd={() => {
        // Ensure dismissed state is set after animation completes
        if (isDismissing && !isVisible) {
          setIsDismissed(true);
        }
      }}
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-3 py-[12.8px] md:py-[16px]">
          {/* Content */}
          <div className="flex items-center gap-3 flex-1 min-w-0">
            {IconComponent && (
              <div className="flex-shrink-0">
                <div className="p-1.5 rounded-lg bg-black/10 backdrop-blur-sm">
                  <IconComponent className="w-4 h-4 md:w-5 md:h-5" size={20} />
                </div>
              </div>
            )}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className="font-bold text-sm md:text-base leading-tight">
                  {banner.title}
                </h3>
                {banner.show_countdown && countdownText && (
                  <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-black/15 backdrop-blur-sm border border-black/10 whitespace-nowrap">
                    {countdownText}
                  </span>
                )}
              </div>
              {banner.description && (
                <p className="text-xs md:text-sm opacity-95 line-clamp-2 mt-1 leading-relaxed">
                  {banner.description}
                </p>
              )}
            </div>
          </div>

          {/* CTA Button */}
          {banner.button_text && banner.button_link && (
            <div className="flex-shrink-0 hidden sm:block">
              <Link
                href={banner.button_link}
                className="inline-flex items-center justify-center rounded-lg px-4 py-1.5 text-xs font-semibold transition-all duration-200 hover:scale-105 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-transparent"
                style={{
                  backgroundColor: banner.button_color,
                  color: banner.background_color,
                  boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15)',
                }}
              >
                {banner.button_text}
              </Link>
            </div>
          )}

          {/* Dismiss Button */}
          {banner.is_dismissible && (
            <button
              onClick={handleDismiss}
              className="flex-shrink-0 p-1.5 rounded-lg hover:bg-black/15 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-transparent active:scale-95"
              aria-label="Dismiss banner"
              style={{ color: banner.text_color }}
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

