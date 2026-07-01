import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { SiteImage } from "@/components/ui/site-image";
import { resolveImageSrc } from "@/lib/site-images";

import {
  hardAssets,
  industryPainPoints,
  margaretCaseIntro,
  softAssets,
} from "@/lib/vision-content";

interface IndustryInsightProps {
  artistId?: string;
  artistAvatar?: string;
  artistMedium?: string | null;
}

export function IndustryInsight({
  artistId,
  artistAvatar,
  artistMedium,
}: IndustryInsightProps) {
  return (
    <div className="museum-container py-12 sm:py-16">
      {/* 玛格丽特案例 */}
      <section className="border border-border bg-paper-elevated p-8 sm:p-10">
        <p className="text-[11px] tracking-[0.2em] text-muted-light uppercase">案例艺术家</p>
        <div className="mt-6 flex flex-col gap-6 sm:flex-row sm:items-start">
          <SiteImage
            src={resolveImageSrc(artistAvatar, "avatar")}
            alt={margaretCaseIntro.name}
            width={120}
            height={120}
            fallbackKind="avatar"
            className="h-28 w-28 shrink-0 object-cover"
          />
          <div className="flex-1">
            <h2 className="font-serif text-3xl text-museum">{margaretCaseIntro.name}</h2>
            <p className="mt-2 text-sm text-muted">
              {margaretCaseIntro.fullName} · {artistMedium || margaretCaseIntro.tagline}
            </p>
            <p className="mt-5 text-sm leading-loose text-muted">{margaretCaseIntro.context}</p>
            {artistId && (
              <Link
                href={`/artists/${artistId}`}
                className="museum-link mt-6 inline-flex items-center gap-2 text-sm"
              >
                查看玛格丽特的资产档案
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            )}
          </div>
        </div>
      </section>

      {/* 四大痛点 */}
      <section className="mt-16">
        <h2 className="museum-section-title">四个核心痛点</h2>
        <p className="mt-3 text-sm text-muted">
          以玛格丽特为代表的独立艺术家，在售前阶段往往同时面对以下困境。
        </p>
        <ol className="mt-10 space-y-0 divide-y divide-border border-y border-border">
          {industryPainPoints.map((point, index) => (
            <li key={point.id} className="py-8 sm:py-10">
              <div className="flex items-baseline gap-4">
                <span className="font-serif text-3xl text-museum/30">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <h3 className="font-serif text-xl text-ink">{point.title}</h3>
              </div>
              <p className="mt-4 max-w-3xl text-sm leading-loose text-muted">{point.summary}</p>
              {point.drivers.length > 0 && (
                <ul className="mt-5 flex flex-wrap gap-2">
                  {point.drivers.map((driver) => (
                    <li
                      key={driver}
                      className="border border-border bg-paper px-3 py-1 text-[11px] text-muted"
                    >
                      {driver}
                    </li>
                  ))}
                </ul>
              )}
              <p className="mt-5 text-xs leading-relaxed text-muted-light">{point.marginalNote}</p>
            </li>
          ))}
        </ol>
      </section>

      {/* 硬资产 / 软资产 */}
      <section className="mt-16 border-t border-border pt-16">
        <h2 className="museum-section-title">硬资产与软资产</h2>
        <div className="mt-10 grid gap-8 sm:grid-cols-2">
          <div className="border border-border p-8">
            <h3 className="font-serif text-lg text-museum">硬资产</h3>
            <p className="mt-2 text-xs text-muted">可持有、可管理、可（后期）交易的部分</p>
            <ul className="mt-6 space-y-2">
              {hardAssets.map((item) => (
                <li key={item} className="text-sm text-muted">
                  — {item}
                </li>
              ))}
            </ul>
          </div>
          <div className="border border-museum/20 bg-accent-soft p-8">
            <h3 className="font-serif text-lg text-museum">软资产</h3>
            <p className="mt-2 text-xs text-muted">差异化壁垒——理解艺术家的关键</p>
            <ul className="mt-6 space-y-2">
              {softAssets.map((item) => (
                <li key={item} className="text-sm text-muted">
                  — {item}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {artistId && (
        <div className="mt-16 text-center">
          <Link
            href={`/artists/${artistId}`}
            className="inline-flex min-h-11 items-center gap-2 bg-museum px-8 text-sm tracking-wide text-white transition hover:bg-museum-light"
          >
            进入玛格丽特档案页
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>
      )}
    </div>
  );
}
