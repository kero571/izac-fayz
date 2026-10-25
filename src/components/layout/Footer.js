import { safeHref } from "@/lib/media";

export default function Footer({ studio, tagline, nav, backToTop }) {
  return (
    <footer className="border-t bg-base px-5 py-14 text-center">
      <p className="flex items-center justify-center gap-2.5 text-xl font-bold text-ink">
        <span className="h-3 w-3 rounded-full bg-accent" aria-hidden="true" /> {studio}
      </p>
      <p className="mx-auto mt-4 max-w-sm text-[15px] leading-relaxed text-muted">{tagline}</p>
      <nav aria-label="Footer" className="mt-7 flex flex-wrap items-center justify-center gap-x-4 gap-y-2 text-[15px] font-bold text-muted">
        {nav.map((n, i) => (
          <span key={n.label} className="flex items-center gap-4">
            {i > 0 && <span aria-hidden="true">·</span>}
            <a href={safeHref(n.href)} className="transition-colors hover:text-ink">{n.label}</a>
          </span>
        ))}
      </nav>
      <a href="#home" className="lift mt-8 inline-flex rounded-full border bg-card px-6 py-3 text-[15px] font-bold text-accent">{backToTop} ↑</a>
    </footer>
  );
}
