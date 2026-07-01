"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";

interface SeriesItem {
  id: string;
  title: string;
  startYear: number | null;
  description: string | null;
}

export default function SeriesManagePage() {
  const [series, setSeries] = useState<SeriesItem[]>([]);
  const [form, setForm] = useState({
    title: "",
    description: "",
    themeEvolution: "",
    startYear: new Date().getFullYear(),
  });

  const load = () =>
    fetch("/api/dashboard/series")
      .then((r) => r.json())
      .then((d: { series?: SeriesItem[] }) => setSeries(d.series || []));

  useEffect(() => {
    load();
  }, []);

  const create = async () => {
    await fetch("/api/dashboard/series", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    setForm({ title: "", description: "", themeEvolution: "", startYear: new Date().getFullYear() });
    load();
  };

  return (
    <div className="mx-auto max-w-2xl px-4 py-12">
      <h1 className="text-2xl font-light text-ink">管理系列</h1>
      <p className="mt-2 text-xs text-muted">模块 3：系列与创作脉络</p>

      <div className="mt-8 space-y-4 border border-border p-6">
        <input
          placeholder="系列名称"
          value={form.title}
          onChange={(e) => setForm({ ...form, title: e.target.value })}
          className="focus-minimal h-10 w-full border border-border px-4 text-sm outline-none"
        />
        <textarea
          placeholder="系列描述"
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
          className="focus-minimal w-full border border-border px-4 py-3 text-sm outline-none"
        />
        <textarea
          placeholder="主题演化路径"
          value={form.themeEvolution}
          onChange={(e) => setForm({ ...form, themeEvolution: e.target.value })}
          className="focus-minimal w-full border border-border px-4 py-3 text-sm outline-none"
        />
        <Button variant="primary" onClick={create}>
          创建系列
        </Button>
      </div>

      <ul className="mt-8 divide-y divide-border border border-border">
        {series.map((s) => (
          <li key={s.id} className="p-4">
            <p className="text-sm text-ink">{s.title}</p>
            {s.startYear && <p className="mt-1 text-xs text-muted">{s.startYear} 年</p>}
            {s.description && <p className="mt-2 text-xs text-muted">{s.description}</p>}
          </li>
        ))}
      </ul>

      <p className="mt-6 text-center text-xs text-muted">
        <Link href="/dashboard">返回后台</Link>
      </p>
    </div>
  );
}
