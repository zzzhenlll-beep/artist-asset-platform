import { NextResponse } from "next/server";

import { requireAdmin } from "@/lib/auth";
import { prisma } from "@/lib/db";

export async function POST(request: Request) {
  try {
    const admin = await requireAdmin();
    const body = (await request.json()) as {
      workId?: string;
      score?: number;
      comment?: string;
    };

    if (!body.workId || !body.score || !body.comment) {
      return NextResponse.json({ error: "参数不完整" }, { status: 400 });
    }

    const rating = await prisma.rating.upsert({
      where: { workId: body.workId },
      create: {
        workId: body.workId,
        adminId: admin.id,
        score: body.score,
        comment: body.comment,
      },
      update: {
        score: body.score,
        comment: body.comment,
        adminId: admin.id,
      },
    });

    return NextResponse.json({ ok: true, rating });
  } catch (e) {
    if (e instanceof Error && e.message === "UNAUTHORIZED") {
      return NextResponse.json({ error: "请先登录" }, { status: 401 });
    }
    if (e instanceof Error && e.message === "FORBIDDEN") {
      return NextResponse.json({ error: "无权限" }, { status: 403 });
    }
    return NextResponse.json({ error: "保存失败" }, { status: 500 });
  }
}
