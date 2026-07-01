import { resolveImageSrc } from "./site-images";
import type { WorkCardData } from "./types";

type DbWork = {
  id: string;
  creatorId: string;
  title: string;
  viewCount: number;
  favoriteCount: number;
  aiMeta: unknown;
  media: { url: string }[];
  rating?: { score: { toNumber?: () => number } | number } | null;
  creator?: {
    id: string;
    displayName: string | null;
    user: { nickname: string | null };
  };
};

export function toWorkCard(
  work: DbWork,
  tags: string[] = [],
): WorkCardData {
  const score = work.rating?.score;
  const numericScore =
    typeof score === "number"
      ? score
      : score && typeof score === "object" && "toNumber" in score
        ? score.toNumber?.() ?? Number(score)
        : undefined;

  const creatorId = work.creator?.id || work.creatorId;
  const creatorName =
    work.creator?.displayName || work.creator?.user.nickname || undefined;

  return {
    id: work.id,
    title: work.title,
    image: resolveImageSrc(work.media[0]?.url, "work"),
    creatorId,
    creatorName,
    tags,
    viewCount: work.viewCount,
    favoriteCount: work.favoriteCount,
    rating: numericScore ? { score: numericScore } : undefined,
    aiGenerated: !!(work.aiMeta as { aiGenerated?: boolean } | null)?.aiGenerated,
    href: `/artists/${creatorId}/works/${work.id}`,
  };
}

export function extractWorkTags(aiMeta: unknown, creatorTags: string[] = []): string[] {
  const meta = aiMeta as { tags?: string[] } | null;
  if (meta?.tags?.length) return meta.tags;
  return creatorTags.slice(0, 3);
}

export const saleStatusLabel: Record<string, string> = {
  UNSOLD: "未售",
  SOLD: "已售",
  PRIVATE: "不公开",
};

export const processTypeLabel: Record<string, string> = {
  SKETCH: "草图 / 手稿",
  NOTE: "创作笔记",
  REFERENCE: "参考资料",
  STUDIO: "工作室影像",
  EXPERIMENT: "实验稿",
  EXHIBITION_PREP: "展览筹备",
};

export const timelineTypeLabel: Record<string, string> = {
  EXHIBITION: "展览",
  SERIES: "系列",
  MILESTONE: "里程碑",
  PUBLICATION: "发布",
  OTHER: "其他",
};
