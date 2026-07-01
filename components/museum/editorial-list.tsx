import Link from "next/link";

interface EditorialItem {
  date?: string;
  title: string;
  href?: string;
  meta?: string;
}

export function EditorialList({
  title,
  items,
  moreHref,
}: {
  title: string;
  items: EditorialItem[];
  moreHref?: string;
}) {
  return (
    <section>
      <div className="mb-6 flex items-end justify-between border-b border-border pb-4">
        <h2 className="museum-section-title">{title}</h2>
        {moreHref && (
          <Link href={moreHref} className="museum-link text-xs">
            查看全部
          </Link>
        )}
      </div>
      <ul className="divide-y divide-border">
        {items.map((item) => (
          <li key={item.title} className="py-4">
            {item.href ? (
              <Link href={item.href} className="group block">
                <EditorialRow item={item} linked />
              </Link>
            ) : (
              <EditorialRow item={item} />
            )}
          </li>
        ))}
      </ul>
    </section>
  );
}

function EditorialRow({ item, linked }: { item: EditorialItem; linked?: boolean }) {
  return (
    <div className="flex flex-col gap-1 sm:flex-row sm:items-baseline sm:justify-between sm:gap-6">
      <h3
        className={`text-sm leading-relaxed ${linked ? "text-museum group-hover:underline" : "text-ink"}`}
      >
        {item.title}
      </h3>
      <div className="flex shrink-0 gap-3 text-[11px] text-muted-light">
        {item.date && <time>{item.date}</time>}
        {item.meta && <span>{item.meta}</span>}
      </div>
    </div>
  );
}
