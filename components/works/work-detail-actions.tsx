"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Factory, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";

interface WorkDetailActionsProps {
  workId: string;
  artistId: string;
  initialFavorited?: boolean;
}

export function WorkDetailActions({
  workId,
  artistId,
  initialFavorited = false,
}: WorkDetailActionsProps) {
  const [favorited, setFavorited] = useState(initialFavorited);

  useEffect(() => {
    fetch(`/api/works/${workId}/favorite`)
      .then((r) => r.json())
      .then((d: { favorited?: boolean }) => setFavorited(!!d.favorited))
      .catch(() => undefined);
  }, [workId]);

  const toggleFavorite = async () => {
    const res = await fetch(`/api/works/${workId}/favorite`, { method: "POST" });
    if (res.status === 401) {
      window.location.href = "/login";
      return;
    }
    const data = (await res.json()) as { favorited: boolean };
    setFavorited(data.favorited);
  };

  return (
    <div className="mt-8 flex flex-col gap-3 sm:flex-row">
      <Button
        variant={favorited ? "accent" : "secondary"}
        size="lg"
        className="flex-1"
        onClick={toggleFavorite}
      >
        <Heart className={`h-4 w-4 ${favorited ? "fill-current" : ""}`} />
        {favorited ? "已收藏" : "收藏作品"}
      </Button>
      <Link
        href={`/collaborate?work=${workId}&artist=${artistId}`}
        className="flex-1"
      >
        <Button variant="primary" size="lg" className="w-full">
          <Factory className="h-4 w-4" />
          咨询 / 合作
        </Button>
      </Link>
    </div>
  );
}
