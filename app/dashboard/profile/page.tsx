"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";

export default function ProfileEditPage() {
  const [form, setForm] = useState({
    displayName: "",
    city: "",
    medium: "",
    bio: "",
    statement: "",
    keywords: "",
    openCollaboration: true,
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetch("/api/dashboard/profile")
      .then((r) => r.json())
      .then((d: { creator?: typeof form & { keywords?: string[] } }) => {
        if (d.creator) {
          setForm({
            displayName: d.creator.displayName || "",
            city: d.creator.city || "",
            medium: d.creator.medium || "",
            bio: d.creator.bio || "",
            statement: d.creator.statement || "",
            keywords: Array.isArray(d.creator.keywords)
              ? (d.creator.keywords as string[]).join("、")
              : "",
            openCollaboration: d.creator.openCollaboration ?? true,
          });
        }
      })
      .finally(() => setLoading(false));
  }, []);

  const save = async () => {
    setSaving(true);
    await fetch("/api/dashboard/profile", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...form,
        keywords: form.keywords.split(/[、,，]/).map((k) => k.trim()).filter(Boolean),
        tags: form.keywords.split(/[、,，]/).map((k) => k.trim()).filter(Boolean),
      }),
    });
    setSaving(false);
    alert("已保存");
  };

  const aiStatement = async () => {
    const res = await fetch("/api/ai/statement", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        artistName: form.displayName,
        medium: form.medium,
        keywords: form.keywords.split(/[、,，]/).filter(Boolean),
      }),
    });
    const data = (await res.json()) as { text?: string };
    if (data.text) setForm({ ...form, statement: data.text });
  };

  if (loading) return <p className="p-12 text-xs text-muted">加载中…</p>;

  return (
    <div className="mx-auto max-w-2xl px-4 py-12">
      <h1 className="text-2xl font-light text-ink">编辑档案</h1>
      <p className="mt-2 text-xs text-muted">模块 1：基础身份与陈述</p>

      <div className="mt-8 space-y-5 border border-border p-6">
        {[
          ["displayName", "艺术名 / 展示名"],
          ["city", "城市"],
          ["medium", "主要媒介"],
        ].map(([key, label]) => (
          <div key={key}>
            <label className="mb-2 block text-xs text-muted">{label}</label>
            <input
              value={form[key as keyof typeof form] as string}
              onChange={(e) => setForm({ ...form, [key]: e.target.value })}
              className="focus-minimal h-10 w-full border border-border px-4 text-sm outline-none"
            />
          </div>
        ))}
        <div>
          <label className="mb-2 block text-xs text-muted">简介</label>
          <textarea
            rows={3}
            value={form.bio}
            onChange={(e) => setForm({ ...form, bio: e.target.value })}
            className="focus-minimal w-full border border-border px-4 py-3 text-sm outline-none"
          />
        </div>
        <div>
          <label className="mb-2 block text-xs text-muted">个人陈述</label>
          <textarea
            rows={4}
            value={form.statement}
            onChange={(e) => setForm({ ...form, statement: e.target.value })}
            className="focus-minimal w-full border border-border px-4 py-3 text-sm outline-none"
          />
          <Button type="button" variant="secondary" size="sm" className="mt-2" onClick={aiStatement}>
            AI 辅助生成陈述
          </Button>
        </div>
        <div>
          <label className="mb-2 block text-xs text-muted">创作关键词（顿号分隔）</label>
          <input
            value={form.keywords}
            onChange={(e) => setForm({ ...form, keywords: e.target.value })}
            className="focus-minimal h-10 w-full border border-border px-4 text-sm outline-none"
          />
        </div>
        <Button variant="primary" onClick={save} disabled={saving}>
          {saving ? "保存中…" : "保存档案"}
        </Button>
      </div>

      <p className="mt-6 text-center text-xs text-muted">
        <Link href="/dashboard">返回后台</Link>
      </p>
    </div>
  );
}
