"use client";

import { useMemo, useState } from "react";
import { Search } from "lucide-react";

import { ArtistCard } from "@/components/artists/artist-card";
import { WorkGrid } from "@/components/works/work-grid";
import type { ArtistCardData, WorkCardData } from "@/lib/types";
import { cn } from "@/lib/utils";

interface DiscoverPageProps {
  artists: ArtistCardData[];
  works: WorkCardData[];
  mediums: string[];
}

export default function DiscoverPageClient({ artists, works, mediums }: DiscoverPageProps) {
  const [query, setQuery] = useState("");
  const [medium, setMedium] = useState("全部");
  const [tab, setTab] = useState<"artists" | "works">("artists");

  const filteredArtists = useMemo(() => {
    const q = query.trim().toLowerCase();
    return artists.filter((a) => {
      const matchMedium = medium === "全部" || (a.medium || "").includes(medium);
      const matchQuery =
        !q ||
        a.name.toLowerCase().includes(q) ||
        a.keywords.some((k) => k.toLowerCase().includes(q)) ||
        (a.city || "").toLowerCase().includes(q);
      return matchMedium && matchQuery;
    });
  }, [artists, query, medium]);

  const filteredWorks = useMemo(() => {
    const q = query.trim().toLowerCase();
    return works.filter((w) => {
      const matchQuery =
        !q ||
        w.title.toLowerCase().includes(q) ||
        w.tags.some((t) => t.toLowerCase().includes(q)) ||
        (w.creatorName || "").toLowerCase().includes(q);
      return matchQuery;
    });
  }, [works, query]);

  return (
    <div className="museum-container py-10 sm:py-12">
      <div className="mt-8 flex gap-px border border-border bg-border text-xs tracking-wide">
        {(["artists", "works"] as const).map((t) => (
          <button
            key={t}
            type="button"
            onClick={() => setTab(t)}
            className={cn(
              "flex-1 py-3 transition",
              tab === t ? "bg-museum text-white" : "bg-paper-elevated text-muted hover:text-museum",
            )}
          >
            {t === "artists" ? "艺术家" : "作品"}
          </button>
        ))}
      </div>

      <div className="mt-6 flex flex-col gap-4 sm:flex-row">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-light" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="搜索艺术家、关键词或作品…"
            className="focus-minimal h-10 w-full border border-border bg-paper-elevated pl-10 pr-4 text-sm outline-none"
          />
        </div>
        {tab === "artists" && (
          <select
            value={medium}
            onChange={(e) => setMedium(e.target.value)}
            className="focus-minimal h-10 border border-border bg-paper-elevated px-4 text-sm outline-none"
          >
            <option value="全部">全部媒介</option>
            {mediums.map((m) => (
              <option key={m} value={m}>
                {m}
              </option>
            ))}
          </select>
        )}
      </div>

      <div className="mt-10">
        {tab === "artists" ? (
          filteredArtists.length === 0 ? (
            <p className="border border-dashed border-border py-16 text-center text-xs text-muted">
              未找到匹配的艺术家
            </p>
          ) : (
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {filteredArtists.map((a, i) => (
                <ArtistCard key={a.id} artist={a} priority={i < 4} />
              ))}
            </div>
          )
        ) : (
          <WorkGrid works={filteredWorks} />
        )}
      </div>
    </div>
  );
}
