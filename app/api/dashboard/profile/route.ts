import { NextResponse } from "next/server";
import type { Prisma } from "@prisma/client";

import { logArchiveEvent } from "@/lib/artists";
import { requireCreator } from "@/lib/auth";
import { prisma } from "@/lib/db";

export async function GET() {
  try {
    const user = await requireCreator();
    const creator = await prisma.creator.findUnique({
      where: { id: user.creatorId! },
      include: { user: { select: { nickname: true, avatarUrl: true } } },
    });
    return NextResponse.json({ creator });
  } catch {
    return NextResponse.json({ error: "无权限" }, { status: 403 });
  }
}

export async function PATCH(request: Request) {
  try {
    const user = await requireCreator();
    const body = (await request.json()) as Record<string, unknown>;

    const creator = await prisma.creator.update({
      where: { id: user.creatorId! },
      data: {
        displayName: body.displayName as string | undefined,
        city: body.city as string | undefined,
        medium: body.medium as string | undefined,
        bio: body.bio as string | undefined,
        statement: body.statement as string | undefined,
        keywords: body.keywords as Prisma.InputJsonValue | undefined,
        tags: body.tags as Prisma.InputJsonValue | undefined,
        socialLinks: body.socialLinks as Prisma.InputJsonValue | undefined,
        openCollaboration: body.openCollaboration as boolean | undefined,
      },
    });

    await logArchiveEvent(user.creatorId!, "PROFILE", "UPDATE", "更新艺术家档案信息");

    return NextResponse.json({ ok: true, creator });
  } catch {
    return NextResponse.json({ error: "保存失败" }, { status: 500 });
  }
}
