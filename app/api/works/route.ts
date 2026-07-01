import { NextResponse } from "next/server";

import { requireCreator } from "@/lib/auth";
import { logArchiveEvent } from "@/lib/artists";
import { prisma } from "@/lib/db";

export async function POST(request: Request) {
  try {
    const user = await requireCreator();
    const form = await request.formData();
    const file = form.get("file");

    const title = String(form.get("title") || "").trim();
    const description = String(form.get("description") || "").trim();
    const tags = String(form.get("tags") || "")
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean);
    const seriesId = (form.get("seriesId") as string) || null;
    const year = form.get("year") ? Number(form.get("year")) : null;
    const dimensions = String(form.get("dimensions") || "").trim() || null;
    const workMedium = String(form.get("workMedium") || "").trim() || null;
    const openCollaboration = form.get("openCollaboration") === "true";
    const openPresaleConsult = form.get("openPresaleConsult") === "true";
    const imageUrl = String(form.get("imageUrl") || "").trim();
    const aiMetaRaw = form.get("aiMeta");
    const status = (form.get("status") as string) === "DRAFT" ? "DRAFT" : "PUBLISHED";

    if (!title) {
      return NextResponse.json({ error: "请填写标题" }, { status: 400 });
    }

    let mediaUrl = imageUrl;
    if (file instanceof File && file.size > 0) {
      const { saveUploadedFile } = await import("@/lib/storage");
      const uploaded = await saveUploadedFile(file, "works");
      mediaUrl = uploaded.url;
    }

    if (!mediaUrl) {
      return NextResponse.json({ error: "请上传作品图片" }, { status: 400 });
    }

    const work = await prisma.work.create({
      data: {
        creatorId: user.creatorId!,
        seriesId: seriesId || null,
        title,
        description: description || null,
        year,
        dimensions,
        workMedium,
        openCollaboration,
        openPresaleConsult,
        status,
        publishedAt: status === "PUBLISHED" ? new Date() : null,
        aiMeta: aiMetaRaw ? JSON.parse(String(aiMetaRaw)) : tags.length ? { tags } : null,
        media: { create: [{ url: mediaUrl, sortOrder: 0 }] },
      },
    });

    if (status === "PUBLISHED") {
      await logArchiveEvent(
        user.creatorId!,
        "WORK",
        "PUBLISH",
        `发布作品「${title}」`,
        work.id,
      );
    }

    return NextResponse.json({ ok: true, workId: work.id });
  } catch (e) {
    const msg = e instanceof Error ? e.message : "";
    if (msg === "UNAUTHORIZED") return NextResponse.json({ error: "请先登录" }, { status: 401 });
    if (msg === "FORBIDDEN") return NextResponse.json({ error: "无权限" }, { status: 403 });
    return NextResponse.json({ error: "发布失败" }, { status: 500 });
  }
}
