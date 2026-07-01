import Link from "next/link";
import { Eye, Heart } from "lucide-react";

import { SiteImage } from "@/components/ui/site-image";
import type { WorkCardData } from "@/lib/types";
import { cn, formatCount } from "@/lib/utils";

import { RatingBadge } from "../works/rating-badge";

interface WorkCardProps {
  work: WorkCardData;
  priority?: boolean;
  className?: string;
}

export function WorkCard({ work, priority, className }: WorkCardProps) {
  return (
    <article
      className={cn(
        "group overflow-hidden border border-border bg-paper-elevated transition hover:border-ink/20",
        className,
      )}
    >
      <Link href={work.href} className="block">
        <div className="relative aspect-[4/3] overflow-hidden bg-border/30">
          <SiteImage
            src={work.image}
            alt={work.title}
            fill
            priority={priority}
            fallbackKind="work"
            className="object-cover transition duration-700 group-hover:opacity-95"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          />
          {work.rating && (
            <div className="absolute left-3 top-3">
              <RatingBadge score={work.rating.score} compact />
            </div>
          )}
          {work.aiGenerated && (
            <div className="absolute right-3 top-3 border border-border bg-paper-elevated/90 px-2 py-0.5 text-[10px] tracking-wide text-muted backdrop-blur-sm">
              AI
            </div>
          )}
        </div>
        <div className="p-4">
          <h3 className="line-clamp-1 text-sm font-medium tracking-wide text-ink">{work.title}</h3>
          {work.creatorName && (
            <p className="mt-1.5 text-xs tracking-wide text-muted">{work.creatorName}</p>
          )}
          <div className="mt-3 flex flex-wrap gap-1.5">
            {work.tags.slice(0, 3).map((tag) => (
              <span
                key={tag}
                className="border border-border px-2 py-0.5 text-[10px] tracking-wide text-muted-light"
              >
                {tag}
              </span>
            ))}
          </div>
          <div className="mt-3 flex items-center gap-4 text-[11px] text-muted-light">
            <span className="inline-flex items-center gap-1">
              <Eye className="h-3 w-3" />
              {formatCount(work.viewCount)}
            </span>
            <span className="inline-flex items-center gap-1">
              <Heart className="h-3 w-3" />
              {formatCount(work.favoriteCount)}
            </span>
          </div>
        </div>
      </Link>
    </article>
  );
}
