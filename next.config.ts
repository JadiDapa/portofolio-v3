import type { NextConfig } from "next";

// Services were merged from five into four; keep the old links alive
const RENAMED_SERVICES: Record<string, string> = {
  "web-development": "software-development",
  "app-development": "software-development",
  "ai-machine-learning": "iot-ai-systems",
  "iot-hardware": "iot-ai-systems",
  "electronics-engineering": "electrical-engineering",
};

const nextConfig: NextConfig = {
  async redirects() {
    return Object.entries(RENAMED_SERVICES).map(([from, to]) => ({
      source: `/services/${from}`,
      destination: `/services/${to}`,
      permanent: true,
    }));
  },
  images: {
    remotePatterns: [
      { hostname: "images.unsplash.com" },
      { hostname: "images.pexels.com" },
    ],
  },
  experimental: {
    // Uploads go through a server action: the default 1MB rejects most images, and the
    // upload fields promise up to 50MB for video
    serverActions: { bodySizeLimit: "50mb" },
  },
};

export default nextConfig;
