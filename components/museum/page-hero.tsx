interface PageHeroProps {
  eyebrow?: string;
  title: string;
  description?: string;
  dark?: boolean;
}

export function PageHero({ eyebrow, title, description, dark }: PageHeroProps) {
  return (
    <section className={dark ? "bg-museum text-white" : "border-b border-border bg-paper-elevated"}>
      <div className="museum-container py-12 sm:py-16">
        {eyebrow && (
          <p
            className={`text-[11px] tracking-[0.2em] uppercase ${dark ? "text-white/70" : "text-muted-light"}`}
          >
            {eyebrow}
          </p>
        )}
        <h1 className={`mt-3 font-serif text-3xl font-normal sm:text-4xl lg:text-5xl ${dark ? "" : "text-museum"}`}>
          {title}
        </h1>
        {description && (
          <p
            className={`mt-6 max-w-2xl text-sm leading-loose sm:text-base ${dark ? "text-white/85" : "text-muted"}`}
          >
            {description}
          </p>
        )}
      </div>
    </section>
  );
}
