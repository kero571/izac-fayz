import { defaultContent } from "@/content/defaults";
import { COLOR_KEYS } from "@/lib/theme";
import { FONTS } from "@/lib/fonts";

const BAD_SCHEME = /^\s*(javascript|vbscript|data):/i;
const HEX = /^#[0-9a-f]{6}$/i;

function clean(value, key, depth) {
  if (depth > 8) throw new Error("Content too deeply nested");
  if (typeof value === "string") {
    if (value.length > 6000) throw new Error("Text too long");
    if (BAD_SCHEME.test(value)) return "";
    // media urls: only our own files (/path) or Cloudinary
    if (key === "url" && value && !(value.startsWith("/") && !value.startsWith("//")) && !value.startsWith("https://res.cloudinary.com/")) return "";
    return value;
  }
  if (typeof value === "number") return Number.isFinite(value) ? value : 0;
  if (typeof value === "boolean" || value == null) return value ?? null;
  if (Array.isArray(value)) {
    if (value.length > 300) throw new Error("List too long");
    return value.map((v) => clean(v, key, depth + 1));
  }
  if (typeof value === "object") {
    const out = {};
    for (const k of Object.keys(value)) {
      if (k === "__proto__" || k === "constructor" || k === "prototype") continue;
      out[k] = clean(value[k], k, depth + 1);
    }
    return out;
  }
  throw new Error("Unsupported value");
}

/** Validates + cleans content coming from the dashboard before it is stored. Throws on invalid input. */
export function sanitizeContent(input) {
  if (!input || typeof input !== "object" || Array.isArray(input)) throw new Error("Invalid content");
  const out = {};
  for (const k of Object.keys(defaultContent)) if (k in input) out[k] = clean(input[k], k, 0);
  if (out.theme) {
    for (const k of COLOR_KEYS) if (!HEX.test(out.theme[k] || "")) out.theme[k] = defaultContent.theme[k];
    if (!FONTS[out.theme.font] && !["custom", "google"].includes(out.theme.font)) out.theme.font = "system";
    const fam = /^[A-Za-z0-9 _-]{1,40}$/;
    if (out.theme.customFont && !fam.test(out.theme.customFont.family || "")) out.theme.customFont.family = "";
    if (!fam.test(out.theme.googleFont || "")) out.theme.googleFont = "";
    if (!/^[0-9;]{3,40}$/.test(out.theme.googleWeights || "")) out.theme.googleWeights = "400;600;700";
  }
  if (out.sections) {
    const allowed = Object.keys(defaultContent.sections.order.reduce((a, id) => ({ ...a, [id]: 1 }), {}));
    out.sections.order = (out.sections.order || []).filter((id) => allowed.includes(id));
    out.sections.hidden = (out.sections.hidden || []).filter((id) => allowed.includes(id));
  }
  if (JSON.stringify(out).length > 400_000) throw new Error("Content too large");
  return out;
}
