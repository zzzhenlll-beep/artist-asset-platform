import { NextResponse } from "next/server";

import { requireSessionUser } from "@/lib/auth";
import { prisma } from "@/lib/db";

export async function POST(request: Request) {
  try {
    const user = await requireSessionUser();
    const body = (await request.json()) as {
      workId?: string;
      creatorId?: string;
      purpose?: string;
      contactName?: string;
      contactInfo?: string;
      budgetRange?: string;
      message?: string;
    };

    if (!body.purpose || !body.contactName || !body.contactInfo) {
      return NextResponse.json({ error: "请填写必填项" }, { status: 400 });
    }

    const intent = await prisma.collaborationIntent.create({
      data: {
        userId: user.id,
        workId: body.workId || null,
        creatorId: body.creatorId || null,
        purpose: body.purpose,
        contactName: body.contactName,
        contactInfo: body.contactInfo,
        budgetRange: body.budgetRange || null,
        message: body.message || null,
      },
    });

    return NextResponse.json({ ok: true, id: intent.id });
  } catch (e) {
    if (e instanceof Error && e.message === "UNAUTHORIZED") {
      return NextResponse.json({ error: "请先登录" }, { status: 401 });
    }
    return NextResponse.json({ error: "提交失败" }, { status: 500 });
  }
}

export async function GET() {
  const intents = await prisma.collaborationIntent.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      user: { select: { nickname: true } },
      work: { select: { title: true } },
    },
  });
  return NextResponse.json({ intents });
}
