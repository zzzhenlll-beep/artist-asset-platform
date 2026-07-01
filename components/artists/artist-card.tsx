import Link from "next/link";
import { MapPin, Users } from "lucide-react";

import { SiteImage } from "@/components/ui/site-image";
import { resolveImageSrc } from "@/lib/site-images";
import type { ArtistCardData } from "@/lib/types";
import { cn } from "@/lib/utils";

interface ArtistCardProps {
  artist: ArtistCardData;
  priority?: boolean;
  className?: string;
}

export function ArtistCard({ artist, priority, className }: ArtistCardProps) {
  const cover = resolveImageSrc(artist.coverImage, "cover");

  return (
    <article
      className={cn(
        "group overflow-hidden border border-border bg-paper-elevated transition hover:border-ink/20",
        className,
      )}
    >
      <Link href={`/artists/${artist.id}`} className="block">
        <div className="relative aspect-[16/10] overflow-hidden bg-border/30">
          <SiteImage
            src={cover}
            alt={artist.name}
            fill
            priority={priority}
            fallbackKind="cover"
            className="object-cover transition duration-700 group-hover:opacity-95"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          />
        </div>
        <div className="p-4">
          <div className="flex items-start gap-3">
            <SiteImage
              src={artist.avatar}
              alt={artist.name}
              width={40}
              height={40}
              fallbackKind="avatar"
              className="h-10 w-10 object-cover"
            />
            <div className="min-w-0 flex-1">
              <h3 className="font-serif text-lg text-museum group-hover:underline">{artist.name}</h3>
              {artist.medium && (
                <p className="mt-1 truncate text-xs text-muted">{artist.medium}</p>
              )}
            </div>
          </div>
          <div className="mt-3 flex flex-wrap gap-1.5">
            {artist.keywords.slice(0, 3).map((kw) => (
              <span
                key={kw}
                className="border border-border px-2 py-0.5 text-[10px] tracking-wide text-muted-light"
              >
                {kw}
              </span>
            ))}
          </div>
          <div className="mt-3 flex items-center gap-4 text-[11px] text-muted-light">
            {artist.city && (
              <span className="inline-flex items-center gap-1">
                <MapPin className="h-3 w-3" />
                {artist.city}
              </span>
            )}
            <span className="inline-flex items-center gap-1">
              <Users className="h-3 w-3" />
              {artist.followerCount} 关注
            </span>
            <span>{artist.workCount} 作品</span>
          </div>
        </div>
      </Link>
    </article>
  );
}
