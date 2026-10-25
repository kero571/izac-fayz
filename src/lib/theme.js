import { FONTS, SYSTEM_STACK } from "@/lib/fonts";
import { defaultContent } from "@/content/defaults";

export const COLOR_KEYS = ["accent", "bg", "bgAlt", "card", "border", "text", "muted"];
const HEX = /^#[0-9a-f]{6}$/i;

/** Black or white text for buttons that sit on the accent color. */
function readableOn(hex) {
  const n = parseInt(hex.slice(1), 16);
  const [r, g, b] = [(n >> 16) & 255, (n >> 8) & 255, n & 255];
  return (0.299 * r + 0.587 * g + 0.114 * b) / 255 > 0.55 ? "#000000" : "#ffffff";
}

const FAMILY = /^[A-Za-z0-9 _-]{1,40}$/;
const WEIGHTS = /^[0-9;]{3,40}$/;
const URL_OK = /^[\w\-./:%~+@]+$/;

/** Only our own files or Cloudinary can be used as font files. */
function fontUrl(m) {
  const u = m?.url;
  if (!u || !URL_OK.test(u)) return null;
  return (u.startsWith("/") && !u.startsWith("//")) || u.startsWith("https://res.cloudinary.com/") ? u : null;
}
const ext = (u) => u.split("?")[0].split(".").pop().toLowerCase();
const FORMATS = { woff2: ["woff2", "font/woff2"], woff: ["woff", "font/woff"], ttf: ["truetype", "font/ttf"], otf: ["opentype", "font/otf"] };

/** Font the owner uploaded: { family, regular: media, bold?: media } */
function customFont(t) {
  const cf = t.customFont || {};
  const reg = fontUrl(cf.regular);
  if (!FAMILY.test(cf.family || "") || !reg) return null;
  const bold = fontUrl(cf.bold);
  const face = (u, w) => `@font-face{font-family:"${cf.family}";src:url("${u}") format("${(FORMATS[ext(u)] || FORMATS.woff2)[0]}");font-weight:${w};font-style:normal;font-display:swap}`;
  const css = face(reg, bold ? "100 600" : "100 900") + (bold ? face(bold, "700 900") : "");
  return { family: cf.family, css, files: [reg, ...(bold ? [bold] : [])] };
}

/** Google Fonts family typed by the owner (loaded from fonts.googleapis.com). */
function googleFont(t) {
  if (!FAMILY.test(t.googleFont || "")) return null;
  const w = WEIGHTS.test(t.googleWeights || "") ? t.googleWeights : "400;600;700";
  return { family: t.googleFont, href: `https://fonts.googleapis.com/css2?family=${encodeURIComponent(t.googleFont).replace(/%20/g, "+")}:wght@${w}&display=swap` };
}

/** Builds the <style> content that applies the owner's colors + font (validated, safe to inject). */
export function themeCss(theme = {}) {
  const t = { ...defaultContent.theme, ...theme };
  for (const k of COLOR_KEYS) if (!HEX.test(t[k])) t[k] = defaultContent.theme[k];
  let faces = "";
  let family = null;
  if (t.font === "custom" && customFont(t)) {
    const c = customFont(t);
    faces = c.css;
    family = c.family;
  } else if (t.font === "google" && googleFont(t)) {
    family = googleFont(t).family;
  } else {
    const font = FONTS[t.font] || FONTS.system;
    if (font.family) {
      family = font.family;
      faces = font.files
        .map((f) => `@font-face{font-family:"${font.family}";src:url(/fonts/${f}) format("woff2");font-weight:100 900;font-style:normal;font-display:swap${f.includes("arabic") ? ";unicode-range:U+0600-06FF,U+0750-077F,U+08A0-08FF,U+FB50-FDFF,U+FE70-FEFF" : ""}}`)
        .join("");
    }
  }
  const stack = family ? `"${family}",${SYSTEM_STACK}` : SYSTEM_STACK;
  return `${faces}:root{--accent:${t.accent};--on-accent:${readableOn(t.accent)};--bg:${t.bg};--bg-alt:${t.bgAlt};--card:${t.card};--border:${t.border};--text:${t.text};--muted:${t.muted};--font-body:${stack}}`;
}

/** <link> tags needed in <head> for the selected font (preloads + Google stylesheet). */
export function fontAssets(theme = {}) {
  const t = { ...defaultContent.theme, ...theme };
  if (t.font === "custom" && customFont(t)) {
    return { google: null, preloads: customFont(t).files.filter((u) => ["woff2", "woff"].includes(ext(u))).map((href) => ({ href, type: FORMATS[ext(href)][1] })) };
  }
  if (t.font === "google" && googleFont(t)) return { google: googleFont(t).href, preloads: [] };
  const font = FONTS[t.font] || FONTS.system;
  return { google: null, preloads: font.files.filter((f) => !f.includes("arabic")).map((f) => ({ href: `/fonts/${f}`, type: "font/woff2" })) };
}
