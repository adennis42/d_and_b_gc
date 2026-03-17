"use client";

import { motion, useReducedMotion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef, ReactNode } from "react";

interface ScrollRevealProps {
  children: ReactNode;
  delay?: number;
  direction?: "up" | "down" | "left" | "right" | "fade";
  duration?: number;
  className?: string;
}

/**
 * ScrollReveal - Reusable component for scroll-triggered animations
 * Fades in and slides content as it enters the viewport
 * Respects prefers-reduced-motion for accessibility
 */
export function ScrollReveal({
  children,
  delay = 0,
  direction = "up",
  duration = 0.6,
  className = "",
}: ScrollRevealProps) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const shouldReduceMotion = useReducedMotion();

  const variants = {
    hidden: {
      opacity: shouldReduceMotion ? 1 : 0,
      y: shouldReduceMotion ? 0 : direction === "up" ? 50 : direction === "down" ? -50 : 0,
      x: shouldReduceMotion ? 0 : direction === "left" ? 50 : direction === "right" ? -50 : 0,
    },
    visible: {
      opacity: 1,
      y: 0,
      x: 0,
      transition: {
        duration: shouldReduceMotion ? 0 : duration,
        delay: shouldReduceMotion ? 0 : delay,
        ease: [0.25, 0.46, 0.45, 0.94], // Custom easing for smooth feel
      },
    },
  };

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
      variants={variants}
      className={className}
    >
      {children}
    </motion.div>
  );
}
