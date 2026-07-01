import Link from "next/link";

import { EditorialList } from "@/components/museum/editorial-list";
import { PortalGrid } from "@/components/museum/portal-grid";
import { SiteImage } from "@/components/ui/site-image";
import { artistDisplayName, getPublishedArtists } from "@/lib/artists";
import { MAGRITTE_COLLECTIONS_INTRO, MAGRITTE_PROFILE } from "@/lib/magritte-archive-content";
import { resolveImageSrc } from "@/lib/site-images";
import { prisma } from "@/lib/db";

export default async function HomePage() {
  const margaret = await prisma.creator.findFirst({
    where: { displayName: "玛格丽特" },
    include: {
      user: { select: { avatarUrl: true } },
      timelineEvents: { orderBy: [{ year: "desc" }, { sortOrder: "asc" }], take: 4 },
      archiveLogs: { orderBy: { createdAt: "desc" }, take: 5 },
      series: { take: 1 },
    },
  });

  const artists = await getPublishedArtists(4);

  const newsItems =
    margaret?.archiveLogs.map((log) => ({
      title: log.description,
      date: new Date(log.createdAt).toLocaleDateString("zh-CN"),
      meta: log.entityType,
    })) ?? [
      { title: "创建系列「窗景与记忆」", date: "2023.06", meta: "系列" },
      { title: "首次公开发布《午后窗景 · 三号房间》", date: "2024.09", meta: "作品" },
    ];

  const activityItems =
    margaret?.timelineEvents.map((ev) => ({
      title: ev.title,
      date: `${ev.year}${ev.month ? `.${String(ev.month).padStart(2, "0")}` : ""}`,
      href: margaret ? `/artists/${margaret.id}/timeline` : undefined,
      meta: "创作节点",
    })) ?? [];

  const portals = [
    {
      title: "关于体系",
      href: "/vision",
      description: "解释权、定价权与资产化缺失——为什么需要艺术家个人资产档案。",
    },
    {
      title: "艺术家档案",
      href: margaret ? `/artists/${margaret.id}` : "/discover",
      description: "以玛格丽特为例，浏览完整的六模块售前资产档案。",
    },
    {
      title: "作品与系列",
      href: "/discover",
      description: "结构化作品字段、系列脉络与创作时间轴。",
    },
    {
      title: "咨询支持",
      href: "/collaborate",
      description: "提交合作或支持意向，建立售前阶段的长线关系。",
    },
  ];

  return (
    <div>
      {/* 博物馆式首页 Hero */}
      <section className="relative overflow-hidden bg-museum text-white">
        <div className="museum-container grid gap-10 py-16 lg:grid-cols-2 lg:items-center lg:py-24">
          <div>
            <p className="text-[11px] tracking-[0.25em] uppercase text-white/70">
              {MAGRITTE_PROFILE.fullName} · {MAGRITTE_PROFILE.lifespan}
            </p>
            <h2 className="mt-4 font-serif text-4xl font-normal leading-tight sm:text-5xl lg:text-6xl">
              玛格丽特档案馆
            </h2>
            <p className="mt-6 max-w-lg text-sm leading-loose text-white/85 sm:text-base">
              {MAGRITTE_COLLECTIONS_INTRO}
            </p>
            {margaret && (
              <Link
                href={`/artists/${margaret.id}`}
                className="mt-8 inline-flex min-h-11 items-center border border-white/40 px-6 text-sm tracking-wide transition hover:bg-white hover:text-museum"
              >
                进入玛格丽特档案
              </Link>
            )}
          </div>
          {margaret && (
            <div className="relative aspect-[4/3] overflow-hidden border border-white/20">
              <SiteImage
                src={resolveImageSrc(
                  margaret.series[0]?.coverUrl || MAGRITTE_PROFILE.avatarUrl,
                  "cover",
                )}
                alt="玛格丽特档案馆"
                fill
                fallbackKind="cover"
                className="object-cover"
                priority
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
            </div>
          )}
        </div>
      </section>

      {/* 四个入口（对应博物馆 About / Visit / Collections / Resources） */}
      <section className="museum-container py-14 sm:py-16">
        <PortalGrid items={portals} />
      </section>

      {/* 动态 + 活动（对应 News + Activities） */}
      <section className="border-t border-border bg-paper-elevated">
        <div className="museum-container grid gap-14 py-14 lg:grid-cols-2 lg:gap-16 lg:py-16">
          <EditorialList
            title="档案动态"
            items={newsItems}
            moreHref={margaret ? `/artists/${margaret.id}` : undefined}
          />
          <EditorialList
            title="创作活动"
            items={activityItems}
            moreHref={margaret ? `/artists/${margaret.id}/timeline` : undefined}
          />
        </div>
      </section>

      {/* 艺术家索引（简版，一层入口） */}
      <section className="border-t border-border">
        <div className="museum-container py-14 sm:py-16">
          <div className="mb-8 border-b border-border pb-4">
            <h2 className="museum-section-title">艺术家索引</h2>
          </div>
          <ul className="divide-y divide-border">
            {artists.map((a) => (
              <li key={a.id} className="flex flex-col gap-2 py-5 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <Link
                    href={`/artists/${a.id}`}
                    className="font-serif text-lg text-museum hover:underline"
                  >
                    {artistDisplayName(a)}
                  </Link>
                  {a.medium && <p className="mt-1 text-sm text-muted">{a.medium}</p>}
                </div>
                <p className="text-xs text-muted-light">
                  {a.city || "—"} · {a._count.works} 件作品
                </p>
              </li>
            ))}
          </ul>
          <Link href="/discover" className="museum-link mt-8 inline-block text-sm">
            浏览全部作品与系列 →
          </Link>
        </div>
      </section>
    </div>
  );
}
