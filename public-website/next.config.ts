import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Portfolio deployment: emit plain HTML/CSS/JS for Cloudflare Pages.
  output: "export",
  trailingSlash: true,
  images: {
    // The default Next image optimizer needs a Node server. All assets in the
    // portfolio build are local, so let the browser load the emitted files.
    unoptimized: true,
  },
};

export default nextConfig;
