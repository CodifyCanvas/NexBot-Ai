import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    domains: ["images.unsplash.com", "www.worldometers.info", "placehold.co"],
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;
