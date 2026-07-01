import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";

import { SiteImage } from "@/components/ui/site-image";
import { WorkDetailActions } from "@/components/works/work-detail-actions";
import { RatingBadge } from "@/components/works/rating-badge";
import { WorkGrid } from "@/components/works/work-grid";
import { artistDisplayName, getWorkDetail, parseJsonArray, workCover } from "@/lib/artists";
import { prisma } from "@/lib/db";
import { extractWorkTags, saleStatusLabel, toWorkCard } from "@/lib/serializers";
import { resolveImageSrc } from "@/lib/site-images";
import { formatCount } from "@/lib/utils";

export default async function ArtistWorkPage({
  params,
}: {
  params: Promise<{ id: string; workId: string }>;
}) {
  const { id, workId } = await params;
  const work = await getWorkDetail(workId);
  if (!work || work.creatorId !== id || work.status !== "PUBLISHED") notFound();

  await prisma.work.update({
    where: { id: workId },
    data: { viewCount: { increment: 1 } },
  });

  const creatorName = artistDisplayName(work.creator);
  const tags = extractWorkTags(work.aiMeta, parseJsonArray(work.creator.tags));
  const score = work.rating?.score ? Number(work.rating.score) : undefined;

  const related = await prisma.work.findMany({
    where: { creatorId: id, status: "PUBLISHED", id: { not: workId } },
    include: { media: { orderBy: { sortOrder: "asc" }, take: 1 } },
    take: 2,
  });

  const relatedCards = related.map((w) =>
    toWorkCard({ ...w, creator: work.creator }, extractWorkTags(w.aiMeta, tags)),
  );

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <Link
        href={`/artists/${id}`}
        className="mb-8 inline-flex items-center gap-1.5 text-xs tracking-wide text-muted transition hover:text-ink"
      >
        <ArrowLeft className="h-3.5 w-3.5" />
        返回资产档案
      </Link>

      <div className="grid gap-12 lg:grid-cols-2 lg:gap-16">
        <div className="relative aspect-[4/3] overflow-hidden border border-border bg-border/30 lg:sticky lg:top-20 lg:self-start">
          <SiteImage
            src={workCover(work)}
            alt={work.title}
            fill
            fallbackKind="work"
            className="object-cover"
            sizes="(max-width: 1024px) 100vw, 50vw"
            priority
          />
        </div>

        <div>
          <div className="flex flex-wrap items-center gap-2">
            {score !== undefined && <RatingBadge score={score} />}
            <span className="border border-border px-3 py-1 text-[10px] tracking-wide text-muted">
              {saleStatusLabel[work.saleStatus]}
            </span>
            {work.openPresaleConsult && (
              <span className="border border-border px-3 py-1 text-[10px] tracking-wide text-muted">
                开放预售咨询
              </span>
            )}
          </div>

          <h1 className="mt-6 text-2xl font-light tracking-wide text-ink sm:text-3xl">{work.title}</h1>

          <div className="mt-4 flex flex-wrap gap-4 text-xs text-muted">
            {work.year && <span>{work.year} 年</span>}
            {work.dimensions && <span>{work.dimensions}</span>}
            {work.workMedium && <span>{work.workMedium}</span>}
            {work.edition && <span>版次 {work.edition}</span>}
          </div>

          {work.series && (
            <Link
              href={`/artists/${id}/series/${work.series.id}`}
              className="mt-4 inline-block text-xs text-muted hover:text-ink"
            >
              系列：{work.series.title}
            </Link>
          )}

          <Link
            href={`/artists/${id}`}
            className="mt-6 inline-flex items-center gap-3 border border-border p-3 transition hover:border-ink/20"
          >
            <SiteImage
              src={resolveImageSrc(work.creator.user.avatarUrl, "avatar")}
              alt={creatorName}
              width={40}
              height={40}
              fallbackKind="avatar"
              className="object-cover"
            />
            <div>
              <p className="text-sm font-medium tracking-wide text-ink">{creatorName}</p>
              {work.creator.medium && (
                <p className="text-[10px] tracking-wide text-muted-light">{work.creator.medium}</p>
              )}
            </div>
          </Link>

          {work.description && (
            <p className="mt-8 text-sm leading-loose text-muted">{work.description}</p>
          )}

          <div className="mt-6 flex flex-wrap gap-2">
            {tags.map((tag) => (
              <span key={tag} className="border border-border px-2.5 py-0.5 text-[10px] text-muted-light">
                {tag}
              </span>
            ))}
          </div>

          <div className="mt-6 text-xs text-muted-light">
            浏览 {formatCount(work.viewCount + 1)} · 收藏 {formatCount(work.favoriteCount)}
            {work.publishedAt && (
              <> · 首次公开 {new Date(work.publishedAt).toLocaleDateString("zh-CN")}</>
            )}
          </div>

          {work.rating && (
            <div className="mt-10 border border-border p-6">
              <p className="text-xs tracking-[0.15em] text-muted-light uppercase">平台评级</p>
              <p className="mt-4 text-sm leading-loose text-muted">{work.rating.comment}</p>
              <p className="mt-4 text-[10px] text-muted-light">
                — {work.rating.admin.nickname || "平台策展评审"}
              </p>
            </div>
          )}

          <WorkDetailActions workId={work.id} artistId={id} />
        </div>
      </div>

      {relatedCards.length > 0 && (
        <section className="mt-20 border-t border-border pt-12">
          <h2 className="mb-8 text-sm font-medium tracking-wide text-ink">同艺术家作品</h2>
          <WorkGrid works={relatedCards} />
        </section>
      )}
    </div>
  );
}
