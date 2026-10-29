import type { NextConfig } from "next";
import { hostRedirects, securityHeaders } from "./src/lib/hosts";

const nextConfig: NextConfig = {
  images: {
    // Fewer, smaller variants: no photo on the site is shown wider than ~1900 px.
    deviceSizes: [640, 828, 1080, 1440, 1920],
    imageSizes: [96, 128, 256, 384],
    // AVIF first (smaller), WebP for browsers without it.
    formats: ["image/avif", "image/webp"],
    // Photos change rarely; let browsers and the CDN keep optimised copies for 30 days.
    minimumCacheTTL: 2592000,
  },
  async redirects() {
    return hostRedirects();
  },
  async headers() {
    return securityHeaders();
  },
};

export default nextConfig;
