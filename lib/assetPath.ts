const assetBasePath = process.env.NEXT_PUBLIC_ASSET_BASE_PATH?.replace(/\/$/, "") ?? "";

export function assetPath(path: string) {
  if (!assetBasePath || path.startsWith(assetBasePath)) {
    return path;
  }

  if (/^(https?:|data:|blob:|mailto:|tel:|#)/.test(path)) {
    return path;
  }

  return `${assetBasePath}${path.startsWith("/") ? path : `/${path}`}`;
}
