import "server-only";
import { NextResponse } from "next/server";
import { adminAuth, adminConfigured } from "@/lib/firebaseAdmin";

const hits = new Map(); // ip -> [timestamps]  (best-effort, per server instance)
function limited(ip, max = 60, windowMs = 60_000) {
  const now = Date.now();
  const list = (hits.get(ip) || []).filter((t) => now - t < windowMs);
  list.push(now);
  hits.set(ip, list);
  if (hits.size > 5000) hits.clear();
  return list.length > max;
}

const json = (body, status) =>
  NextResponse.json(body, { status, headers: { "Cache-Control": "no-store" } });

/**
 * Protects every dashboard API:
 *  1. rate limit per IP  2. same-origin check for writes
 *  3. valid Firebase ID token (not revoked)  4. email must be in ADMIN_EMAILS.
 * Returns { user } or { error: Response }.
 */
export async function requireAdmin(request) {
  const ip =
    request.headers.get("x-forwarded-for")?.split(",")[0].trim() || "unknown";
  if (limited(ip)) return { error: json({ error: "Too many requests" }, 429) };

  if (request.method !== "GET") {
    const origin = request.headers.get("origin");
    const host = request.headers.get("host");
    if (!origin || new URL(origin).host !== host)
      return { error: json({ error: "Bad origin" }, 403) };
  }
  if (!adminConfigured)
    return {
      error: json(
        { error: "Server is not configured (Firebase Admin env vars missing)" },
        503,
      ),
    };

  const token = request.headers
    .get("authorization")
    ?.replace(/^Bearer\s+/i, "");
  if (!token) return { error: json({ error: "Unauthorized" }, 401) };
  try {
    const user = await adminAuth().verifyIdToken(token, true);
    const allowed = (process.env.ADMIN_UIDS || "")
      .split(",")
      .map((e) => e.trim())
      .filter(Boolean);
    if (!allowed.includes(user.uid))
      return {
        error: json(
          {
            error: `Forbidden: this account is not an admin. Add this UID to ADMIN_UIDS (then restart the server): ${user.uid}`,
          },
          403,
        ),
      };
    return { user };
  } catch {
    return { error: json({ error: "Unauthorized" }, 401) };
  }
}

export { json };
