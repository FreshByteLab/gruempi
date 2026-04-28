import type { NextConfig } from "next";

const isStaticExport = process.env.STATIC_EXPORT === "true";

const nextConfig: NextConfig = {
  output: isStaticExport ? "export" : undefined,
  // assetPrefix makes _next/ assets load from /gruempi/_next/ on GitHub Pages.
  // The route structure (/gruempi/*) naturally aligns with the repo's Pages URL prefix,
  // so internal navigation links already resolve correctly without basePath.
  assetPrefix: isStaticExport ? "/gruempi" : undefined,
  trailingSlash: isStaticExport ? true : undefined,
  images: {
    unoptimized: isStaticExport,
  },
  ...(isStaticExport
    ? {}
    : {
        experimental: {
          serverActions: {
            allowedOrigins: ["localhost:3000"],
          },
        },
      }),
};

export default nextConfig;
