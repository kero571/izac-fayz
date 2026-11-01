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
    label: String(labelOf(r, dim)),
    sessions: num(r.totalSessionCount),
    bots: num(r.totalBotSessionCount),
    users: num(r.distinctUserCount ?? r.distantUserCount),
  }));
}

const top = (rows, n = 8) => [...rows].sort((a, b) => b.sessions - a.sessions).slice(0, n);

export async function GET(request) {
  const g = await requireAdmin(request);
  if (g.error) return g.error;
  if (!process.env.CLARITY_API_TOKEN) return NextResponse.json({ error: "CLARITY_API_TOKEN is not set." }, { status: 503 });
  try {
    const [country, device, source, url] = await Promise.all(["Country", "Device", "Source", "URL"].map(pull));
    const sum = (k) => country.reduce((a, r) => a + r[k], 0);
    return NextResponse.json({
      totals: { sessions: sum("sessions"), users: sum("users"), bots: sum("bots") },
      country: top(country), device: top(device), source: top(source), pages: top(url, 6),
    }, { headers: { "Cache-Control": "no-store" } });
  } catch (e) {
    return NextResponse.json({ error: e.message }, { status: 502 });
  }
}