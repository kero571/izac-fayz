import "server-only";
import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/guard";

const API = "https://www.clarity.ms/export-data/api/v1/project-live-insights";
const num = (v) => Number(v) || 0;
const labelOf = (r, dim) =>
  r[dim] ?? r[dim?.toLowerCase()] ?? Object.entries(r).find(([k, v]) => typeof v === "string" && !/count|percent/i.test(k))?.[1] ?? "Unknown";

async function pull(dim) {
  const res = await fetch(`${API}?numOfDays=3&dimension1=${dim}`, {
    headers: { Authorization: `Bearer ${process.env.CLARITY_API_TOKEN}` },
    next: { revalidate: 43200 }, // 12h cache: Clarity allows only 10 requests/day
  });
  if (res.status === 429) throw new Error("Clarity daily request limit reached. Try again tomorrow.");
  if (!res.ok) throw new Error(`Clarity returned ${res.status}. Check CLARITY_API_TOKEN.`);
  const data = await res.json();
  const t = (Array.isArray(data) ? data : []).find((m) => /traffic/i.test(m.metricName)) || data?.[0];
  return (t?.information || []).map((r) => ({
    label: String(labelOf(r, dim)).trim() || "Direct",
    sessions: num(r.totalSessionCount),
    bots: num(r.totalBotSessionCount),
    users: num(r.distinctUserCount ?? r.distantUserCount),
  }));
}

// merge pages by path (production + preview deployments), drop localhost
function mergePages(rows) {
  const m = new Map();
  for (const r of rows) {
    let path = r.label;
    try {
      const u = new URL(r.label);
      if (u.hostname === "localhost") continue;
      path = u.pathname || "/";
    } catch {}
    const x = m.get(path) || { label: path, sessions: 0, bots: 0, users: 0 };
    x.sessions += r.sessions;
    x.bots += r.bots;
    x.users += r.users;
    m.set(path, x);
  }
  return [...m.values()];
}

const top = (rows, n = 8) => [...rows].sort((a, b) => b.sessions - a.sessions).slice(0, n);

export async function GET(request) {
  const g = await requireAdmin(request);
  if (g.error) return g.error;
  if (!process.env.CLARITY_API_TOKEN) return NextResponse.json({ error: "CLARITY_API_TOKEN is not set." }, { status: 503 });
  try {
    const [country, device, source, url] = await Promise.all(["Country", "Device", "Source", "URL"].map(pull));
    const pages = mergePages(url);
    const sum = (rows, k) => rows.reduce((a, r) => a + r[k], 0);
    const best = (k) => Math.max(...[country, device, source].map((r) => sum(r, k)));
    return NextResponse.json({
      totals: { sessions: best("sessions"), users: best("users"), bots: best("bots") },
      country: top(country), device: top(device), source: top(source), pages: top(pages, 6),
    }, { headers: { "Cache-Control": "no-store" } });
  } catch (e) {
    return NextResponse.json({ error: e.message }, { status: 502 });
  }
}