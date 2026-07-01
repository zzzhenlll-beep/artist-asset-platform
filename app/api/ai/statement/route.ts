import { NextResponse } from "next/server";

import { draftNarrative } from "@/lib/ai";
import { requireCreator } from "@/lib/auth";

export async function POST(request: Request) {
  try {
    await requireCreator();
    const body = (await request.json()) as {
      artistName?: string;
      medium?: string;
      keywords?: string[];
    };
    const text = await draftNarrative({
      artistName: body.artistName || "艺术家",
      medium: body.medium,
      keywords: body.keywords,
    });
    return NextResponse.json({ text });
  } catch {
    return NextResponse.json({ error: "生成失败" }, { status: 500 });
  }
}
