import type { WorkCardData } from "@/lib/types";
import { WorkCard } from "./work-card";

interface WorkGridProps {
  works: WorkCardData[];
}

export function WorkGrid({ works }: WorkGridProps) {
  if (works.length === 0) {
    return (
      <div className="border border-dashed border-border px-6 py-16 text-center text-xs tracking-wide text-muted">
        暂无作品
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {works.map((work, i) => (
        <WorkCard key={work.id} work={work} priority={i < 4} />
      ))}
    </div>
  );
}
