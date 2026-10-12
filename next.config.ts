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
      // UploadThing (see app/api/uploadthing)
      { hostname: "*.ufs.sh", pathname: "/f/*" },
    ],
  },
};

export default nextConfig;
