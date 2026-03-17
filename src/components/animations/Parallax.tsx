"use client";

import { motion, useScroll, useTransform, useReducedMotion } from "framer-motion";
import { useRef, ReactNode } from "react";

interface ParallaxProps {
  children: ReactNode;
  speed?: number;
  className?: string;
}

/**
 * Parallax - Parallax scroll effect component
 * Moves content at a different speed than scroll for depth effect
 * Respects prefers-reduced-motion for accessibility
 * @param speed - Speed multiplier (0.5 = moves at half scroll speed, 1.5 = moves faster)
 */
export function Parallax({
  children,
  speed = 0.5,
  className = "",
}: ParallaxProps) {
  const ref = useRef<HTMLDivElement>(null);
  const shouldReduceMotion = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  const y = useTransform(
    scrollYProgress,
    [0, 1],
    [0, shouldReduceMotion ? 0 : -100 * speed]
  );

  return (
    <motion.div ref={ref} style={{ y }} className={className}>
      {children}
    </motion.div>
  );
}
