import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    ppr: "incremental",
  },
  devIndicators: false,
  images: {
    domains: ["cdn.sanity.io"],
  },
};

export default nextConfig;

