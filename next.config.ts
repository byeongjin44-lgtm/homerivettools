import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Fully static site (every route is prerendered, all tool logic runs client-side).
  // `next build` writes the deployable site to `out/` — the Cloudflare Pages output directory.
  output: "export",
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
