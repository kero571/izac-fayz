import Section, { Eyebrow, Title } from "@/components/ui/Section";
import WorkGrid from "@/components/sections/WorkGrid";

/** Small seeded random generator: same seed = same order, so every visitor sees the same order within a time slot. */
function rng(seed) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** New order every `hours` hours (UTC time slots). */
function shuffled(list, hours) {
  const slot = Math.floor(Date.now() / (Math.max(1, hours) * 3600 * 1000));
  const rand = rng(slot * 2654435761);
  const a = [...list];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export default function Work({ c, n, alt }) {
  const w = c.work;
  // Only plain, already-cleaned data is sent to the client component.
  const visible = w.items.filter((i) => i.visible !== false);
  const items = (w.autoShuffle ? shuffled(visible, w.shuffleHours || 3) : visible).map(({ id, kind, category, title, media, poster }) => ({ id, kind, category, title, media, poster }));
  return (
    <Section id="work" alt={alt}>
      <div data-reveal>
        <Eyebrow n={n} label="Selected Work" />
        <Title id="work-title" start={w.titleStart} accent={w.titleAccent} />
      </div>
      <WorkGrid items={items} categories={w.categories} allLabel={w.allLabel} moreLabel={w.showMoreLabel} pageSize={w.pageSize || 4} />
    </Section>
  );
}