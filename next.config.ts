import type { NextConfig } from "next";

const isGithubPages = process.env.GITHUB_ACTIONS === "true";
const isCloudBase = process.env.CLOUDBASE === "true";
const isStaticExport = isGithubPages || isCloudBase;

const staticExportConfig: NextConfig = {
  output: "export",
  images: {
    unoptimized: true,
  },
  trailingSlash: true,
};

const githubPagesConfig: NextConfig = {
  basePath: "/hayato-portfolio-2026",
  assetPrefix: "/hayato-portfolio-2026/",
  env: {
    NEXT_PUBLIC_ASSET_BASE_PATH: "/hayato-portfolio-2026",
  },
};

const nextConfig: NextConfig = {
  reactStrictMode: true,
  ...(isStaticExport ? staticExportConfig : {}),
  ...(isGithubPages ? githubPagesConfig : {}),
};

export default nextConfig;
