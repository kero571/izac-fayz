"use client";
import { useState } from "react";
import Icon from "@/components/ui/Icon";
import { imageUrl, posterUrl, videoUrl } from "@/lib/media";

/** Filter chips + 9:16 cards. A video loads only when the visitor presses play, and plays inside its own card. */
export default function WorkGrid({ items, categories, allLabel, moreLabel, pageSize }) {
  const [active, setActive] = useState("all");
  const [shown, setShown] = useState(pageSize);
  const [playing, setPlaying] = useState(null);

  const list = items.filter((i) => active === "all" || i.category === active);
  const visible = list.slice(0, shown);
  const used = categories.filter((cat) => items.some((i) => i.category === cat));

  const pick = (key) => { setActive(key); setShown(pageSize); setPlaying(null); };

  return (
    <>
      <div role="tablist" aria-label="Project categories" className="no-scrollbar -mx-5 mt-8 flex gap-2.5 overflow-x-auto px-5 md:mx-0 md:flex-wrap md:px-0">
        {[["all", allLabel], ...used.map((x) => [x, x])].map(([key, label]) => (
          <button key={key} role="tab" aria-selected={active === key} onClick={() => pick(key)}
            className={`shrink-0 rounded-full border px-5 py-2.5 text-[15px] font-semibold transition-all duration-300 ${active === key ? "border-accent bg-accent text-on-accent" : "bg-card text-muted hover:text-ink"}`}>
            {label}
          </button>
        ))}
      </div>

      <ul className="mt-8 grid grid-cols-2 gap-3 md:grid-cols-3 md:gap-5 lg:grid-cols-4">
        {visible.map((w, i) => (
          <Card key={w.id} w={w} i={i % pageSize} playing={playing === w.id} onPlay={() => setPlaying(w.id)} onStop={() => setPlaying(null)} />
        ))}
      </ul>

      {list.length === 0 && <p className="mt-10 text-center text-muted">No projects in this category yet.</p>}

      {list.length > shown && (
        <button onClick={() => setShown((s) => s + pageSize)}
          className="lift mt-8 flex h-14 w-full items-center justify-center rounded-2xl bg-accent text-base font-bold text-on-accent md:mx-auto md:max-w-xs">
          {moreLabel}
        </button>
      )}
    </>
  );
}

function Card({ w, i, playing, onPlay, onStop }) {
  const isVideo = w.kind === "video" && w.media?.url;
  const poster = posterUrl(w);
  const label = w.title || w.category;
  return (
    <li data-reveal style={{ "--d": `${i * 70}ms` }}
      className="group relative aspect-[9/16] overflow-hidden rounded-2xl bg-[linear-gradient(180deg,color-mix(in_srgb,var(--accent)_8%,var(--card)),var(--bg))]">
      {playing ? (
        <video src={videoUrl(w.media)} poster={poster || undefined} controls autoPlay playsInline preload="auto" onEnded={onStop}
          className="absolute inset-0 h-full w-full bg-black object-contain" aria-label={label} />
      ) : (
        <>
          {poster && (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={poster} alt={w.title || `${w.category} project`} loading="lazy" decoding="async"
              className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105" />
          )}
          {w.category && (
            <span className="absolute left-3 top-3 z-10 rounded-md border bg-base/80 px-2.5 py-1 text-xs font-bold text-accent backdrop-blur-sm">{w.category}</span>
          )}
          {isVideo ? (
            <button type="button" onClick={onPlay} aria-label={`Play ${label}`} className="absolute inset-0 z-10 grid place-items-center">
              <PlayIcon />
            </button>
          ) : (
            w.kind === "video" && <div className="absolute inset-0 z-10 grid place-items-center" aria-hidden="true"><PlayIcon /></div>
          )}
          {w.title && <p className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/85 to-transparent p-3 pt-10 text-sm font-semibold text-white">{w.title}</p>}
        </>
      )}
    </li>
  );
}

const PlayIcon = () => (
  <span className="play-btn grid h-[42px] w-[42px] place-items-center rounded-full border-2 border-accent bg-base/40 text-accent backdrop-blur-sm">
    <Icon name="play" className="ml-0.5 h-4 w-4" />
  </span>
);
