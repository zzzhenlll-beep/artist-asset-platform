"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { processTypeLabel } from "@/lib/serializers";

interface ProcessItem {
  id: string;
  title: string;
  assetType: string;
  visibility: string;
  url: string;
}

export default function ProcessManagePage() {
  const [assets, setAssets] = useState<ProcessItem[]>([]);
  const [file, setFile] = useState<File | null>(null);
  const [form, setForm] = useState({
    title: "",
    description: "",
    assetType: "SKETCH",
    visibility: "PUBLIC",
  });

  const load = () =>
    fetch("/api/dashboard/process")
      .then((r) => r.json())
      .then((d: { assets?: ProcessItem[] }) => setAssets(d.assets || []));

  useEffect(() => {
    load();
  }, []);

  const upload = async () => {
    const body = new FormData();
    if (file) body.append("file", file);
    body.append("title", form.title);
    body.append("description", form.description);
    body.append("assetType", form.assetType);
    body.append("visibility", form.visibility);
    await fetch("/api/dashboard/process", { method: "POST", body });
    setForm({ title: "", description: "", assetType: "SKETCH", visibility: "PUBLIC" });
    setFile(null);
    load();
  };

  return (
    <div className="mx-auto max-w-2xl px-4 py-12">
      <h1 className="text-2xl font-light text-ink">过程资产</h1>
      <p className="mt-2 text-xs text-muted">模块 4：草图、笔记与工作室记录（支持可见性分级）</p>

      <div className="mt-8 space-y-4 border border-border p-6">
        <input
          type="file"
          accept="image/jpeg,image/png,image/webp"
          onChange={(e) => setFile(e.target.files?.[0] ?? null)}
        />
        <input
          placeholder="标题"
          value={form.title}
          onChange={(e) => setForm({ ...form, title: e.target.value })}
          className="focus-minimal h-10 w-full border border-border px-4 text-sm outline-none"
        />
        <select
          value={form.assetType}
          onChange={(e) => setForm({ ...form, assetType: e.target.value })}
          className="focus-minimal h-10 w-full border border-border px-4 text-sm outline-none"
        >
          {Object.entries(processTypeLabel).map(([k, v]) => (
            <option key={k} value={k}>
              {v}
            </option>
          ))}
        </select>
        <select
          value={form.visibility}
          onChange={(e) => setForm({ ...form, visibility: e.target.value })}
          className="focus-minimal h-10 w-full border border-border px-4 text-sm outline-none"
        >
          <option value="PUBLIC">公开</option>
          <option value="SUPPORTERS">支持者可见</option>
          <option value="PRIVATE">仅私有存档</option>
        </select>
        <Button variant="primary" onClick={upload}>
          上传过程资产
        </Button>
      </div>

      <ul className="mt-8 divide-y divide-border border border-border">
        {assets.map((a) => (
          <li key={a.id} className="flex items-center justify-between p-4">
            <div>
              <p className="text-sm text-ink">{a.title}</p>
              <p className="mt-1 text-xs text-muted">
                {processTypeLabel[a.assetType]} · {a.visibility}
              </p>
            </div>
          </li>
        ))}
      </ul>

      <p className="mt-6 text-center text-xs text-muted">
        <Link href="/dashboard">返回后台</Link>
      </p>
    </div>
  );
}
