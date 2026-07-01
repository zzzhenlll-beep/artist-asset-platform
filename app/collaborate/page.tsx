"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

function CollaborateForm() {
  const searchParams = useSearchParams();
  const workId = searchParams.get("work");
  const artistId = searchParams.get("artist");

  const [workTitle, setWorkTitle] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [aiDraft, setAiDraft] = useState("");
  const [purpose, setPurpose] = useState("");
  const [contactName, setContactName] = useState("");
  const [contactInfo, setContactInfo] = useState("");
  const [budgetRange, setBudgetRange] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (workId) {
      fetch(`/api/works/${workId}/info`)
        .catch(() => null);
    }
  }, [workId]);

  const generateDraft = () => {
    const title = workTitle ?? "艺术家合作";
    setAiDraft(
      `您好，我对${workTitle ? `「${title}」及相关创作` : "该艺术家的创作"}很感兴趣，希望探讨联名、文献包支持或视觉授权合作。期待进一步沟通具体范围与交付安排。`,
    );
    setPurpose(aiDraft || `希望就${title}展开合作咨询。`);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/intents", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          workId: workId || undefined,
          creatorId: artistId || undefined,
          purpose: purpose || aiDraft,
          contactName,
          contactInfo,
          budgetRange: budgetRange || undefined,
          message: aiDraft || undefined,
        }),
      });
      if (res.status === 401) {
        window.location.href = "/login";
        return;
      }
      if (!res.ok) {
        const data = (await res.json()) as { error?: string };
        setError(data.error || "提交失败");
        return;
      }
      setSubmitted(true);
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className="border border-border p-10 text-center">
        <h2 className="text-sm font-medium tracking-wide text-ink">意向已提交</h2>
        <p className="mt-3 text-xs leading-relaxed text-muted">
          平台将协助对接艺术家，请保持联系方式畅通。
        </p>
      </div>
    );
  }

  return (
    <form className="space-y-6" onSubmit={handleSubmit}>
      {(workId || artistId) && (
        <div className="border border-border p-4 text-sm">
          <p className="text-[10px] tracking-wide text-muted-light uppercase">关联对象</p>
          <p className="mt-2 font-medium tracking-wide text-ink">
            {workId ? `作品 ID: ${workId}` : `艺术家 ID: ${artistId}`}
          </p>
        </div>
      )}

      <div>
        <label className="mb-2 block text-xs tracking-wide text-muted">咨询 / 合作用途</label>
        <textarea
          required
          rows={4}
          value={purpose}
          onChange={(e) => setPurpose(e.target.value)}
          placeholder="请描述合作场景、支持意向、预算区间等…"
          className="focus-minimal w-full border border-border bg-paper-elevated px-4 py-3 text-sm leading-relaxed outline-none"
        />
      </div>

      <Button type="button" variant="secondary" onClick={generateDraft}>
        <Sparkles className="h-3.5 w-3.5" strokeWidth={1.5} />
        生成陈述草稿
      </Button>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="mb-2 block text-xs tracking-wide text-muted">联系人</label>
          <input
            required
            value={contactName}
            onChange={(e) => setContactName(e.target.value)}
            className="focus-minimal h-10 w-full border border-border bg-paper-elevated px-4 text-sm outline-none"
            placeholder="您的称呼"
          />
        </div>
        <div>
          <label className="mb-2 block text-xs tracking-wide text-muted">电话 / 微信</label>
          <input
            required
            value={contactInfo}
            onChange={(e) => setContactInfo(e.target.value)}
            className="focus-minimal h-10 w-full border border-border bg-paper-elevated px-4 text-sm outline-none"
            placeholder="便于平台联系"
          />
        </div>
      </div>

      <div>
        <label className="mb-2 block text-xs tracking-wide text-muted">预算区间（选填）</label>
        <select
          value={budgetRange}
          onChange={(e) => setBudgetRange(e.target.value)}
          className="focus-minimal h-10 w-full border border-border bg-paper-elevated px-4 text-sm outline-none"
        >
          <option value="">请选择</option>
          <option value="5万以下">5 万以下</option>
          <option value="5-15万">5–15 万</option>
          <option value="15-50万">15–50 万</option>
          <option value="50万以上">50 万以上</option>
        </select>
      </div>

      {error && <p className="text-xs text-red-600">{error}</p>}

      <Button type="submit" variant="primary" size="lg" className="w-full sm:w-auto" disabled={loading}>
        {loading ? "提交中…" : "提交咨询意向"}
      </Button>
    </form>
  );
}

export default function CollaboratePage() {
  return (
    <div className="mx-auto max-w-2xl px-4 py-12 sm:px-6 lg:px-8">
      <h1 className="text-2xl font-light tracking-wide text-ink">咨询 / 合作意向</h1>
      <p className="mt-3 text-xs tracking-wide text-muted">
        品牌方、机构或支持者均可提交咨询，平台人工跟进对接。
      </p>

      <div className="mt-10 border border-border bg-paper-elevated p-6 sm:p-8">
        <Suspense fallback={<p className="text-xs text-muted">加载中…</p>}>
          <CollaborateForm />
        </Suspense>
      </div>
    </div>
  );
}
