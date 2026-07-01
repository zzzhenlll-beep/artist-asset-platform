"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import Link from "next/link";
import { ImagePlus, Loader2, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

interface SeriesOption {
  id: string;
  title: string;
}

export default function UploadPage({ series }: { series: SeriesOption[] }) {
  const router = useRouter();
  const [step, setStep] = useState<"upload" | "ai" | "preview">("upload");
  const [preview, setPreview] = useState<string | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [publishing, setPublishing] = useState(false);
  const [imageUrl, setImageUrl] = useState("");
  const [form, setForm] = useState({
    title: "",
    description: "",
    tags: [] as string[],
    year: new Date().getFullYear(),
    dimensions: "",
    workMedium: "",
    seriesId: "",
    openCollaboration: true,
    openPresaleConsult: false,
  });
  const [aiMeta, setAiMeta] = useState<unknown>(null);

  const handleFile = async (selected: File | null) => {
    if (!selected) return;
    setFile(selected);
    const url = URL.createObjectURL(selected);
    setPreview(url);
    setAnalyzing(true);
    setStep("ai");

    const uploadForm = new FormData();
    uploadForm.append("file", selected);
    uploadForm.append("category", "works");

    try {
      const uploadRes = await fetch("/api/media/upload", { method: "POST", body: uploadForm });
      if (uploadRes.status === 401) {
        window.location.href = "/login";
        return;
      }
      const uploaded = (await uploadRes.json()) as { url?: string; error?: string };
      if (!uploaded.url) throw new Error(uploaded.error);

      setImageUrl(uploaded.url);
      const aiRes = await fetch("/api/ai/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ imageUrl: uploaded.url }),
      });
      const ai = (await aiRes.json()) as {
        title?: string;
        description?: string;
        tags?: string[];
      };
      setForm({
        ...form,
        title: ai.title || "",
        description: ai.description || "",
        tags: ai.tags || [],
      });
      setAiMeta(ai);
      setStep("preview");
    } catch {
      setForm({ ...form, title: "未命名作品", description: "", tags: [] });
      setStep("preview");
    } finally {
      setAnalyzing(false);
    }
  };

  const publish = async () => {
    setPublishing(true);
    const body = new FormData();
    if (file) body.append("file", file);
    body.append("imageUrl", imageUrl);
    body.append("title", form.title);
    body.append("description", form.description);
    body.append("tags", form.tags.join(","));
    body.append("year", String(form.year));
    body.append("dimensions", form.dimensions);
    body.append("workMedium", form.workMedium);
    if (form.seriesId) body.append("seriesId", form.seriesId);
    body.append("openCollaboration", String(form.openCollaboration));
    body.append("openPresaleConsult", String(form.openPresaleConsult));
    body.append("status", "PUBLISHED");
    if (aiMeta) body.append("aiMeta", JSON.stringify({ ...(aiMeta as object), aiGenerated: true }));

    const res = await fetch("/api/works", { method: "POST", body });
    setPublishing(false);
    if (res.ok) router.push("/dashboard");
    else alert("发布失败");
  };

  return (
    <div className="mx-auto max-w-2xl px-4 py-12 sm:px-6 lg:px-8">
      <h1 className="text-2xl font-light tracking-wide text-ink">上传作品</h1>
      <p className="mt-3 text-xs tracking-wide text-muted">
        上传后 AI 辅助生成标题与标签，确认后写入资产档案。
      </p>

      <div className="mt-8 flex gap-px border border-border bg-border text-xs tracking-wide">
        {["选择图片", "AI 分析", "编辑发布"].map((label, i) => {
          const steps = ["upload", "ai", "preview"] as const;
          const current = steps.indexOf(step);
          return (
            <div
              key={label}
              className={`flex-1 py-3 text-center ${
                i === current
                  ? "bg-ink text-white"
                  : i < current
                    ? "bg-paper-elevated text-ink"
                    : "bg-paper text-muted-light"
              }`}
            >
              {label}
            </div>
          );
        })}
      </div>

      <div className="mt-8 border border-border bg-paper-elevated p-6 sm:p-8">
        {step === "upload" && (
          <label className="flex cursor-pointer flex-col items-center justify-center border border-dashed border-border bg-paper py-20 transition hover:border-ink/20">
            <ImagePlus className="h-8 w-8 text-muted-light" strokeWidth={1} />
            <p className="mt-4 text-sm tracking-wide text-ink">点击或拖拽上传图片</p>
            <input
              type="file"
              accept="image/jpeg,image/png,image/webp"
              className="hidden"
              onChange={(e) => handleFile(e.target.files?.[0] ?? null)}
            />
          </label>
        )}

        {step === "ai" && (
          <div className="flex flex-col items-center py-20 text-center">
            {preview && (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={preview} alt="预览" className="mb-8 h-40 w-40 object-cover" />
            )}
            <Loader2 className="h-6 w-6 animate-spin text-muted" />
            <p className="mt-6 text-sm">AI 正在分析作品…</p>
          </div>
        )}

        {step === "preview" && preview && (
          <div className="space-y-5">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={preview} alt="预览" className="h-28 w-28 object-cover" />

            <div className="flex items-start gap-2 border border-border p-3 text-[10px] text-muted">
              <Sparkles className="h-3.5 w-3.5 shrink-0" />
              AI 生成内容仅供参考，请校对后发布
            </div>

            <input
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              placeholder="标题"
              className="focus-minimal h-10 w-full border border-border px-4 text-sm outline-none"
            />
            <textarea
              rows={4}
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              placeholder="创作说明"
              className="focus-minimal w-full border border-border px-4 py-3 text-sm outline-none"
            />
            <div className="grid gap-4 sm:grid-cols-2">
              <input
                type="number"
                value={form.year}
                onChange={(e) => setForm({ ...form, year: Number(e.target.value) })}
                placeholder="年份"
                className="focus-minimal h-10 border border-border px-4 text-sm outline-none"
              />
              <input
                value={form.workMedium}
                onChange={(e) => setForm({ ...form, workMedium: e.target.value })}
                placeholder="媒介"
                className="focus-minimal h-10 border border-border px-4 text-sm outline-none"
              />
            </div>
            <input
              value={form.dimensions}
              onChange={(e) => setForm({ ...form, dimensions: e.target.value })}
              placeholder="尺寸"
              className="focus-minimal h-10 w-full border border-border px-4 text-sm outline-none"
            />
            {series.length > 0 && (
              <select
                value={form.seriesId}
                onChange={(e) => setForm({ ...form, seriesId: e.target.value })}
                className="focus-minimal h-10 w-full border border-border px-4 text-sm outline-none"
              >
                <option value="">不归属系列</option>
                {series.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.title}
                  </option>
                ))}
              </select>
            )}
            <div className="flex flex-wrap gap-2">
              {form.tags.map((tag) => (
                <span key={tag} className="border border-border px-2 py-0.5 text-xs text-muted">
                  {tag}
                </span>
              ))}
            </div>
            <label className="flex items-center gap-2 text-xs text-muted">
              <input
                type="checkbox"
                checked={form.openCollaboration}
                onChange={(e) => setForm({ ...form, openCollaboration: e.target.checked })}
              />
              开放合作咨询
            </label>
            <label className="flex items-center gap-2 text-xs text-muted">
              <input
                type="checkbox"
                checked={form.openPresaleConsult}
                onChange={(e) => setForm({ ...form, openPresaleConsult: e.target.checked })}
              />
              开放预售咨询
            </label>
            <div className="flex gap-3">
              <Button variant="primary" size="lg" className="flex-1" onClick={publish} disabled={publishing}>
                {publishing ? "发布中…" : "发布作品"}
              </Button>
              <Button variant="secondary" size="lg" onClick={() => setStep("upload")}>
                重新上传
              </Button>
            </div>
          </div>
        )}
      </div>

      <p className="mt-6 text-center text-xs text-muted">
        <Link href="/dashboard" className="hover:text-ink">
          返回后台
        </Link>
      </p>
    </div>
  );
}
