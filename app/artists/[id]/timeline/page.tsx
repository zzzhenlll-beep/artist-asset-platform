import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";

import { artistDisplayName, getArtistArchive } from "@/lib/artists";
import { timelineTypeLabel } from "@/lib/serializers";

export default async function TimelinePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const artist = await getArtistArchive(id);
  if (!artist) notFound();

  const byYear = artist.timelineEvents.reduce(
    (acc, ev) => {
      if (!acc[ev.year]) acc[ev.year] = [];
      acc[ev.year].push(ev);
      return acc;
    },
    {} as Record<number, typeof artist.timelineEvents>,
  );

  const years = Object.keys(byYear)
    .map(Number)
    .sort((a, b) => b - a);

  return (
    <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6 lg:px-8">
      <Link
        href={`/artists/${id}`}
        className="mb-8 inline-flex items-center gap-1.5 text-xs text-muted hover:text-ink"
      >
        <ArrowLeft className="h-3.5 w-3.5" />
        返回档案
      </Link>

      <h1 className="text-2xl font-light tracking-wide text-ink">
        {artistDisplayName(artist)} · 创作时间轴
      </h1>
      <p className="mt-3 text-xs text-muted">按年度展示展览、系列与关键节点</p>

      <div className="mt-10 space-y-12">
        {years.map((year) => (
          <section key={year}>
            <h2 className="mb-6 text-lg font-light text-ink">{year}</h2>
            <ol className="space-y-6 border-l border-border pl-6">
              {byYear[year].map((ev) => (
                <li key={ev.id} className="relative">
                  <span className="absolute -left-1.5 mt-1.5 h-3 w-3 rounded-full border border-ink bg-paper" />
                  <p className="text-[10px] text-muted-light">
                    {ev.month ? `${ev.month} 月 · ` : ""}
                    {timelineTypeLabel[ev.eventType]}
                  </p>
                  <h3 className="mt-1 text-sm font-medium text-ink">{ev.title}</h3>
                  {ev.description && (
                    <p className="mt-2 text-xs leading-relaxed text-muted">{ev.description}</p>
                  )}
                </li>
              ))}
            </ol>
          </section>
        ))}
      </div>
    </div>
  );
}
