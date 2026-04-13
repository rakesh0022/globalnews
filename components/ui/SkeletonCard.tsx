"use client";

import { motion } from "framer-motion";

// ── Shimmer base — Framer Motion driven ──────────────────────────────────────
function Shimmer({ className = "", style }: { className?: string; style?: React.CSSProperties }) {
  return (
    <div className={`relative overflow-hidden bg-slate-200 dark:bg-slate-700/60 rounded ${className}`} style={style}>
      <motion.div
        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 dark:via-white/10 to-transparent"
        animate={{ x: ["-100%", "200%"] }}
        transition={{ duration: 1.6, repeat: Infinity, ease: "linear", repeatDelay: 0.1 }}
      />
    </div>
  );
}

// ── Vertical card skeleton ────────────────────────────────────────────────────
export default function SkeletonCard() {
  return (
    <motion.div
      className="rounded-2xl overflow-hidden bg-white dark:bg-[#0d1526] border border-slate-100 dark:border-slate-800"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <Shimmer className="w-full aspect-[16/9] rounded-none" />
      <div className="p-4 space-y-3">
        <Shimmer className="h-4 w-20 rounded-full" />
        <div className="space-y-2">
          <Shimmer className="h-4 w-full rounded-full" />
          <Shimmer className="h-4 w-4/5 rounded-full" />
        </div>
        <div className="space-y-1.5">
          <Shimmer className="h-3 w-full rounded-full" />
          <Shimmer className="h-3 w-3/4 rounded-full" />
        </div>
        <div className="flex items-center justify-between pt-1">
          <div className="flex items-center gap-2">
            <Shimmer className="w-5 h-5 rounded-full" />
            <Shimmer className="h-3 w-20 rounded-full" />
          </div>
          <Shimmer className="h-3 w-16 rounded-full" />
        </div>
      </div>
    </motion.div>
  );
}

// ── Grid of vertical skeletons ────────────────────────────────────────────────
export function SkeletonGrid({ count = 8 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
      {Array.from({ length: count }).map((_, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: i * 0.05 }}
        >
          <SkeletonCard />
        </motion.div>
      ))}
    </div>
  );
}

// ── Wide (horizontal) card skeleton ──────────────────────────────────────────
export function SkeletonCardWide() {
  return (
    <motion.div
      className="col-span-1 sm:col-span-2 flex flex-col sm:flex-row rounded-2xl overflow-hidden bg-white dark:bg-[#0d1526] border border-slate-100 dark:border-slate-800"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <Shimmer className="w-full sm:w-56 lg:w-64 h-52 sm:h-auto rounded-none shrink-0" />
      <div className="flex-1 p-5 space-y-3">
        <Shimmer className="h-4 w-20 rounded-full" />
        <div className="space-y-2">
          <Shimmer className="h-5 w-full rounded-full" />
          <Shimmer className="h-5 w-4/5 rounded-full" />
          <Shimmer className="h-5 w-3/5 rounded-full" />
        </div>
        <div className="space-y-1.5">
          <Shimmer className="h-3 w-full rounded-full" />
          <Shimmer className="h-3 w-3/4 rounded-full" />
        </div>
        <div className="flex items-center justify-between pt-2">
          <Shimmer className="h-3 w-24 rounded-full" />
          <Shimmer className="h-3 w-16 rounded-full" />
        </div>
      </div>
    </motion.div>
  );
}

// ── Hero section skeleton ─────────────────────────────────────────────────────
export function SkeletonHero() {
  return (
    <motion.div
      className="grid grid-cols-1 lg:grid-cols-12 gap-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
    >
      <div className="lg:col-span-7 rounded-2xl overflow-hidden">
        <Shimmer className="w-full min-h-[380px] lg:min-h-[500px] rounded-2xl" />
      </div>
      <div className="lg:col-span-5 flex flex-col gap-4">
        {[...Array(3)].map((_, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, x: 12 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, delay: 0.1 + i * 0.08 }}
            className="flex-1"
          >
            <Shimmer className="w-full rounded-xl min-h-[148px]" />
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}

// ── Article page skeleton ─────────────────────────────────────────────────────
export function SkeletonArticle() {
  return (
    <motion.div
      className="flex flex-col lg:flex-row gap-12"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
    >
      <div className="flex-1 min-w-0 space-y-6">
        <Shimmer className="h-5 w-32 rounded-full" />
        <div className="space-y-3">
          <Shimmer className="h-9 w-full rounded-xl" />
          <Shimmer className="h-9 w-5/6 rounded-xl" />
          <Shimmer className="h-9 w-4/6 rounded-xl" />
        </div>
        <Shimmer className="h-5 w-full rounded-full" />
        <Shimmer className="h-5 w-3/4 rounded-full" />
        <div className="flex items-center gap-3 py-4 border-y border-slate-100 dark:border-slate-800">
          <Shimmer className="w-11 h-11 rounded-full" />
          <div className="space-y-2">
            <Shimmer className="h-4 w-32 rounded-full" />
            <Shimmer className="h-3 w-48 rounded-full" />
          </div>
        </div>
        <Shimmer className="w-full rounded-2xl" style={{ aspectRatio: "16/9" }} />
        {[...Array(5)].map((_, i) => (
          <div key={i} className="space-y-2">
            <Shimmer className="h-4 w-full rounded-full" />
            <Shimmer className="h-4 w-11/12 rounded-full" />
            <Shimmer className="h-4 w-4/5 rounded-full" />
          </div>
        ))}
      </div>
      <div className="hidden lg:block w-[300px] shrink-0 space-y-4">
        <Shimmer className="h-48 rounded-2xl" />
        <Shimmer className="h-32 rounded-2xl" />
        <Shimmer className="h-64 rounded-2xl" />
      </div>
    </motion.div>
  );
}

// ── Trending list skeleton ────────────────────────────────────────────────────
export function SkeletonTrending({ count = 5 }: { count?: number }) {
  return (
    <div className="divide-y divide-slate-50 dark:divide-slate-800">
      {Array.from({ length: count }).map((_, i) => (
        <motion.div
          key={i}
          className="flex items-start gap-3 py-3 first:pt-0"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.25, delay: i * 0.06 }}
        >
          <Shimmer className="w-5 h-5 rounded shrink-0 mt-1" />
          <Shimmer className="w-[72px] h-[72px] rounded-xl shrink-0" />
          <div className="flex-1 space-y-2 pt-1">
            <Shimmer className="h-3 w-16 rounded-full" />
            <Shimmer className="h-3 w-full rounded-full" />
            <Shimmer className="h-3 w-3/4 rounded-full" />
          </div>
        </motion.div>
      ))}
    </div>
  );
}
