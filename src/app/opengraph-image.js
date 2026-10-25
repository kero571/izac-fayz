import { ImageResponse } from "next/og";
import { getContent } from "@/lib/content";

export const alt = "Izac Fayz – Senior Motion Designer";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function OgImage() {
  const c = await getContent();
  const { accent, bg, text, muted } = c.theme;
  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", justifyContent: "center", padding: 80, background: bg, color: text }}>
        <div style={{ display: "flex", alignItems: "center", fontSize: 34, fontWeight: 700 }}>
          <div style={{ width: 22, height: 22, borderRadius: 11, background: accent, marginRight: 16 }} />
          {c.site.name}
        </div>
        <div style={{ display: "flex", flexWrap: "wrap", fontSize: 76, fontWeight: 800, lineHeight: 1.1, marginTop: 36 }}>
          {c.hero.titleStart}&nbsp;<span style={{ color: accent }}>{c.hero.titleAccent}</span>
        </div>
        <div style={{ fontSize: 30, color: muted, marginTop: 40 }}>{c.hero.badge}</div>
      </div>
    ),
    size,
  );
}
