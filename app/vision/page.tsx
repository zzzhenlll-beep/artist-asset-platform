import { IndustryInsight } from "@/components/vision/industry-insight";
import { PageHero } from "@/components/museum/page-hero";
import { prisma } from "@/lib/db";

export const metadata = {
  title: "关于体系",
  description: "解释权、定价权与资产化缺失——以玛格丽特为例。",
};

export default async function VisionPage() {
  const margaret = await prisma.creator.findFirst({
    where: { displayName: "玛格丽特" },
    include: { user: { select: { avatarUrl: true } } },
  });

  return (
    <>
      <PageHero
        eyebrow="About"
        title="关于体系"
        description="表面是「大众不懂艺术」，本质是艺术家价值形成机制过于封闭。本页说明为何需要个人资产档案，并以玛格丽特为示范案例。"
        dark
      />
      <IndustryInsight
        artistId={margaret?.id}
        artistAvatar={margaret?.user.avatarUrl || undefined}
        artistMedium={margaret?.medium}
      />
    </>
  );
}
