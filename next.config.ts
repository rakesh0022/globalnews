import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // ── Images ──────────────────────────────────────────────────────────────
  images: {
    // Serve modern formats — avif first (smaller), webp fallback
    formats: ["image/avif", "image/webp"],
    // Responsive breakpoints matching Tailwind's sm/md/lg/xl/2xl
    deviceSizes: [640, 750, 828, 1080, 1200, 1920],
    imageSizes: [16, 32, 64, 96, 128, 256],
    // Minimise layout shift — keep decoded images in memory
    minimumCacheTTL: 3600,
    remotePatterns: [
      { protocol: "https", hostname: "images.unsplash.com" },
      // NewsAPI images come from arbitrary CDNs — allow all HTTPS
      { protocol: "https", hostname: "**" },
    ],
  },

  // ── Compiler ─────────────────────────────────────────────────────────────
  compiler: {
    // Remove console.* in production builds
    removeConsole: process.env.NODE_ENV === "production"
      ? { exclude: ["error", "warn"] }
      : false,
  },

  // ── Headers ──────────────────────────────────────────────────────────────
  async headers() {
    return [
      {
        // Cache API responses at the edge for 5 minutes
        source: "/api/:path*",
        headers: [
          { key: "Cache-Control", value: "public, s-maxage=300, stale-while-revalidate=60" },
        ],
      },
    ];
  },
};

export default nextConfig;
