"use client";

import { motion, useInView, useReducedMotion, type Variants } from "framer-motion";
import { useRef, type ReactNode, type CSSProperties } from "react";
import {
  fadeUp,
  fadeIn,
  scaleIn,
  staggerContainer,
  staggerItem,
  pageTransition,
} from "./variants";

// ── Reduced-motion helper ─────────────────────────────────────────────────────
// When the user prefers reduced motion, collapse every variant to opacity-only.
function useMotionVariants(variants: Variants): Variants {
  const reduced = useReducedMotion();
  if (!reduced) return variants;

  const collapsed: Variants = {};
  for (const key of Object.keys(variants)) {
    const v = variants[key];
    const opacity = typeof v === "object" && v !== null && "opacity" in v
      ? (v as { opacity?: number }).opacity ?? 1
      : 1;
    collapsed[key] = { opacity };
  }
  return collapsed;
}

// ── FadeUp ────────────────────────────────────────────────────────────────────
interface FadeUpProps {
  children:   ReactNode;
  delay?:     number;
  className?: string;
  once?:      boolean;
}

export function FadeUp({ children, delay = 0, className, once = true }: FadeUpProps) {
  const ref      = useRef<HTMLDivElement>(null);
  const inView   = useInView(ref, { once, margin: "-60px 0px" });
  const variants = useMotionVariants(fadeUp);

  return (
    <motion.div
      ref={ref}
      variants={variants}
      initial="hidden"
      animate={inView ? "visible" : "hidden"}
      transition={{ delay }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

// ── FadeIn ────────────────────────────────────────────────────────────────────
export function FadeIn({ children, delay = 0, className }: FadeUpProps) {
  const ref      = useRef<HTMLDivElement>(null);
  const inView   = useInView(ref, { once: true, margin: "-40px 0px" });
  const variants = useMotionVariants(fadeIn);

  return (
    <motion.div
      ref={ref}
      variants={variants}
      initial="hidden"
      animate={inView ? "visible" : "hidden"}
      transition={{ delay }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

// ── ScaleIn ───────────────────────────────────────────────────────────────────
export function ScaleIn({ children, delay = 0, className }: FadeUpProps) {
  const variants = useMotionVariants(scaleIn);
  return (
    <motion.div
      variants={variants}
      initial="hidden"
      animate="visible"
      transition={{ delay }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

// ── StaggerList ───────────────────────────────────────────────────────────────
interface StaggerListProps {
  children:   ReactNode;
  className?: string;
  once?:      boolean;
}

export function StaggerList({ children, className, once = true }: StaggerListProps) {
  const ref      = useRef<HTMLDivElement>(null);
  const inView   = useInView(ref, { once, margin: "-40px 0px" });
  const variants = useMotionVariants(staggerContainer);

  return (
    <motion.div
      ref={ref}
      variants={variants}
      initial="hidden"
      animate={inView ? "visible" : "hidden"}
      className={className}
    >
      {children}
    </motion.div>
  );
}

// ── StaggerItem ───────────────────────────────────────────────────────────────
export function StaggerItem({ children, className }: { children: ReactNode; className?: string }) {
  const variants = useMotionVariants(staggerItem);
  return (
    <motion.div variants={variants} className={className}>
      {children}
    </motion.div>
  );
}

// ── PageTransition ────────────────────────────────────────────────────────────
export function PageTransition({ children, className }: { children: ReactNode; className?: string }) {
  const reduced  = useReducedMotion();
  const variants: Variants = reduced
    ? { initial: { opacity: 0 }, animate: { opacity: 1 }, exit: { opacity: 0 } }
    : pageTransition;

  return (
    <motion.div
      variants={variants}
      initial="initial"
      animate="animate"
      exit="exit"
      className={className}
    >
      {children}
    </motion.div>
  );
}

// ── MotionCard ────────────────────────────────────────────────────────────────
interface MotionCardProps {
  children:   ReactNode;
  className?: string;
  style?:     CSSProperties;
  onClick?:   () => void;
}

export function MotionCard({ children, className, style, onClick }: MotionCardProps) {
  const reduced = useReducedMotion();

  if (reduced) {
    return (
      <div className={className} style={style} onClick={onClick}>
        {children}
      </div>
    );
  }

  return (
    <motion.div
      className={className}
      style={style}
      onClick={onClick}
      whileHover={{ y: -5, transition: { type: "spring", stiffness: 300, damping: 20 } }}
      whileTap={{ scale: 0.98, y: -2, transition: { duration: 0.1 } }}
    >
      {children}
    </motion.div>
  );
}
