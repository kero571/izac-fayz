// Fonts the owner can pick from /admin. Files are self-hosted in /public/fonts (no third-party requests).
// Only the selected font is preloaded/downloaded. "system" = zero download (fastest).
export const FONTS = {
  system: { label: "System (Helvetica / Arial) — fastest", family: null, files: [] },
  inter: { label: "Inter", family: "Inter", files: ["inter-latin-wght-normal.woff2"] },
  "space-grotesk": { label: "Space Grotesk", family: "Space Grotesk", files: ["space-grotesk-latin-wght-normal.woff2"] },
  sora: { label: "Sora", family: "Sora", files: ["sora-latin-wght-normal.woff2"] },
  manrope: { label: "Manrope", family: "Manrope", files: ["manrope-latin-wght-normal.woff2"] },
  outfit: { label: "Outfit", family: "Outfit", files: ["outfit-latin-wght-normal.woff2"] },
  "dm-sans": { label: "DM Sans", family: "DM Sans", files: ["dm-sans-latin-wght-normal.woff2"] },
  "plus-jakarta-sans": { label: "Plus Jakarta Sans", family: "Plus Jakarta Sans", files: ["plus-jakarta-sans-latin-wght-normal.woff2"] },
  montserrat: { label: "Montserrat", family: "Montserrat", files: ["montserrat-latin-wght-normal.woff2"] },
  cairo: { label: "Cairo (Arabic + Latin)", family: "Cairo", files: ["cairo-latin-wght-normal.woff2", "cairo-arabic-wght-normal.woff2"] },
};

export const SYSTEM_STACK = '"Helvetica Neue", Helvetica, Arial, "Liberation Sans", sans-serif';
