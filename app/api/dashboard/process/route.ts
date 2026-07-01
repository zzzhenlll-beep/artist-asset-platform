import { NextResponse } from "next/server";

import { requireCreator } from "@/lib/auth";
import { saveUploadedFile } from "@/lib/storage";
import { prisma } from "@/lib/db";

export async function GET() {
  try {
    const user = await requireCreator();
    const assets = await prisma.processAsset.findMany({
      where: { creatorId: user.creatorId! },
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json({ assets });
  } catch {
    return NextResponse.json({ error: "无权限" }, { status: 403 });
  }
}

export async function POST(request: Request) {
  try {
    const user = await requireCreator();
    const form = await request.formData();
    const file = form.get("file");
    const title = String(form.get("title") || "").trim();
    const description = String(form.get("description") || "").trim() || null;
    const assetType = String(form.get("assetType") || "SKETCH");
    const visibility = String(form.get("visibility") || "PUBLIC");
    const seriesId = (form.get("seriesId") as string) || null;
    const imageUrl = String(form.get("imageUrl") || "").trim();

    if (!title) return NextResponse.json({ error: "请填写标题" }, { status: 400 });

    let url = imageUrl;
    if (file instanceof File && file.size > 0) {
      const uploaded = await saveUploadedFile(file, "process", user.creatorId!);
      url = uploaded.url;
    }
    if (!url) return NextResponse.json({ error: "请上传图片" }, { status: 400 });

    const asset = await prisma.processAsset.create({
      data: {
        creatorId: user.creatorId!,
        seriesId,
        title,
        description,
        assetType: assetType as "SKETCH" | "NOTE" | "REFERENCE" | "STUDIO" | "EXPERIMENT" | "EXHIBITION_PREP",
        url,
        visibility: visibility as "PUBLIC" | "SUPPORTERS" | "PRIVATE",
      },
    });

    return NextResponse.json({ ok: true, asset });
  } catch {
    return NextResponse.json({ error: "上传失败" }, { status: 500 });
  }
}
