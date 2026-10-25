import Icon from "@/components/ui/Icon";
import Section, { Eyebrow, Title } from "@/components/ui/Section";
import { safeHref } from "@/lib/media";

const btn = "lift flex h-14 items-center justify-center gap-2.5 rounded-2xl border bg-card text-[15px] font-semibold text-ink";

export default function Contact({ c, n, alt }) {
  const k = c.contact;
  const wa = k.whatsapp ? `https://wa.me/${k.whatsapp.replace(/\D/g, "")}${k.whatsappMessage ? `?text=${encodeURIComponent(k.whatsappMessage)}` : ""}` : null;
  return (
    <Section id="contact" alt={alt}>
      <div className="mx-auto max-w-xl text-center">
        <div data-reveal>
          <Eyebrow n={n} label="Contact" center />
          <Title id="contact-title" start={<>{k.titleStart}<br /></>} accent={k.titleAccent} center />
          <p className="mx-auto mt-5 max-w-md text-[15px] leading-relaxed text-muted md:text-base">{k.text}</p>
        </div>

        <div data-reveal style={{ "--d": "100ms" }} className="mt-8 grid gap-3">
          {wa && (
            <a href={wa} target="_blank" rel="noopener noreferrer"
              className="lift flex h-14 items-center justify-center gap-2.5 rounded-2xl bg-accent px-4 text-[15px] font-bold text-on-accent hover:shadow-[0_12px_34px_-10px_var(--accent)]">
              <Icon name="whatsapp" className="h-5 w-5 shrink-0" /> {k.whatsappLabel}
            </a>
          )}
          {(k.email || k.cv?.url) && (
            <div className={`grid gap-3 ${k.email && k.cv?.url ? "grid-cols-2" : ""}`}>
              {k.email && <a href={`mailto:${k.email}`} className={btn}><Icon name="mail" className="h-[18px] w-[18px] text-accent" /> {k.emailLabel}</a>}
              {k.cv?.url && <a href={k.cv.url} target="_blank" rel="noopener noreferrer" download className={btn}><Icon name="download" className="h-[18px] w-[18px] text-accent" /> {k.cvLabel}</a>}
            </div>
          )}
        </div>

        {k.socials?.length > 0 && (
          <ul data-reveal style={{ "--d": "180ms" }} className="mt-7 flex justify-center gap-3">
            {k.socials.map((s) => (
              <li key={s.platform + s.url}>
                <a href={safeHref(s.url)} target="_blank" rel="noopener noreferrer me" aria-label={s.platform}
                  className="lift grid h-[42px] w-[42px] place-items-center rounded-xl border bg-card text-accent"><Icon name={s.platform} className="h-5 w-5" /></a>
              </li>
            ))}
          </ul>
        )}
      </div>
    </Section>
  );
}
