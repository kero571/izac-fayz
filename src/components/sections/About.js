import Icon from "@/components/ui/Icon";
import Picture from "@/components/ui/Picture";
import Section, { Eyebrow, Title } from "@/components/ui/Section";

export default function About({ c, n, alt }) {
  const a = c.about;
  return (
    <Section id="about" alt={alt}>
      <div className="grid gap-10 lg:grid-cols-[minmax(0,5fr)_minmax(0,6fr)] lg:items-center lg:gap-16">
        <div data-reveal className="relative mx-auto aspect-[4/5] w-full max-w-[460px] overflow-hidden rounded-3xl bg-card lg:max-w-none">
          <Picture media={a.image} alt={a.imageAlt} sizes="(min-width:1024px) 40vw, 92vw" className="object-cover object-[50%_20%]" />
          <div className="absolute inset-x-3 bottom-3 flex items-center gap-2 rounded-2xl border bg-base/75 px-4 py-3.5 backdrop-blur-md">
            <span className="text-[15px] font-bold text-ink">{a.captionName}</span>
            <span className="text-sm text-muted">· {a.captionRole}</span>
          </div>
        </div>

        <div>
          <div data-reveal>
            <Eyebrow n={n} label="About" />
            <Title id="about-title" start={a.titleStart} accent={a.titleAccent} />
            <p className="mt-6 whitespace-pre-line text-base leading-[1.85] text-muted md:text-[17px]">{a.text}</p>
          </div>
          <ul className="mt-8 grid gap-3.5">
            {a.cards.map((card, i) => (
              <li key={card.title + i} data-reveal style={{ "--d": `${i * 90}ms` }} className="lift flex items-start gap-4 rounded-2xl border bg-card p-4">
                <span className="grid h-10 w-10 shrink-0 place-items-center rounded-lg border text-accent"><Icon name={card.icon} className="h-[18px] w-[18px]" /></span>
                <div>
                  <h3 className="text-[15px] font-bold leading-snug text-ink">{card.title}</h3>
                  <p className="mt-1 text-sm leading-relaxed text-muted">{card.text}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </Section>
  );
}
