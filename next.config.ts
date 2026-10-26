import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Fewer, smaller variants: no photo on the site is shown wider than ~1900 px.
    deviceSizes: [640, 828, 1080, 1440, 1920],
    imageSizes: [96, 128, 256, 384],
  },
};

export default nextConfig;
