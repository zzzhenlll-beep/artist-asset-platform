import Link from "next/link";
import {
  ArrowRight,
  Calendar,
  Clock,
  FileText,
  Mail,
} from "lucide-react";

import { FollowButton } from "@/components/artists/follow-button";
import { SiteImage } from "@/components/ui/site-image";
import { WorkGrid } from "@/components/works/work-grid";
import {
  artistDisplayName,
  filterProcessByVisibility,
  parseJsonArray,
  parseSocialLinks,
} from "@/lib/artists";
import { resolveImageSrc } from "@/lib/site-images";
import { extractWorkTags, processTypeLabel, timelineTypeLabel, toWorkCard } from "@/lib/serializers";
import { formatCount } from "@/lib/utils";

type ArchiveData = NonNullable<Awaited<ReturnType<typeof import("@/lib/artists").getArtistArchive>>>;

interface ArtistArchiveProps {
  artist: ArchiveData;
  isFollowing?: boolean;
  isFollower?: boolean;
}

export function ArtistArchive({ artist, isFollowing = false, isFollower = false }: ArtistArchiveProps) {
  const name = artistDisplayName(artist);
  const keywords = parseJsonArray(artist.keywords);
  const tags = parseJsonArray(artist.tags);
  const social = parseSocialLinks(artist.socialLinks);
  const avatar = resolveImageSrc(artist.user.avatarUrl, "avatar");

  const workCards = artist.works.map((w) =>
    toWorkCard({ ...w, creator: artist }, extractWorkTags(w.aiMeta, tags)),
  );

  const publicProcess = filterProcessByVisibility(artist.processAssets, isFollower);

  return (
    <div>
      {/* 博物馆式档案页 Hero */}
      <section className="bg-museum text-white">
        <div className="museum-container grid gap-8 py-12 lg:grid-cols-[1fr_auto] lg:items-end lg:py-16">
          <div className="flex flex-col gap-6 sm:flex-row sm:items-start">
            <SiteImage src={avatar} alt={name} width={120} height={120} fallbackKind="avatar" className="h-28 w-28 object-cover border border-white/20" />
            <div>
              <p className="text-[11px] tracking-[0.2em] uppercase text-white/70">艺术家档案</p>
              <h1 className="mt-2 font-serif text-4xl font-normal sm:text-5xl">{name}</h1>
              {name === "玛格丽特" && (
                <p className="mt-2 text-sm text-white/75">René Magritte · 1898–1967 · 比利时超现实主义</p>
              )}
              <div className="mt-4 flex flex-wrap gap-4 text-xs text-white/80">
                {artist.city && <span>{artist.city}</span>}
                {artist.medium && <span>{artist.medium}</span>}
                <span>{formatCount(artist.followerCount)} 关注</span>
              </div>
            </div>
          </div>
          <div className="flex flex-wrap gap-3">
            <FollowButton artistId={artist.id} initialFollowing={isFollowing} />
            {artist.openCollaboration && (
              <Link
                href={`/collaborate?artist=${artist.id}`}
                className="inline-flex min-h-10 items-center border border-white/40 px-5 text-xs tracking-wide transition hover:bg-white hover:text-museum"
              >
                咨询支持
              </Link>
            )}
          </div>
        </div>
      </section>

      <div className="museum-container py-12 sm:py-16">
      {/* 身份与陈述 */}
      <section className="border-b border-border pb-12">
        {artist.bio && <p className="max-w-3xl text-sm leading-loose text-muted">{artist.bio}</p>}
        {artist.statement && (
          <blockquote className="mt-6 max-w-3xl border-l-2 border-museum/30 pl-5 font-serif text-base leading-loose text-ink/85">
            {artist.statement}
          </blockquote>
        )}
        <div className="mt-6 flex flex-wrap gap-2">
          {keywords.map((kw) => (
            <span key={kw} className="border border-border px-2.5 py-0.5 text-[11px] text-muted">
              {kw}
            </span>
          ))}
        </div>
        {Object.keys(social).length > 0 && (
          <div className="mt-5 flex flex-wrap gap-4 text-xs text-muted">
            {Object.entries(social).map(([k, v]) => (
              <span key={k} className="inline-flex items-center gap-1">
                <Mail className="h-3 w-3" />
                {k}: {v}
              </span>
            ))}
          </div>
        )}
      </section>

      {/* 模块 3：系列与时间线（摘要） */}
      {artist.series.length > 0 && (
        <section className="mt-12">
          <div className="mb-6 flex items-end justify-between">
            <div>
              <h2 className="museum-section-title">系列与创作脉络</h2>
              <p className="mt-2 text-xs text-muted">按系列组织作品，展示主题演化路径</p>
            </div>
            <Link
              href={`/artists/${artist.id}/timeline`}
              className="museum-link text-xs"
            >
              完整时间轴
              <ArrowRight className="h-3 w-3" />
            </Link>
          </div>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {artist.series.map((s) => (
              <Link
                key={s.id}
                href={`/artists/${artist.id}/series/${s.id}`}
                className="group border border-border p-5 transition hover:border-ink/20"
              >
                <div className="relative mb-4 aspect-[16/10] overflow-hidden bg-border/30">
                  <SiteImage
                    src={s.coverUrl}
                    alt={s.title}
                    fill
                    fallbackKind="series"
                    className="object-cover"
                  />
                </div>
                <h3 className="font-serif text-lg text-museum">{s.title}</h3>
                {s.startYear && (
                  <p className="mt-2 text-[10px] text-muted-light">
                    {s.startYear}
                    {s.endYear ? ` — ${s.endYear}` : " — 进行中"}
                  </p>
                )}
                {s.description && (
                  <p className="mt-3 line-clamp-2 text-xs leading-relaxed text-muted">{s.description}</p>
                )}
                {s.themeEvolution && (
                  <p className="mt-3 text-[10px] leading-relaxed text-muted-light">
                    演化：{s.themeEvolution}
                  </p>
                )}
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* 模块 2：作品档案 */}
      <section className="mt-12">
        <h2 className="museum-section-title mb-6">作品典藏</h2>
        <WorkGrid works={workCards} />
      </section>

      {/* 模块 4：过程资产 */}
      {publicProcess.length > 0 && (
        <section className="mt-12 border-t border-border pt-12">
          <h2 className="museum-section-title mb-2">过程资产</h2>
          <p className="mb-6 text-xs text-muted">草图、笔记与工作室记录 — 公开层展示</p>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {publicProcess.map((asset) => (
              <div key={asset.id} className="border border-border">
                <div className="relative aspect-[4/3] bg-border/30">
                  <SiteImage src={asset.url} alt={asset.title} fill fallbackKind="work" className="object-cover" />
                </div>
                <div className="p-4">
                  <span className="text-[10px] tracking-wide text-muted-light">
                    {processTypeLabel[asset.assetType] || asset.assetType}
                  </span>
                  <h3 className="mt-2 text-sm tracking-wide text-ink">{asset.title}</h3>
                  {asset.description && (
                    <p className="mt-2 text-xs leading-relaxed text-muted">{asset.description}</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* 模块 5：支持者关系 */}
      <section className="mt-12 border-t border-border pt-12">
        <h2 className="museum-section-title mb-6">支持者关系</h2>
        <div className="grid gap-6 lg:grid-cols-2">
          <div className="border border-border p-6">
            <h3 className="text-sm font-medium tracking-wide text-ink">早期支持者</h3>
            <ul className="mt-4 space-y-3">
              {artist.earlySupporters.length === 0 ? (
                <li className="text-xs text-muted">暂无记录</li>
              ) : (
                artist.earlySupporters.map((s) => (
                  <li key={s.id} className="flex items-start justify-between gap-4 text-sm">
                    <span className="text-ink">{s.name}</span>
                    {s.note && <span className="text-xs text-muted-light">{s.note}</span>}
                  </li>
                ))
              )}
            </ul>
          </div>
          <div className="border border-border p-6">
            <h3 className="text-sm font-medium tracking-wide text-ink">参与方式</h3>
            <p className="mt-4 text-xs leading-relaxed text-muted">
              关注艺术家以跟踪档案更新；收藏作品表达认可；提交合作咨询参与预售与支持对话。
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <FollowButton artistId={artist.id} initialFollowing={isFollowing} />
              <Link
                href={`/collaborate?artist=${artist.id}`}
                className="inline-flex min-h-10 items-center border border-border px-4 text-xs tracking-wide text-ink"
              >
                提交咨询
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 模块 6：可验证记录 */}
      <section className="mt-12 border-t border-border pt-12">
        <h2 className="museum-section-title mb-6 flex items-center gap-2">
          <Clock className="h-4 w-4" />
          可验证记录
        </h2>
        <ul className="divide-y divide-border border border-border">
          {artist.archiveLogs.length === 0 ? (
            <li className="p-6 text-xs text-muted">暂无档案记录</li>
          ) : (
            artist.archiveLogs.map((log) => (
              <li key={log.id} className="flex flex-col gap-1 p-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-start gap-3">
                  <FileText className="mt-0.5 h-3.5 w-3.5 shrink-0 text-muted-light" />
                  <div>
                    <p className="text-sm text-ink">{log.description}</p>
                    <p className="mt-1 text-[10px] text-muted-light">
                      {log.entityType} · {log.action}
                    </p>
                  </div>
                </div>
                <time className="text-[10px] tracking-wide text-muted-light">
                  {new Date(log.createdAt).toLocaleDateString("zh-CN")}
                </time>
              </li>
            ))
          )}
        </ul>
      </section>

      {/* 时间线摘要 */}
      {artist.timelineEvents.length > 0 && (
        <section className="mt-12 border-t border-border pt-12">
          <div className="mb-6 flex items-end justify-between">
            <h2 className="museum-section-title flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              创作时间轴
            </h2>
            <Link href={`/artists/${artist.id}/timeline`} className="museum-link text-xs">
              查看全部
            </Link>
          </div>
          <ol className="relative border-l border-border pl-6">
            {artist.timelineEvents.slice(0, 5).map((ev) => (
              <li key={ev.id} className="mb-8 last:mb-0">
                <span className="absolute -left-1.5 mt-1.5 h-3 w-3 rounded-full border border-museum bg-paper" />
                <p className="text-[10px] tracking-wide text-muted-light">
                  {ev.year}
                  {ev.month ? `.${String(ev.month).padStart(2, "0")}` : ""} ·{" "}
                  {timelineTypeLabel[ev.eventType] || ev.eventType}
                </p>
                <h3 className="mt-1 text-sm font-medium text-ink">{ev.title}</h3>
                {ev.description && (
                  <p className="mt-2 text-xs leading-relaxed text-muted">{ev.description}</p>
                )}
              </li>
            ))}
          </ol>
        </section>
      )}
      </div>
    </div>
  );
}
