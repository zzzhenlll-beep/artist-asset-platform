import Link from "next/link";
import { redirect } from "next/navigation";
import {
  Archive,
  Clock,
  FileText,
  Grid3X3,
  Layers,
  PlusCircle,
  Settings,
} from "lucide-react";

import { SiteImage } from "@/components/ui/site-image";
import { WorkGrid } from "@/components/works/work-grid";
import { artistDisplayName, parseJsonArray } from "@/lib/artists";
import { getSessionUser } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { resolveImageSrc } from "@/lib/site-images";
import { extractWorkTags, toWorkCard } from "@/lib/serializers";

export default async function DashboardPage() {
  const session = await getSessionUser();
  if (!session) redirect("/login");
  if (!session.creatorId && session.role !== "ADMIN") {
    return (
      <div className="mx-auto max-w-lg px-4 py-20 text-center">
        <h1 className="text-lg text-ink">普通用户中心</h1>
        <p className="mt-4 text-xs text-muted">您已登录，可浏览、关注与提交咨询。</p>
        <Link href="/discover" className="mt-6 inline-block text-sm text-ink underline">
          去发现艺术家
        </Link>
      </div>
    );
  }

  const creatorId = session.creatorId!;
  const creator = await prisma.creator.findUnique({
    where: { id: creatorId },
    include: {
      user: true,
      works: {
        include: { media: { take: 1 } },
        orderBy: { updatedAt: "desc" },
      },
      series: true,
      processAssets: true,
      timelineEvents: true,
    },
  });
  if (!creator) redirect("/login");

  const tags = parseJsonArray(creator.tags);
  const myWorkCards = creator.works
    .filter((w) => w.status === "PUBLISHED")
    .map((w) => toWorkCard({ ...w, creator }, extractWorkTags(w.aiMeta, tags)));

  const nav = [
    { href: "/dashboard/profile", label: "编辑档案", icon: Settings },
    { href: "/dashboard/upload", label: "上传作品", icon: PlusCircle },
    { href: "/dashboard/series", label: "管理系列", icon: Layers },
    { href: "/dashboard/process", label: "过程资产", icon: FileText },
    { href: "/dashboard/timeline", label: "时间轴", icon: Clock },
  ];

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-5">
          <SiteImage
            src={resolveImageSrc(creator.user.avatarUrl, "avatar")}
            alt={artistDisplayName(creator)}
            width={64}
            height={64}
            fallbackKind="avatar"
            className="h-16 w-16 object-cover"
          />
          <div>
            <h1 className="text-2xl font-light tracking-wide text-ink">
              {artistDisplayName(creator)}
            </h1>
            <p className="mt-1 text-xs tracking-wide text-muted">创作者后台 · 维护资产档案</p>
          </div>
        </div>
        <Link
          href={`/artists/${creator.id}`}
          className="inline-flex min-h-10 items-center gap-2 border border-border px-5 text-xs tracking-wide text-ink transition hover:border-ink/30"
        >
          <Archive className="h-3.5 w-3.5" />
          查看公开档案
        </Link>
      </div>

      <div className="mt-8 grid gap-px border border-border bg-border sm:grid-cols-3 lg:grid-cols-5">
        {nav.map(({ href, label, icon: Icon }) => (
          <Link
            key={href}
            href={href}
            className="flex flex-col items-center gap-2 bg-paper-elevated px-4 py-6 text-center transition hover:bg-paper"
          >
            <Icon className="h-4 w-4 text-muted" strokeWidth={1.5} />
            <span className="text-xs tracking-wide text-ink">{label}</span>
          </Link>
        ))}
      </div>

      <div className="mt-10 grid gap-4 sm:grid-cols-4">
        {[
          { label: "作品", value: creator.works.length, icon: Grid3X3 },
          { label: "系列", value: creator.series.length, icon: Layers },
          { label: "过程资产", value: creator.processAssets.length, icon: FileText },
          { label: "时间轴节点", value: creator.timelineEvents.length, icon: Clock },
        ].map(({ label, value, icon: Icon }) => (
          <div key={label} className="border border-border p-5">
            <Icon className="h-4 w-4 text-muted-light" strokeWidth={1.5} />
            <p className="mt-3 text-2xl font-light text-ink">{value}</p>
            <p className="mt-1 text-xs text-muted">{label}</p>
          </div>
        ))}
      </div>

      <section className="mt-12">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-sm font-medium tracking-wide text-ink">我的作品</h2>
          <Link href="/dashboard/upload" className="text-xs text-muted hover:text-ink">
            上传新作品
          </Link>
        </div>
        <WorkGrid works={myWorkCards} />
      </section>
    </div>
  );
}
