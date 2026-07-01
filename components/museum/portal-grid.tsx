import Link from "next/link";
import { ArrowRight } from "lucide-react";

interface PortalItem {
  title: string;
  href: string;
  description?: string;
}

export function PortalGrid({ items }: { items: PortalItem[] }) {
  return (
    <div className="grid gap-px border border-border bg-border sm:grid-cols-2">
      {items.map((item) => (
        <Link
          key={item.href}
          href={item.href}
          className="group flex min-h-36 flex-col justify-between bg-paper-elevated p-8 transition hover:bg-accent-soft"
        >
          <div>
            <h3 className="font-serif text-xl text-museum">{item.title}</h3>
            {item.description && (
              <p className="mt-3 text-sm leading-relaxed text-muted">{item.description}</p>
            )}
          </div>
          <span className="mt-6 inline-flex items-center gap-1 text-xs tracking-wide text-museum">
            进入
            <ArrowRight className="h-3 w-3 transition group-hover:translate-x-0.5" />
          </span>
        </Link>
      ))}
    </div>
  );
}
