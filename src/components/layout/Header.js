"use client";
import { useState } from "react";
import { safeHref } from "@/lib/media";

export default function Header({ name, nav, cta }) {
  const [open, setOpen] = useState(false);
  const links = nav.map((n) => (
    <a key={n.label + n.href} href={safeHref(n.href)} onClick={() => setOpen(false)}
       className="text-[15px] font-semibold text-muted transition-colors duration-300 hover:text-ink">
      {n.label}
    </a>
  ));
  return (
    <header className="sticky top-0 z-50 border-b bg-base/85 backdrop-blur-md" style={{ height: "var(--nav-h)" }}>
      <div className="mx-auto flex h-full max-w-6xl items-center justify-between px-5 md:px-8">
        <a href="#home" className="flex items-center gap-2.5 text-xl font-bold tracking-tight text-ink" aria-label={`${name} – home`}>
          <span className="h-3 w-3 rounded-full bg-accent" aria-hidden="true" />
          {name}
        </a>

        <nav aria-label="Main" className="hidden items-center gap-8 md:flex">
          {links}
          <a href={safeHref(cta.href)} className="rounded-full bg-accent px-5 py-2.5 text-sm font-bold text-on-accent transition-transform duration-300 hover:-translate-y-0.5">
            {cta.label}
          </a>
        </nav>

        <button type="button" aria-label="Menu" aria-expanded={open} aria-controls="mobile-menu" onClick={() => setOpen((v) => !v)}
          className="grid h-[42px] w-[42px] place-items-center rounded-xl border bg-card md:hidden">
          <span className="flex w-[18px] flex-col items-end gap-[5px]" aria-hidden="true">
            <i className={`block h-[2px] w-full bg-ink transition-transform duration-300 ${open ? "translate-y-[7px] rotate-45" : ""}`} />
            <i className={`block h-[2px] w-[70%] bg-accent transition-opacity duration-300 ${open ? "opacity-0" : ""}`} />
            <i className={`block h-[2px] w-[45%] bg-ink transition-all duration-300 ${open ? "-translate-y-[7px] w-full -rotate-45" : ""}`} />
          </span>
        </button>
      </div>

      <div id="mobile-menu" className={`absolute inset-x-0 top-full grid border-b bg-base/95 backdrop-blur-md transition-[grid-template-rows,opacity] duration-500 md:hidden ${open ? "grid-rows-[1fr] opacity-100" : "pointer-events-none grid-rows-[0fr] opacity-0"}`}>
        <nav aria-label="Mobile" className="flex flex-col gap-5 overflow-hidden px-5 [&>a]:py-0.5" style={{ paddingBlock: open ? "1.5rem" : 0 }}>
          {links}
          <a href={safeHref(cta.href)} onClick={() => setOpen(false)} className="rounded-full bg-accent py-3 text-center text-[15px] font-bold text-on-accent">{cta.label}</a>
        </nav>
      </div>
    </header>
  );
}
