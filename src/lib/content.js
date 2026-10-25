import "server-only";
import { cache } from "react";
import { defaultContent } from "@/content/defaults";
import { adminConfigured, adminDb } from "@/lib/firebaseAdmin";

export const CONTENT_DOC = ["site", "content"];

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
    return stored ? merge(defaultContent, stored) : defaultContent;
  } catch (e) {
    console.error("[content] using defaults:", e.message);
    return defaultContent;
  }
});

export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL || "https://izacfayz.com").replace(/\/$/, "");
