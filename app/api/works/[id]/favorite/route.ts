import { NextResponse } from "next/server";

import { requireSessionUser } from "@/lib/auth";
import { prisma } from "@/lib/db";

export async function POST(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const user = await requireSessionUser();
    const { id: workId } = await params;

    const existing = await prisma.favorite.findUnique({
      where: { userId_workId: { userId: user.id, workId } },
    });

    if (existing) {
      await prisma.$transaction([
        prisma.favorite.delete({ where: { id: existing.id } }),
        prisma.work.update({
          where: { id: workId },
          data: { favoriteCount: { decrement: 1 } },
        }),
      ]);
      return NextResponse.json({ favorited: false });
    }

    await prisma.$transaction([
      prisma.favorite.create({ data: { userId: user.id, workId } }),
      prisma.work.update({
        where: { id: workId },
        data: { favoriteCount: { increment: 1 } },
      }),
    ]);
    return NextResponse.json({ favorited: true });
  } catch (e) {
    if (e instanceof Error && e.message === "UNAUTHORIZED") {
      return NextResponse.json({ error: "请先登录" }, { status: 401 });
    }
    return NextResponse.json({ error: "操作失败" }, { status: 500 });
  }
}

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const user = await requireSessionUser().catch(() => null);
  if (!user) return NextResponse.json({ favorited: false });

  const { id: workId } = await params;
  const existing = await prisma.favorite.findUnique({
    where: { userId_workId: { userId: user.id, workId } },
  });
  return NextResponse.json({ favorited: !!existing });
}
