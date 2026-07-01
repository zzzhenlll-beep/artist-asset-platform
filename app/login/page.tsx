"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/button";

export default function LoginPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    const form = new FormData(e.currentTarget);
    const phone = String(form.get("phone") || "");
    const code = String(form.get("code") || "123456");

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone, code }),
      });
      const data = (await res.json()) as { error?: string; user?: { role: string } };
      if (!res.ok) {
        setError(data.error || "登录失败");
        return;
      }
      if (data.user?.role === "ADMIN") router.push("/admin");
      else if (data.user?.role === "CREATOR") router.push("/dashboard");
      else router.push("/discover");
      router.refresh();
    } catch {
      setError("网络错误");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto flex min-h-[60vh] max-w-md flex-col justify-center px-4 py-12">
      <div className="border border-border bg-paper-elevated p-8 sm:p-10">
        <h1 className="text-xl font-light tracking-wide text-ink">登录</h1>
        <p className="mt-3 text-xs tracking-wide text-muted">验证期 Mock 登录（MOCK_AUTH=true）</p>

        <form className="mt-8 space-y-5" onSubmit={handleSubmit}>
          <div>
            <label className="mb-2 block text-xs tracking-wide text-muted">手机号</label>
            <input
              name="phone"
              type="tel"
              required
              placeholder="11 位手机号"
              className="focus-minimal h-10 w-full border border-border px-4 text-sm outline-none"
              defaultValue="13800000000"
            />
          </div>
          <div>
            <label className="mb-2 block text-xs tracking-wide text-muted">验证码</label>
            <input
              name="code"
              type="text"
              placeholder="任意验证码"
              className="focus-minimal h-10 w-full border border-border px-4 text-sm outline-none"
              defaultValue="123456"
            />
          </div>
          {error && <p className="text-xs text-red-600">{error}</p>}
          <Button type="submit" variant="primary" size="lg" className="w-full" disabled={loading}>
            {loading ? "登录中…" : "登录"}
          </Button>
        </form>

        <div className="mt-6 space-y-2 border-t border-border pt-5 text-[10px] text-muted-light">
          <p>13800000000 → 创作者（林墨染）</p>
          <p>13900000000 → 管理员</p>
          <p>其他号码 → 普通用户</p>
        </div>
      </div>

      <p className="mt-8 text-center text-xs tracking-wide text-muted">
        <Link href="/" className="transition hover:text-ink">
          返回首页
        </Link>
      </p>
    </div>
  );
}
