import Link from "next/link";

const nav = [
  { href: "/vision", label: "关于体系" },
  { href: "/discover", label: "作品与系列" },
  { href: "/collaborate", label: "咨询支持" },
];

export function Header() {
  return (
    <header className="border-b border-border bg-paper-elevated">
      <div className="border-b border-border bg-museum text-white">
        <div className="museum-container flex h-9 items-center justify-between text-[11px] tracking-wide">
          <span>艺术家个人资产体系 · 验证期平台</span>
          <Link href="/login" className="opacity-80 transition hover:opacity-100">
            艺术家登录
          </Link>
        </div>
      </div>
      <div className="museum-container flex flex-col gap-4 py-5 sm:flex-row sm:items-end sm:justify-between">
        <Link href="/" className="group">
          <p className="text-[11px] tracking-[0.2em] text-muted uppercase">
            Artist Asset Archive
          </p>
          <h1 className="font-serif text-2xl font-normal tracking-wide text-museum sm:text-3xl">
            玛格丽特档案馆
          </h1>
        </Link>
        <nav className="flex flex-wrap gap-x-6 gap-y-2">
          {nav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-sm tracking-wide text-ink transition hover:text-museum"
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
