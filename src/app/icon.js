import { ImageResponse } from "next/og";
import { getContent } from "@/lib/content";

export const size = { width: 64, height: 64 };
export const contentType = "image/png";

// Generated favicon (accent dot). Drop an icon.png / favicon.ico in /src/app to override it with your own.
export default async function Icon() {
  const c = await getContent();
  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", background: c.theme.bg, borderRadius: 14 }}>
        <div style={{ width: 30, height: 30, borderRadius: 15, background: c.theme.accent }} />
      </div>
    ),
    size,
  );
}
