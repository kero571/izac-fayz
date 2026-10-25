import { imageUrl } from "@/lib/media";

/** Logo marquee shown at the bottom of the hero. Pure CSS animation. */
export default function BrandsStrip({ label, brands }) {
  if (!brands?.length) return null;
  // NEW: repeat the logos until one row is wider than any screen (~28 logos), so there is never an empty gap
  const reps = Math.max(1, Math.ceil(28 / brands.length));
  const row = Array.from({ length: reps }, () => brands).flat();
  // NEW: keep the same scrolling speed no matter how many logos there are
  const duration = `${row.length * 4}s`;

  const Row = ({ hidden }) => (
    <ul className="flex shrink-0 items-center gap-3 pr-3" aria-hidden={hidden || undefined}>
      {row.map((b, i) => (
        <li key={`${b.id}-${i}`} className="flex h-11 items-center gap-2.5 rounded-xl bg-card px-2">
          {b.logo?.url ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={imageUrl(b.logo, 240)} alt={hidden || i >= brands.length ? "" : b.name} height="24" width={b.logo.width && b.logo.height ? Math.round((24 * b.logo.width) / b.logo.height) : undefined}
              loading="lazy" decoding="async" className="h-6 w-auto max-w-[140px] object-contain" />
          ) : (
            <>
              <span className="h-2.5 w-2.5 rounded-[3px] bg-accent" aria-hidden="true" />
              <span className="whitespace-nowrap text-[13px] font-bold uppercase tracking-wide text-ink">{b.name}</span>
            </>
          )}
        </li>
      ))}
    </ul>
  );

  return (
    <div className="relative z-10 border-y bg-alt py-3 lg:py-5">
      <p className="px-5 text-center text-[9px] font-semibold uppercase tracking-[0.2em] text-muted lg:text-[11px] lg:tracking-[0.25em]">{label}</p>
      <div className="marquee mt-3 overflow-hidden lg:mt-4 [mask-image:linear-gradient(to_right,transparent,#000_8%,#000_92%,transparent)]">
        <div className="marquee-track flex w-max" style={{ animationDuration: duration }}>
          <Row />
          <Row hidden />
        </div>
      </div>
    </div>
  );
}