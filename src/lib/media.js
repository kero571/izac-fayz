// Helpers for media objects: { provider: "local" | "cloudinary", url, publicId, width, height }

export const HERO_SIZES = "(min-width:1024px) 54vw, 100vw";

export const isCld = (m) => m?.provider === "cloudinary" || /^https:\/\/res\.cloudinary\.com\//.test(m?.url || "");

/** Insert a Cloudinary transformation after /upload/ . */
function cld(url, transform) {
  return url.replace("/upload/", `/upload/${transform}/`);
}

export function imageUrl(m, width) {
  if (!m?.url) return "";
  return isCld(m) ? cld(m.url, `f_auto,q_auto:eco${width ? `,c_limit,w_${width}` : ""}`) : m.url;
}

export function imageSrcSet(m, widths = [480, 750, 1080]) {
  if (!isCld(m)) return undefined;
  return widths.map((w) => `${imageUrl(m, w)} ${w}w`).join(", ");
}

/** Video URL: Cloudinary serves the best codec/quality automatically. */
export function videoUrl(m) {
  if (!m?.url) return "";
  return isCld(m) ? cld(m.url, "f_auto,q_auto") : m.url;
}

/** Poster for a work card: custom poster > auto frame from Cloudinary video > nothing. */
export function posterUrl(work, width = 540) {
  if (work.poster?.url) return imageUrl(work.poster, width);
  if (work.kind === "image" && work.media?.url) return imageUrl(work.media, width);
  const m = work.media;
  if (m?.url && isCld(m)) return cld(m.url, `so_0,f_jpg,q_auto,w_${width}`).replace(/\.[a-z0-9]+(\?.*)?$/i, ".jpg");
  return "";
}

const BAD = /^\s*(javascript|vbscript|data):/i;
/** Only allow safe link targets. */
export function safeHref(href) {
  const h = (href || "").trim();
  if (!h || BAD.test(h)) return "#";
  return h;
}