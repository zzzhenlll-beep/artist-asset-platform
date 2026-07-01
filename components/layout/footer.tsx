import Link from "next/link";

export function Footer() {
  return (
    <footer className="mt-auto border-t border-border bg-museum text-white">
      <div className="museum-container grid gap-10 py-12 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <p className="text-[11px] tracking-[0.15em] uppercase opacity-70">档案馆</p>
          <p className="mt-2 font-serif text-lg">玛格丽特档案馆</p>
          <p className="mt-3 text-xs leading-relaxed opacity-80">
            杭州 · 独立绘画创作者售前资产档案示范
          </p>
        </div>
        <div>
          <p className="text-[11px] tracking-[0.15em] uppercase opacity-70">浏览</p>
          <ul className="mt-3 space-y-2 text-sm opacity-90">
            <li><Link href="/vision" className="hover:underline">关于体系</Link></li>
            <li><Link href="/discover" className="hover:underline">作品与系列</Link></li>
            <li><Link href="/collaborate" className="hover:underline">咨询支持</Link></li>
          </ul>
        </div>
        <div>
          <p className="text-[11px] tracking-[0.15em] uppercase opacity-70">联系</p>
          <p className="mt-3 text-sm opacity-90">hello@margaret.art</p>
          <p className="mt-1 text-sm opacity-90">@margaret.studio</p>
        </div>
        <div>
          <p className="text-[11px] tracking-[0.15em] uppercase opacity-70">平台</p>
          <p className="mt-3 text-xs leading-relaxed opacity-80">
            艺术家个人资产体系 — 记录、解释与积累售前阶段价值
          </p>
        </div>
      </div>
      <div className="border-t border-white/15">
        <div className="museum-container py-5 text-center text-[11px] opacity-60">
          © 2026 玛格丽特档案馆 · 验证期演示
        </div>
      </div>
    </footer>
  );
}
