import { NextResponse } from "next/server";

import { requireAdmin } from "@/lib/auth";
import { prisma } from "@/lib/db";

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    await requireAdmin();
    const { id } = await params;
    const body = (await request.json()) as { status?: "PENDING" | "CONTACTED" | "CLOSED" };

    const intent = await prisma.collaborationIntent.update({
      where: { id },
      data: { status: body.status },
    });
    return NextResponse.json({ ok: true, intent });
  } catch (e) {
    if (e instanceof Error && e.message === "FORBIDDEN") {
      return NextResponse.json({ error: "无权限" }, { status: 403 });
    }
    return NextResponse.json({ error: "更新失败" }, { status: 500 });
  }
}
