import { NextResponse } from "next/server";

import { logArchiveEvent } from "@/lib/artists";
import { requireCreator } from "@/lib/auth";
import { prisma } from "@/lib/db";

export async function GET() {
  try {
    const user = await requireCreator();
    const series = await prisma.series.findMany({
      where: { creatorId: user.creatorId! },
      orderBy: { sortOrder: "asc" },
    });
    return NextResponse.json({ series });
  } catch {
    return NextResponse.json({ error: "无权限" }, { status: 403 });
  }
}

export async function POST(request: Request) {
  try {
    const user = await requireCreator();
    const body = (await request.json()) as {
      title?: string;
      description?: string;
      themeEvolution?: string;
      startYear?: number;
      endYear?: number;
      coverUrl?: string;
    };

    if (!body.title) {
      return NextResponse.json({ error: "请填写系列名称" }, { status: 400 });
    }

    const series = await prisma.series.create({
      data: {
        creatorId: user.creatorId!,
        title: body.title,
        description: body.description,
        themeEvolution: body.themeEvolution,
        startYear: body.startYear,
        endYear: body.endYear,
        coverUrl: body.coverUrl,
      },
    });

    await logArchiveEvent(
      user.creatorId!,
      "SERIES",
      "CREATE",
      `创建系列「${body.title}」`,
      series.id,
    );

    return NextResponse.json({ ok: true, series });
  } catch {
    return NextResponse.json({ error: "创建失败" }, { status: 500 });
  }
}
