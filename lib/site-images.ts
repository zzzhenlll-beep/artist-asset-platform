/** 站点本地配图（public/images），禁止运行时依赖外网图片 */
export const SITE_IMAGES = {
  avatar: "/images/placeholders/avatar.svg",
  work: "/images/placeholders/work.svg",
  cover: "/images/placeholders/cover.svg",
  series: "/images/placeholders/series.svg",
} as const;

export type SiteImageKind = keyof typeof SITE_IMAGES;

export function siteFallback(kind: SiteImageKind = "work") {
  return SITE_IMAGES[kind];
}

/** 优先使用主图，缺失时使用本地配图 */
export function resolveImageSrc(
  primary: string | null | undefined,
  kind: SiteImageKind = "work",
) {
  const trimmed = primary?.trim();
  if (trimmed) return trimmed;
  return siteFallback(kind);
}

/** 主图为 .jpg 时的 SVG 备用（下载失败或未 seed 时） */
export function siblingSvgFallback(primary: string) {
  if (primary.endsWith(".jpg")) {
    return primary.replace(/\.jpg$/, ".svg");
  }
  if (primary.endsWith(".jpeg")) {
    return primary.replace(/\.jpeg$/, ".svg");
  }
  return siteFallback("work");
}
