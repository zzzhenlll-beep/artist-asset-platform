import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";

import { SiteImage } from "@/components/ui/site-image";
import { WorkGrid } from "@/components/works/work-grid";
import { artistDisplayName, getSeriesDetail } from "@/lib/artists";
import { extractWorkTags, processTypeLabel, timelineTypeLabel, toWorkCard } from "@/lib/serializers";
import { parseJsonArray } from "@/lib/artists";

export default async function SeriesPage({
  params,
}: {
  params: Promise<{ id: string; seriesId: string }>;
}) {
  const { id, seriesId } = await params;
  const series = await getSeriesDetail(seriesId);
  if (!series || series.creatorId !== id) notFound();

  const tags = parseJsonArray(series.creator.tags);
  const workCards = series.works.map((w) => toWorkCard({ ...w, creator: series.creator }, extractWorkTags(w.aiMeta, tags)));

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <Link
        href={`/artists/${id}`}
        className="mb-8 inline-flex items-center gap-1.5 text-xs text-muted hover:text-ink"
      >
        <ArrowLeft className="h-3.5 w-3.5" />
        返回 {artistDisplayName(series.creator)} 档案
      </Link>

      <header className="border border-border p-8">
        <div className="relative mb-6 aspect-[21/9] max-h-64 overflow-hidden bg-border/30">
          <SiteImage src={series.coverUrl} alt={series.title} fill fallbackKind="series" className="object-cover" />
        </div>
        <h1 className="text-2xl font-light tracking-wide text-ink">{series.title}</h1>
        {series.startYear && (
          <p className="mt-2 text-xs text-muted">
            {series.startYear}
            {series.endYear ? ` — ${series.endYear}` : " — 进行中"}
          </p>
        )}
        {series.description && (
          <p className="mt-5 max-w-3xl text-sm leading-loose text-muted">{series.description}</p>
        )}
        {series.themeEvolution && (
          <div className="mt-6 border-t border-border pt-6">
            <p className="text-xs tracking-wide text-muted-light uppercase">主题演化</p>
            <p className="mt-3 text-sm leading-loose text-ink/80">{series.themeEvolution}</p>
          </div>
        )}
      </header>

      <section className="mt-12">
        <h2 className="mb-6 text-sm font-medium tracking-wide text-ink">系列作品</h2>
        <WorkGrid works={workCards} />
      </section>

      {series.processAssets.length > 0 && (
        <section className="mt-12 border-t border-border pt-12">
          <h2 className="mb-6 text-sm font-medium tracking-wide text-ink">系列过程资产</h2>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {series.processAssets.map((a) => (
              <div key={a.id} className="border border-border">
                <div className="relative aspect-[4/3] bg-border/30">
                  <SiteImage src={a.url} alt={a.title} fill fallbackKind="work" className="object-cover" />
                </div>
                <div className="p-4">
                  <span className="text-[10px] text-muted-light">
                    {processTypeLabel[a.assetType]}
                  </span>
                  <h3 className="mt-2 text-sm text-ink">{a.title}</h3>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {series.timelineEvents.length > 0 && (
        <section className="mt-12 border-t border-border pt-12">
          <h2 className="mb-6 text-sm font-medium tracking-wide text-ink">系列时间线</h2>
          <ol className="border-l border-border pl-6">
            {series.timelineEvents.map((ev) => (
              <li key={ev.id} className="relative mb-6 last:mb-0">
                <span className="absolute -left-1.5 mt-1.5 h-3 w-3 rounded-full border border-ink bg-paper" />
                <p className="text-[10px] text-muted-light">
                  {ev.year}
                  {ev.month ? `.${ev.month}` : ""} · {timelineTypeLabel[ev.eventType]}
                </p>
                <h3 className="mt-1 text-sm text-ink">{ev.title}</h3>
                {ev.description && <p className="mt-2 text-xs text-muted">{ev.description}</p>}
              </li>
            ))}
          </ol>
        </section>
      )}
    </div>
  );
}
