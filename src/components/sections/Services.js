import Section, { Eyebrow, Title } from "@/components/ui/Section";

export default function Services({ c, n, alt }) {
  const s = c.services;
  return (
    <Section id="services" alt={alt}>
      <div data-reveal className="max-w-2xl">
        <Eyebrow n={n} label="Services" />
        <Title id="services-title" start={s.titleStart} accent={s.titleAccent} />
        {s.subtitle && <p className="mt-4 text-[15px] leading-relaxed text-muted md:text-base">{s.subtitle}</p>}
      </div>
      <ul className="mt-10 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {s.items.map((it, i) => (
          <li key={it.id || i} data-reveal style={{ "--d": `${(i % 3) * 90}ms` }} className="lift flex flex-col rounded-3xl border bg-card p-5 md:p-6">
            <div className="flex items-start justify-between gap-3">
              <span className="text-[28px] font-bold leading-none text-accent">{String(i + 1).padStart(2, "0")}</span>
              {it.tag && <span className="rounded-lg border bg-tag px-3 py-2 text-[11px] font-bold uppercase tracking-[0.12em] text-ink">{it.tag}</span>}
            </div>
            <h3 className="mt-5 text-xl font-bold text-ink">{it.title}</h3>
            <p className="mt-2.5 text-[15px] leading-[1.7] text-muted">{it.text}</p>
            {it.chips?.length > 0 && (
              <ul className="mt-5 flex flex-wrap gap-2 pt-1">
                {it.chips.map((chip) => (
                  <li key={chip} className="rounded-full border px-3 py-1 text-[13px] text-muted">{chip}</li>
                ))}
              </ul>
            )}
          </li>
        ))}
      </ul>
    </Section>
  );
}
