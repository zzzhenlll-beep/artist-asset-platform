import DiscoverPageClient from "./discover-client";
import { PageHero } from "@/components/museum/page-hero";
import { artistDisplayName, getPublishedArtists, parseJsonArray } from "@/lib/artists";
import { prisma } from "@/lib/db";
import { resolveImageSrc } from "@/lib/site-images";
import { extractWorkTags, toWorkCard } from "@/lib/serializers";

export const metadata = {
  title: "作品与系列",
};

export default async function DiscoverPage() {
  const artists = await getPublishedArtists(50);

  const works = await prisma.work.findMany({
    where: { status: "PUBLISHED" },
    include: {
      media: { orderBy: { sortOrder: "asc" }, take: 1 },
      rating: true,
      creator: { include: { user: { select: { nickname: true } } } },
    },
    orderBy: { publishedAt: "desc" },
  });

  const artistCards = artists.map((a) => ({
    id: a.id,
    name: artistDisplayName(a),
    avatar: resolveImageSrc(a.user.avatarUrl, "avatar"),
    city: a.city,
    medium: a.medium,
    keywords: parseJsonArray(a.keywords),
    workCount: a._count.works,
    followerCount: a.followerCount,
    coverImage: a.works[0]?.media[0]?.url,
  }));

  const workCards = works.map((w) =>
    toWorkCard(
      { ...w, creator: w.creator },
      extractWorkTags(w.aiMeta, parseJsonArray(w.creator.tags)),
    ),
  );

  const mediums = [...new Set(artists.map((a) => a.medium).filter(Boolean) as string[])];

  return (
    <>
      <PageHero
        eyebrow="Collections"
        title="作品与系列"
        description="浏览艺术家索引与结构化作品典藏，按系列与创作脉络组织。"
      />
      <DiscoverPageClient artists={artistCards} works={workCards} mediums={mediums} />
    </>
  );
}
