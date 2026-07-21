import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactCompiler: true,
  compress: true,
  poweredByHeader: false,
  images: {
    formats: ["image/avif", "image/webp"],
    qualities: [70, 75, 90],
    deviceSizes: [640, 750, 1080, 1280],
    imageSizes: [64, 128, 256, 384],
  },
  experimental: {
    optimizePackageImports: ["react-icons", "framer-motion", "gsap"],
  },
};

export default nextConfig;
