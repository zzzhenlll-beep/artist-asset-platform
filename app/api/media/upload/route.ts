import { NextResponse } from "next/server";

import { requireCreator, requireSessionUser } from "@/lib/auth";
import { saveUploadedFile } from "@/lib/storage";

export async function POST(request: Request) {
  try {
    const user = await requireSessionUser();
    if (user.role === "USER") {
      return NextResponse.json({ error: "无上传权限" }, { status: 403 });
    }

    const form = await request.formData();
    const file = form.get("file");
    const category = (form.get("category") as string) || "works";
    const subPath = form.get("subPath") as string | null;

    if (!(file instanceof File)) {
      return NextResponse.json({ error: "缺少文件" }, { status: 400 });
    }

    const validCategory = ["works", "avatars", "process", "temp"].includes(category)
      ? (category as "works" | "avatars" | "process" | "temp")
      : "works";

    if (validCategory === "process" || validCategory === "avatars") {
      await requireCreator();
    }

    const result = await saveUploadedFile(
      file,
      validCategory,
      subPath || user.creatorId || undefined,
    );
    return NextResponse.json(result);
  } catch (e) {
    const msg = e instanceof Error ? e.message : "UPLOAD_FAILED";
    if (msg === "UNAUTHORIZED") return NextResponse.json({ error: "请先登录" }, { status: 401 });
    if (msg === "UNSUPPORTED_FILE_TYPE")
      return NextResponse.json({ error: "不支持的文件格式" }, { status: 400 });
    if (msg === "FILE_TOO_LARGE")
      return NextResponse.json({ error: "文件过大" }, { status: 400 });
    return NextResponse.json({ error: "上传失败" }, { status: 500 });
  }
}
