import { mkdir, writeFile } from "fs/promises";
import path from "path";
import { randomUUID } from "crypto";

const ALLOWED_MIME = new Set(["image/jpeg", "image/png", "image/webp"]);
const MAX_BYTES = (Number(process.env.STORAGE_MAX_FILE_MB) || 10) * 1024 * 1024;

function storageRoot() {
  return process.env.STORAGE_ROOT || path.join(process.cwd(), "storage", "uploads");
}

function publicBase() {
  return (process.env.STORAGE_PUBLIC_BASE || "http://localhost:3000/api/media").replace(/\/$/, "");
}

export function mediaUrl(category: string, filename: string) {
  return `${publicBase()}/${category}/${filename}`;
}

export function resolveMediaPath(category: string, filename: string) {
  const safeCategory = category.replace(/[^a-z]/gi, "");
  const safeName = path.basename(filename);
  return path.join(storageRoot(), safeCategory, safeName);
}

export async function saveUploadedFile(
  file: File,
  category: "works" | "avatars" | "process" | "temp",
  subPath?: string,
) {
  if (!ALLOWED_MIME.has(file.type)) {
    throw new Error("UNSUPPORTED_FILE_TYPE");
  }
  if (file.size > MAX_BYTES) {
    throw new Error("FILE_TOO_LARGE");
  }

  const ext =
    file.type === "image/png" ? "png" : file.type === "image/webp" ? "webp" : "jpg";
  const now = new Date();
  const year = String(now.getFullYear());
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const filename = `${randomUUID()}.${ext}`;

  const dir = subPath
    ? path.join(storageRoot(), category, subPath)
    : category === "works"
      ? path.join(storageRoot(), category, year, month)
      : path.join(storageRoot(), category);

  await mkdir(dir, { recursive: true });
  const fullPath = path.join(dir, filename);
  const buffer = Buffer.from(await file.arrayBuffer());
  await writeFile(fullPath, buffer);

  const relative =
    category === "works"
      ? `${category}/${year}/${month}/${filename}`
      : subPath
        ? `${category}/${subPath}/${filename}`
        : `${category}/${filename}`;

  return {
    url: `${publicBase()}/${relative.replace(/\\/g, "/")}`,
    relativePath: relative.replace(/\\/g, "/"),
  };
}
