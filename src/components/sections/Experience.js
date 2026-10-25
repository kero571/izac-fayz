import Section, { Eyebrow, Title } from "@/components/ui/Section";

export default function Experience({ c, n, alt }) {
  const e = c.experience;
  return (
    <Section id="experience" alt={alt}>
      <div data-reveal className="max-w-2xl">
        <Eyebrow n={n} label="Experience" />
        <Title id="experience-title" start={e.titleStart} accent={e.titleAccent} />
      </div>
      <ol className="relative mt-10 max-w-3xl border-l border-accent/40 pl-8 md:ml-2 md:pl-10">
        {e.items.map((it, i) => (
          <li key={it.id || i} data-reveal className="relative pb-12 last:pb-0">
            <span className="absolute -left-[41px] top-1 h-[14px] w-[14px] rounded-full border-2 border-accent bg-alt md:-left-[49px]" aria-hidden="true" />
            <p className="inline-block rounded-lg border bg-tag px-3 py-1.5 text-xs font-bold uppercase tracking-[0.1em] text-accent">{it.date}</p>
            <h3 className="mt-3 text-xl font-bold text-ink">{it.role}</h3>
            <p className="mt-1 text-[15px] text-accent">{[it.company, it.mode].filter(Boolean).join(" · ")}</p>
            <p className="mt-3 text-[15px] leading-[1.8] text-muted">{it.text}</p>
          </li>
        ))}
      </ol>
    </Section>
  );
}
