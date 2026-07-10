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
  basePath: "/portfolio",
  assetPrefix: "/portfolio",
  env: {
    NEXT_PUBLIC_ASSET_BASE_PATH: "/portfolio",
  },
};

const nextConfig: NextConfig = {
  reactStrictMode: true,
  ...(isStaticExport ? staticExportConfig : {}),
  ...(isGithubPages ? githubPagesConfig : {}),
};

export default nextConfig;
