import { NextResponse } from "next/server";

import { analyzeWorkImage } from "@/lib/ai";
import { requireSessionUser } from "@/lib/auth";

export async function POST(request: Request) {
  try {
    await requireSessionUser();
    const body = (await request.json()) as { imageUrl?: string };
    if (!body.imageUrl) {
      return NextResponse.json({ error: "缺少图片地址" }, { status: 400 });
    }
    const result = await analyzeWorkImage(body.imageUrl);
    return NextResponse.json(result);
  } catch (e) {
    if (e instanceof Error && e.message === "UNAUTHORIZED") {
      return NextResponse.json({ error: "请先登录" }, { status: 401 });
    }
    return NextResponse.json({ error: "分析失败" }, { status: 500 });
  }
}
