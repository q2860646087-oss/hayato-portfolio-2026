import type { NextConfig } from "next";

const isGitHubActions = process.env.GITHUB_ACTIONS === "true";

const githubPagesConfig: NextConfig = {
  output: "export",
  images: {
    unoptimized: true,
  },
  trailingSlash: true,
  basePath: "/hayato-portfolio-2026",
  assetPrefix: "/hayato-portfolio-2026/",
  env: {
    NEXT_PUBLIC_ASSET_BASE_PATH: "/hayato-portfolio-2026",
  },
};

const nextConfig: NextConfig = {
  reactStrictMode: true,
  ...(isGitHubActions ? githubPagesConfig : {}),
};

export default nextConfig;
