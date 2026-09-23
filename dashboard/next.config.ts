import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Guest portfolio deployment: no Node runtime, cookies, middleware, or API.
  output: "export",
  trailingSlash: true,
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
