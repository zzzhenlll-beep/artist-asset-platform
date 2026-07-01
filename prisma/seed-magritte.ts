import type { PrismaClient } from "@prisma/client";

import {
  MAGRITTE_ARCHIVE_NEWS,
  MAGRITTE_EARLY_SUPPORTERS,
  MAGRITTE_PROCESS_ASSETS,
  MAGRITTE_PROFILE,
  MAGRITTE_SERIES,
  MAGRITTE_TIMELINE,
  MAGRITTE_WORKS,
} from "../lib/magritte-archive-content";

export async function seedMagritte(
  prisma: PrismaClient,
  adminId: string,
  userId: string,
) {
  const c4 = await prisma.creator.create({
    data: {
      userId,
      displayName: MAGRITTE_PROFILE.displayName,
      city: MAGRITTE_PROFILE.city,
      medium: MAGRITTE_PROFILE.medium,
      bio: `${MAGRITTE_PROFILE.bio}\n\n${MAGRITTE_PROFILE.quote}`,
      statement: MAGRITTE_PROFILE.statement,
      keywords: [...MAGRITTE_PROFILE.keywords],
      tags: [...MAGRITTE_PROFILE.tags],
      socialLinks: MAGRITTE_PROFILE.socialLinks,
      openCollaboration: true,
      followerCount: MAGRITTE_PROFILE.followerCount,
    },
  });

  await prisma.user.update({
    where: { id: userId },
    data: { avatarUrl: MAGRITTE_PROFILE.avatarUrl, nickname: MAGRITTE_PROFILE.displayName },
  });

  const seriesIds: string[] = [];
  for (const s of MAGRITTE_SERIES) {
    const series = await prisma.series.create({
      data: {
        creatorId: c4.id,
        title: s.title,
        description: s.description,
        themeEvolution: s.themeEvolution,
        startYear: s.startYear,
        endYear: s.endYear,
        coverUrl: s.coverUrl,
        sortOrder: s.sortOrder,
      },
    });
    seriesIds.push(series.id);
  }

  const workIds: string[] = [];
  for (const w of MAGRITTE_WORKS) {
    const work = await prisma.work.create({
      data: {
        creatorId: c4.id,
        seriesId: seriesIds[w.seriesIndex],
        title: w.title,
        description: `${w.description}\n\n（${w.titleEn} · ${w.year}）`,
        year: w.year,
        dimensions: w.dimensions,
        workMedium: w.workMedium,
        saleStatus: "saleStatus" in w && w.saleStatus === "PRIVATE" ? "PRIVATE" : "UNSOLD",
        edition: w.edition,
        openPresaleConsult:
          "openPresaleConsult" in w && w.openPresaleConsult === false ? false : true,
        status: "PUBLISHED",
        openCollaboration: true,
        viewCount: w.viewCount,
        favoriteCount: w.favoriteCount,
        publishedAt: new Date(w.publishedAt),
        aiMeta: { tags: [...MAGRITTE_PROFILE.keywords], source: "musee-magritte-museum.be" },
        media: { create: [{ url: w.imageUrl, sortOrder: 0 }] },
      },
    });
    workIds.push(work.id);

    await prisma.rating.create({
      data: {
        workId: work.id,
        adminId,
        score: w.rating.score,
        comment: w.rating.comment,
      },
    });
  }

  await prisma.timelineEvent.createMany({
    data: MAGRITTE_TIMELINE.map((ev) => ({
      creatorId: c4.id,
      seriesId: "seriesIndex" in ev && ev.seriesIndex != null ? seriesIds[ev.seriesIndex] : null,
      year: ev.year,
      month: ev.month,
      title: ev.title,
      description: ev.description,
      eventType: ev.eventType,
      sortOrder: ev.sortOrder,
    })),
  });

  await prisma.processAsset.createMany({
    data: MAGRITTE_PROCESS_ASSETS.map((a) => ({
      creatorId: c4.id,
      seriesId: "seriesIndex" in a && a.seriesIndex != null ? seriesIds[a.seriesIndex] : null,
      title: a.title,
      description: a.description,
      assetType: a.assetType,
      url: a.url,
      visibility: a.visibility,
    })),
  });

  await prisma.earlySupporter.createMany({
    data: MAGRITTE_EARLY_SUPPORTERS.map((s) => ({
      creatorId: c4.id,
      name: s.name,
      note: s.note,
      sortOrder: s.sortOrder,
    })),
  });

  await prisma.archiveLog.createMany({
    data: [
      ...MAGRITTE_ARCHIVE_NEWS.map((n) => ({
        creatorId: c4.id,
        entityType: n.entityType,
        action: n.action,
        description: n.description,
      })),
      {
        creatorId: c4.id,
        entityType: "SERIES" as const,
        entityId: seriesIds[0],
        action: "CREATE",
        description: `建立系列「${MAGRITTE_SERIES[0].title}」`,
      },
      {
        creatorId: c4.id,
        entityType: "WORK" as const,
        entityId: workIds[0],
        action: "PUBLISH",
        description: `首次公开记录代表作《${MAGRITTE_WORKS[0].title}》`,
      },
    ],
  });

  return { creator: c4, seriesIds, workIds, featuredWorkId: workIds[3] ?? workIds[0] };
}
