import Link from "next/link";
import { redirect } from "next/navigation";

import { AdminPanel } from "@/components/admin/admin-panel";
import { getSessionUser } from "@/lib/auth";
import { prisma } from "@/lib/db";

export default async function AdminPage() {
  const session = await getSessionUser();
  if (!session || session.role !== "ADMIN") redirect("/login");

  const works = await prisma.work.findMany({
    where: { status: "PUBLISHED" },
    include: {
      rating: true,
      creator: { include: { user: { select: { nickname: true } } } },
    },
    orderBy: { publishedAt: "desc" },
    take: 20,
  });

  const intents = await prisma.collaborationIntent.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      work: { select: { title: true } },
      user: { select: { nickname: true } },
    },
  });

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="mb-10 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-light tracking-wide text-ink">管理后台</h1>
          <p className="mt-2 text-xs tracking-wide text-muted">作品评级 · 咨询意向跟进</p>
        </div>
        <Link href="/" className="text-xs text-muted hover:text-ink">
          返回前台
        </Link>
      </div>

      <AdminPanel
        works={works.map((w) => ({
          id: w.id,
          title: w.title,
          creatorName: w.creator.displayName || w.creator.user.nickname || "",
          rating: w.rating
            ? { score: Number(w.rating.score), comment: w.rating.comment }
            : null,
        }))}
        intents={intents.map((i) => ({
          id: i.id,
          workTitle: i.work?.title || "通用咨询",
          contactName: i.contactName,
          purpose: i.purpose,
          status: i.status,
          createdAt: i.createdAt.toISOString().slice(0, 10),
        }))}
      />
    </div>
  );
}
