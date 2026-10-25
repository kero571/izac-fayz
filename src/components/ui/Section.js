export function Eyebrow({ n, label, center }) {
  return (
    <p className={`text-[13px] font-bold uppercase tracking-[0.14em] text-accent ${center ? "text-center" : ""}`}>
      {String(n).padStart(2, "0")} / {label}
    </p>
  );
}

export function Title({ start, accent, id, center, className = "" }) {
  return (
    <h2
      id={id}
      className={`mt-3 text-[28px] font-bold leading-[1.18] text-ink sm:text-4xl md:text-[44px] ${center ? "text-center" : ""} ${className}`}
    >
      {start} <span className="text-accent">{accent}</span>
    </h2>
  );
}

/** Wrapper shared by all sections: alternating background, top border, centered container. */
export default function Section({ id, alt, children, className = "" }) {
  return (
    <section id={id} aria-labelledby={`${id}-title`} className={`border-t ${alt ? "bg-alt" : "bg-base"} py-16 md:py-24 ${className}`}>
      <div className="mx-auto w-full max-w-6xl px-5 md:px-8">{children}</div>
    </section>
  );
}
