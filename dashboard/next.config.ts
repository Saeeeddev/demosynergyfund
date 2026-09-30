import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Avoid Turbopack's large persistent dev cache on local machines.
  experimental: { turbopackFileSystemCacheForDev: false },
  // Guest portfolio deployment: no Node runtime, cookies, middleware, or API.
  output: "export",
  trailingSlash: true,
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
