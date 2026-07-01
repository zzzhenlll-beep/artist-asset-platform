import { NextResponse } from "next/server";

import { requireSessionUser } from "@/lib/auth";
import { prisma } from "@/lib/db";

export async function POST(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const user = await requireSessionUser();
    const { id: creatorId } = await params;

    const existing = await prisma.artistFollow.findUnique({
      where: { userId_creatorId: { userId: user.id, creatorId } },
    });

    if (existing) {
      await prisma.$transaction([
        prisma.artistFollow.delete({ where: { id: existing.id } }),
        prisma.creator.update({
          where: { id: creatorId },
          data: { followerCount: { decrement: 1 } },
        }),
      ]);
      return NextResponse.json({ following: false });
    }

    await prisma.$transaction([
      prisma.artistFollow.create({ data: { userId: user.id, creatorId } }),
      prisma.creator.update({
        where: { id: creatorId },
        data: { followerCount: { increment: 1 } },
      }),
    ]);
    return NextResponse.json({ following: true });
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
  if (!user) return NextResponse.json({ following: false });

  const { id: creatorId } = await params;
  const existing = await prisma.artistFollow.findUnique({
    where: { userId_creatorId: { userId: user.id, creatorId } },
  });
  return NextResponse.json({ following: !!existing });
}
