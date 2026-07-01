"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { timelineTypeLabel } from "@/lib/serializers";

interface TimelineItem {
  id: string;
  year: number;
  month: number | null;
  title: string;
  eventType: string;
}

export default function TimelineManagePage() {
  const [events, setEvents] = useState<TimelineItem[]>([]);
  const [form, setForm] = useState({
    title: "",
    description: "",
    year: new Date().getFullYear(),
    month: "",
    eventType: "MILESTONE",
  });

  const load = () =>
    fetch("/api/dashboard/timeline")
      .then((r) => r.json())
      .then((d: { events?: TimelineItem[] }) => setEvents(d.events || []));

  useEffect(() => {
    load();
  }, []);

  const create = async () => {
    await fetch("/api/dashboard/timeline", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...form,
        month: form.month ? Number(form.month) : undefined,
      }),
    });
    setForm({
      title: "",
      description: "",
      year: new Date().getFullYear(),
      month: "",
      eventType: "MILESTONE",
    });
    load();
  };

  return (
    <div className="mx-auto max-w-2xl px-4 py-12">
      <h1 className="text-2xl font-light text-ink">创作时间轴</h1>
      <p className="mt-2 text-xs text-muted">模块 3：年度时间轴与关键节点</p>

      <div className="mt-8 space-y-4 border border-border p-6">
        <input
          placeholder="节点标题"
          value={form.title}
          onChange={(e) => setForm({ ...form, title: e.target.value })}
          className="focus-minimal h-10 w-full border border-border px-4 text-sm outline-none"
        />
        <textarea
          placeholder="描述"
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
          className="focus-minimal w-full border border-border px-4 py-3 text-sm outline-none"
        />
        <div className="grid grid-cols-2 gap-4">
          <input
            type="number"
            placeholder="年份"
            value={form.year}
            onChange={(e) => setForm({ ...form, year: Number(e.target.value) })}
            className="focus-minimal h-10 border border-border px-4 text-sm outline-none"
          />
          <input
            type="number"
            placeholder="月份（可选）"
            value={form.month}
            onChange={(e) => setForm({ ...form, month: e.target.value })}
            className="focus-minimal h-10 border border-border px-4 text-sm outline-none"
          />
        </div>
        <select
          value={form.eventType}
          onChange={(e) => setForm({ ...form, eventType: e.target.value })}
          className="focus-minimal h-10 w-full border border-border px-4 text-sm outline-none"
        >
          {Object.entries(timelineTypeLabel).map(([k, v]) => (
            <option key={k} value={k}>
              {v}
            </option>
          ))}
        </select>
        <Button variant="primary" onClick={create}>
          添加节点
        </Button>
      </div>

      <ol className="mt-8 border-l border-border pl-6">
        {events.map((ev) => (
          <li key={ev.id} className="relative mb-6">
            <span className="absolute -left-1.5 mt-1.5 h-3 w-3 rounded-full border border-ink bg-paper" />
            <p className="text-[10px] text-muted">
              {ev.year}
              {ev.month ? `.${ev.month}` : ""} · {timelineTypeLabel[ev.eventType]}
            </p>
            <p className="text-sm text-ink">{ev.title}</p>
          </li>
        ))}
      </ol>

      <p className="mt-6 text-center text-xs text-muted">
        <Link href="/dashboard">返回后台</Link>
      </p>
    </div>
  );
}
