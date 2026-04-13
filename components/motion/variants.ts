/**
 * Shared Framer Motion variants used across the app.
 * Centralised here so every component uses the same easing curves.
 */

import type { Variants } from "framer-motion";

// ── Easing presets ────────────────────────────────────────────────────────────
export const SPRING_SNAPPY = { type: "spring", stiffness: 400, damping: 30 } as const;
export const SPRING_BOUNCY = { type: "spring", stiffness: 300, damping: 20 } as const;
export const EASE_OUT      = [0.0, 0.0, 0.2, 1.0] as const;
export const EASE_BACK     = [0.34, 1.56, 0.64, 1] as const;

// ── Fade up — used for section reveals ───────────────────────────────────────
export const fadeUp: Variants = {
  hidden:  { opacity: 0, y: 20 },
  visible: {
    opacity: 1, y: 0,
    transition: { duration: 0.45, ease: EASE_OUT },
  },
};

// ── Fade in — simple opacity ──────────────────────────────────────────────────
export const fadeIn: Variants = {
  hidden:  { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.35, ease: EASE_OUT } },
};

// ── Scale in — for modals, dropdowns, badges ─────────────────────────────────
export const scaleIn: Variants = {
  hidden:  { opacity: 0, scale: 0.94 },
  visible: {
    opacity: 1, scale: 1,
    transition: { duration: 0.3, ease: EASE_BACK },
  },
};

// ── Stagger container — wraps a list of children ─────────────────────────────
export const staggerContainer: Variants = {
  hidden:  {},
  visible: {
    transition: { staggerChildren: 0.07, delayChildren: 0.05 },
  },
};

// ── Stagger item — each child in a staggered list ────────────────────────────
export const staggerItem: Variants = {
  hidden:  { opacity: 0, y: 16 },
  visible: {
    opacity: 1, y: 0,
    transition: { duration: 0.4, ease: EASE_OUT },
  },
};

// ── Card hover lift ───────────────────────────────────────────────────────────
export const cardHover = {
  rest:  { y: 0,  boxShadow: "0 1px 3px rgba(15,23,42,0.06)" },
  hover: {
    y: -5,
    boxShadow: "0 20px 40px rgba(15,23,42,0.12), 0 4px 12px rgba(15,23,42,0.06)",
    transition: SPRING_BOUNCY,
  },
  tap: { y: -2, scale: 0.99, transition: { duration: 0.1 } },
} as const;

// ── Page transition ───────────────────────────────────────────────────────────
export const pageTransition: Variants = {
  initial: { opacity: 0, y: 8 },
  animate: {
    opacity: 1, y: 0,
    transition: { duration: 0.35, ease: EASE_OUT },
  },
  exit: {
    opacity: 0, y: -8,
    transition: { duration: 0.2, ease: EASE_OUT },
  },
};
