import "server-only";
import { cache } from "react";
import { defaultContent } from "@/content/defaults";
import { localWorks, localBrands } from "@/content/localMedia";
import { adminConfigured, adminDb } from "@/lib/firebaseAdmin";

export const CONTENT_DOC = ["site", "content"];

// true = ملفات Cloudinary بتتتجاهل في الموقع، وبتتستخدم الملفات المحلية من /public
const IGNORE_CLOUDINARY = true;
const isCloud = (m) => m?.provider === "cloudinary" || /^https:\/\/res\.cloudinary\.com\//.test(m?.url || "");
const usable = (m) => !!m?.url && !(IGNORE_CLOUDINARY && isCloud(m));
const pick = (m, fallback) => (usable(m) ? m : fallback);

/** لو مفيش أعمال/براندز شغالة في المحتوى المحفوظ، بنستخدم الملفات المحلية. */
function withLocal(c) {
  const works = (c.work?.items || [])
    .filter((i) => usable(i.media))
    .map((i) => (i.poster && !usable(i.poster) ? { ...i, poster: null } : i));
  const brands = (c.brands || []).filter((b) => usable(b.logo));
  return {
    ...c,
    work: works.length
      ? { ...c.work, items: works }
      : { ...c.work, items: localWorks.items, categories: localWorks.categories },
    brands: brands.length ? brands : localBrands,
    hero: { ...c.hero, image: pick(c.hero?.image, defaultContent.hero.image) },
    about: { ...c.about, image: pick(c.about?.image, defaultContent.about.image) },
    contact: { ...c.contact, cv: pick(c.contact?.cv, defaultContent.contact.cv) },
    reviews: { ...c.reviews, items: (c.reviews?.items || []).filter((r) => usable(r.image)) },
  };
}

/** Objects merge key by key, arrays/primitives from the stored copy replace the defaults. */
function merge(base, extra) {
  if (Array.isArray(base) || typeof base !== "object" || base === null) return extra === undefined ? base : extra;
  if (typeof extra !== "object" || extra === null || Array.isArray(extra)) return base;
  const out = { ...base };
  for (const k of Object.keys(extra)) out[k] = k in base ? merge(base[k], extra[k]) : extra[k];
  return out;
}

export async function readStored() {
  if (!adminConfigured) return null;
  const snap = await adminDb().collection(CONTENT_DOC[0]).doc(CONTENT_DOC[1]).get();
  return snap.exists ? snap.data() : null;
}

/** Content for the public site (stored copy merged over defaults). Never throws: falls back to defaults. */
export const getContent = cache(async () => {
  try {
    const stored = await readStored();
    return withLocal(stored ? merge(defaultContent, stored) : defaultContent);
  } catch (e) {
    console.error("[content] using defaults:", e.message);
    return withLocal(defaultContent);
  }
});

export const SITE_URL = "https://izac-fayz.vercel.app";