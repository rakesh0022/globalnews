"use client";

import { motion, useReducedMotion } from "framer-motion";
import { type ReactNode } from "react";

interface Props {
  children:   ReactNode;
  className?: string;
}

/**
 * Wraps every page with a subtle fade+slide-up entrance.
 * Respects prefers-reduced-motion — falls back to opacity-only.
 */
export default function PageWrapper({ children, className }: Props) {
  const reduced = useReducedMotion();

  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: reduced ? 0 : 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: [0.0, 0.0, 0.2, 1.0] }}
    >
      {children}
    </motion.div>
  );
}
