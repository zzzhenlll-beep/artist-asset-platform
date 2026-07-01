"use client";

import Link from "next/link";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

const statusLabel = {
  PENDING: { text: "待联系", class: "border-border text-muted" },
  CONTACTED: { text: "对接中", class: "border-ink text-ink" },
  CLOSED: { text: "已关闭", class: "border-border text-muted-light" },
};

interface AdminPanelProps {
  works: {
    id: string;
    title: string;
    creatorName: string;
    rating: { score: number; comment: string } | null;
  }[];
  intents: {
    id: string;
    workTitle: string;
    contactName: string;
    purpose: string;
    status: keyof typeof statusLabel;
    createdAt: string;
  }[];
}

export function AdminPanel({ works, intents: initialIntents }: AdminPanelProps) {
  const [intents, setIntents] = useState(initialIntents);
  const [ratingForm, setRatingForm] = useState<{
    workId: string;
    score: string;
    comment: string;
  } | null>(null);

  const saveRating = async () => {
    if (!ratingForm) return;
    await fetch("/api/ratings", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        workId: ratingForm.workId,
        score: Number(ratingForm.score),
        comment: ratingForm.comment,
      }),
    });
    setRatingForm(null);
    window.location.reload();
  };

  const updateIntent = async (id: string, status: "PENDING" | "CONTACTED" | "CLOSED") => {
    await fetch(`/api/admin/intents/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    setIntents((prev) => prev.map((i) => (i.id === id ? { ...i, status } : i)));
  };

  return (
    <div className="grid gap-8 lg:grid-cols-2">
      <section className="border border-border p-6 sm:p-8">
        <h2 className="text-sm font-medium tracking-wide text-ink">作品评级</h2>
        <ul className="mt-6 divide-y divide-border">
          {works.map((w) => (
            <li key={w.id} className="py-4">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-sm text-ink">{w.title}</p>
                  <p className="mt-1 text-[10px] text-muted">{w.creatorName}</p>
                  {w.rating && (
                    <p className="mt-2 text-xs text-muted">
                      已评 {w.rating.score} — {w.rating.comment.slice(0, 40)}…
                    </p>
                  )}
                </div>
                <button
                  type="button"
                  onClick={() =>
                    setRatingForm({
                      workId: w.id,
                      score: w.rating ? String(w.rating.score) : "4.0",
                      comment: w.rating?.comment || "",
                    })
                  }
                  className="text-xs text-muted hover:text-ink"
                >
                  {w.rating ? "修改" : "评级"}
                </button>
              </div>
              {ratingForm?.workId === w.id && (
                <div className="mt-4 space-y-3 border border-border p-4">
                  <input
                    type="number"
                    step="0.1"
                    min="1"
                    max="5"
                    value={ratingForm.score}
                    onChange={(e) => setRatingForm({ ...ratingForm, score: e.target.value })}
                    className="focus-minimal h-9 w-full border border-border px-3 text-sm outline-none"
                  />
                  <textarea
                    rows={3}
                    value={ratingForm.comment}
                    onChange={(e) => setRatingForm({ ...ratingForm, comment: e.target.value })}
                    className="focus-minimal w-full border border-border px-3 py-2 text-sm outline-none"
                  />
                  <Button variant="primary" size="sm" onClick={saveRating}>
                    保存评级
                  </Button>
                </div>
              )}
              <Link
                href={`/works/${w.id}`}
                className="mt-2 inline-block text-[10px] text-muted-light hover:text-ink"
              >
                查看作品
              </Link>
            </li>
          ))}
        </ul>
      </section>

      <section className="border border-border p-6 sm:p-8">
        <h2 className="text-sm font-medium tracking-wide text-ink">咨询意向</h2>
        <ul className="mt-6 space-y-4">
          {intents.map((intent) => (
            <li key={intent.id} className="border border-border p-4">
              <div className="flex items-start justify-between gap-2">
                <p className="text-sm text-ink">{intent.workTitle}</p>
                <span
                  className={cn(
                    "shrink-0 border px-2 py-0.5 text-[10px]",
                    statusLabel[intent.status].class,
                  )}
                >
                  {statusLabel[intent.status].text}
                </span>
              </div>
              <p className="mt-3 text-xs text-muted">{intent.purpose}</p>
              <p className="mt-3 text-[10px] text-muted-light">
                {intent.contactName} · {intent.createdAt}
              </p>
              <div className="mt-3 flex gap-2">
                {(["CONTACTED", "CLOSED"] as const).map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => updateIntent(intent.id, s)}
                    className="text-[10px] text-muted hover:text-ink"
                  >
                    标记{s === "CONTACTED" ? "对接中" : "已关闭"}
                  </button>
                ))}
              </div>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
