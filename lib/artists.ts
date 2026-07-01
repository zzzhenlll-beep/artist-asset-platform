import type { ArchiveEntityType, Visibility } from "@prisma/client";

import { prisma } from "./db";
import { resolveImageSrc } from "./site-images";

export async function getArtistArchive(creatorId: string) {
  const creator = await prisma.creator.findUnique({
    where: { id: creatorId },
    include: {
      user: { select: { nickname: true, avatarUrl: true } },
      series: { orderBy: { sortOrder: "asc" } },
      works: {
        where: { status: "PUBLISHED" },
        include: {
          media: { orderBy: { sortOrder: "asc" }, take: 1 },
          rating: true,
          series: { select: { id: true, title: true } },
        },
        orderBy: [{ year: "desc" }, { publishedAt: "desc" }],
      },
      timelineEvents: { orderBy: [{ year: "desc" }, { sortOrder: "asc" }] },
      processAssets: {
        where: { visibility: "PUBLIC" },
        orderBy: { createdAt: "desc" },
      },
      earlySupporters: { orderBy: { sortOrder: "asc" } },
      archiveLogs: { orderBy: { createdAt: "desc" }, take: 20 },
    },
  });
  return creator;
}

export async function getPublishedArtists(limit = 12) {
  const artists = await prisma.creator.findMany({
    include: {
      user: { select: { nickname: true, avatarUrl: true } },
      works: {
        where: { status: "PUBLISHED" },
        include: { media: { orderBy: { sortOrder: "asc" }, take: 1 } },
        take: 1,
        orderBy: { publishedAt: "desc" },
      },
      _count: { select: { works: { where: { status: "PUBLISHED" } }, followers: true } },
    },
    take: limit,
    orderBy: { updatedAt: "desc" },
  });
  return artists.sort((a, b) => {
    if (a.displayName === "玛格丽特") return -1;
    if (b.displayName === "玛格丽特") return 1;
    return 0;
  });
}

export async function getWorkDetail(workId: string) {
  return prisma.work.findUnique({
    where: { id: workId },
    include: {
      media: { orderBy: { sortOrder: "asc" } },
      rating: { include: { admin: { select: { nickname: true } } } },
      series: true,
      creator: {
        include: { user: { select: { nickname: true, avatarUrl: true } } },
      },
    },
  });
}

export async function getSeriesDetail(seriesId: string) {
  return prisma.series.findUnique({
    where: { id: seriesId },
    include: {
      creator: { include: { user: { select: { nickname: true, avatarUrl: true } } } },
      works: {
        where: { status: "PUBLISHED" },
        include: { media: { orderBy: { sortOrder: "asc" }, take: 1 } },
        orderBy: { year: "asc" },
      },
      processAssets: { where: { visibility: "PUBLIC" }, orderBy: { createdAt: "asc" } },
      timelineEvents: { orderBy: [{ year: "asc" }, { sortOrder: "asc" }] },
    },
  });
}

export async function logArchiveEvent(
  creatorId: string,
  entityType: ArchiveEntityType,
  action: string,
  description: string,
  entityId?: string,
) {
  await prisma.archiveLog.create({
    data: { creatorId, entityType, action, description, entityId },
  });
}

export function parseJsonArray(value: unknown): string[] {
  if (Array.isArray(value)) return value.filter((v) => typeof v === "string") as string[];
  return [];
}

export function parseSocialLinks(value: unknown): Record<string, string> {
  if (value && typeof value === "object" && !Array.isArray(value)) {
    return value as Record<string, string>;
  }
  return {};
}

export function artistDisplayName(creator: {
  displayName: string | null;
  user: { nickname: string | null };
}) {
  return creator.displayName || creator.user.nickname || "未命名艺术家";
}

export function workCover(work: { media: { url: string }[] }) {
  return resolveImageSrc(work.media[0]?.url, "work");
}

export function filterProcessByVisibility<T extends { visibility: Visibility }>(
  assets: T[],
  isFollower: boolean,
) {
  return assets.filter(
    (a) => a.visibility === "PUBLIC" || (a.visibility === "SUPPORTERS" && isFollower),
  );
}
