"use client";
import { useEffect, useState } from "react";
import { imageSrcSet, imageUrl } from "@/lib/media";

/** Client chat screenshots in a masonry grid, tap to enlarge. */
export default function ReviewsGallery({ items }) {
  const [open, setOpen] = useState(null);

  useEffect(() => {
    if (open === null) return;
    const onKey = (e) => e.key === "Escape" && setOpen(null);
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => { document.removeEventListener("keydown", onKey); document.body.style.overflow = ""; };
  }, [open]);

  return (
    <>
      <ul className="mt-10 columns-2 gap-3 md:columns-3 md:gap-5 lg:columns-4">
        {items.map((it, i) => (
          <li key={it.id || i} data-reveal style={{ "--d": `${(i % 4) * 80}ms` }} className="mb-3 break-inside-avoid md:mb-5">
            <button type="button" onClick={() => setOpen(i)} aria-label={`Open testimonial ${i + 1}`}
              className="lift block w-full overflow-hidden rounded-2xl border bg-card">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={imageUrl(it.image, 480)} srcSet={imageSrcSet(it.image, [320, 480, 640])} sizes="(min-width:1024px) 22vw, (min-width:768px) 30vw, 46vw"
                alt={it.alt || `Client testimonial screenshot ${i + 1}`} width={it.image.width || 480} height={it.image.height || 860}
                loading="lazy" decoding="async" className="h-auto w-full" />
            </button>
          </li>
        ))}
      </ul>

      {open !== null && (
        <div role="dialog" aria-modal="true" aria-label="Testimonial" onClick={() => setOpen(null)}
          className="fixed inset-0 z-[60] grid place-items-center bg-black/90 p-4 backdrop-blur-sm" style={{ animation: "rise .35s var(--ease) both" }}>
          <button type="button" aria-label="Close" className="absolute right-4 top-4 grid h-11 w-11 place-items-center rounded-full border bg-card text-2xl text-ink">×</button>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={imageUrl(items[open].image, 1200)} alt={items[open].alt || "Client testimonial screenshot"} className="max-h-[90svh] w-auto max-w-full rounded-2xl" />
        </div>
      )}
    </>
  );
}
