import { NextResponse } from "next/server";

import { requireCreator } from "@/lib/auth";
import { prisma } from "@/lib/db";

export async function GET() {
  try {
    const user = await requireCreator();
    const events = await prisma.timelineEvent.findMany({
      where: { creatorId: user.creatorId! },
      orderBy: [{ year: "desc" }, { sortOrder: "asc" }],
    });
    return NextResponse.json({ events });
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
      year?: number;
      month?: number;
      eventType?: string;
      seriesId?: string;
    };

    if (!body.title || !body.year) {
      return NextResponse.json({ error: "请填写标题与年份" }, { status: 400 });
    }

    const event = await prisma.timelineEvent.create({
      data: {
        creatorId: user.creatorId!,
        title: body.title,
        description: body.description,
        year: body.year,
        month: body.month,
        eventType: (body.eventType as "EXHIBITION" | "SERIES" | "MILESTONE" | "PUBLICATION" | "OTHER") || "OTHER",
        seriesId: body.seriesId || null,
      },
    });

    return NextResponse.json({ ok: true, event });
  } catch {
    return NextResponse.json({ error: "创建失败" }, { status: 500 });
  }
}
