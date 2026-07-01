import { readFile } from "fs/promises";
import { NextResponse } from "next/server";

import { resolveMediaPath } from "@/lib/storage";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ path: string[] }> },
) {
  const { path: segments } = await params;
  if (!segments?.length) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const category = segments[0];
  const filename = segments[segments.length - 1];
  const filePath = resolveMediaPath(category, filename);

  try {
    const data = await readFile(filePath);
    const ext = filename.split(".").pop()?.toLowerCase();
    const type =
      ext === "png" ? "image/png" : ext === "webp" ? "image/webp" : "image/jpeg";
    return new NextResponse(data, {
      headers: {
        "Content-Type": type,
        "Cache-Control": "public, max-age=31536000, immutable",
      },
    });
  } catch {
    return NextResponse.json({ error: "File not found" }, { status: 404 });
  }
}
