"use client";
import { useEffect, useState } from "react";
import { useAdmin } from "./fields";
import { authedFetch } from "@/lib/cloudinaryUpload";

const ID = process.env.NEXT_PUBLIC_CLARITY_ID;
const base = ID ? `https://clarity.microsoft.com/projects/view/${ID}` : "";
const LINKS = [
  ["Dashboard", "Full analytics, filters and date ranges", "dashboard"],
  ["Heatmaps", "Where visitors click and how far they scroll", "heatmaps"],
  ["Recordings", "Watch real visitor sessions", "impressions"],
  ["Settings", "Team members, IP blocking, cookie consent", "settings"],
];

function List({ title, rows }) {
  const max = Math.max(1, ...rows.map((r) => r.sessions));
  return (
    <div className="rounded-2xl border bg-card p-5">
      <h3 className="mb-3 font-bold">{title}</h3>
      {rows.length === 0 && <p className="text-sm text-muted">No data yet.</p>}
      <ul className="grid gap-2.5">
        {rows.map((r) => (
          <li key={r.label} className="text-sm">
            <div className="flex justify-between gap-3"><span className="truncate">{r.label}</span><span className="tabular-nums text-muted">{r.sessions}</span></div>
            <div className="mt-1 h-1.5 overflow-hidden rounded-full bg-black/20"><div className="h-full rounded-full bg-accent" style={{ width: `${(r.sessions / max) * 100}%` }} /></div>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default function AnalyticsTab() {
  const { getToken } = useAdmin();
  const [d, setD] = useState(null);
  const [err, setErr] = useState("");

  useEffect(() => {
    (async () => {
      try { setD(await authedFetch(await getToken(), "/api/analytics")); }
      catch (e) { setErr(e.message); }
    })();
  }, [getToken]);

  return (
    <div className="grid gap-6">
      <div>
        <h2 className="text-lg font-bold">Visitors — last 3 days</h2>
        <p className="mt-1 text-sm text-muted">Numbers refresh twice a day (Microsoft Clarity limit). For older dates, heatmaps and recordings use the buttons below.</p>
      </div>

      {err && <div className="rounded-2xl border bg-card p-5 text-sm text-muted">{err}</div>}
      {!d && !err && <p className="text-muted">Loading…</p>}

      {d && (
        <>
          <div className="grid gap-4 sm:grid-cols-3">
            {[["Visits (sessions)", d.totals.sessions], ["Unique visitors", d.totals.users], ["Bot visits (excluded)", d.totals.bots]].map(([t, v]) => (
              <div key={t} className="rounded-2xl border bg-card p-5"><p className="text-sm text-muted">{t}</p><p className="mt-1 text-3xl font-extrabold tabular-nums">{v}</p></div>
            ))}
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <List title="Countries" rows={d.country} />
            <List title="Devices" rows={d.device} />
            <List title="Traffic sources" rows={d.source} />
            <List title="Top pages" rows={d.pages} />
          </div>
        </>
      )}

      <div>
        <h3 className="mb-3 font-bold">Open in Microsoft Clarity</h3>
        {!ID ? <p className="text-sm text-muted">Add <code>NEXT_PUBLIC_CLARITY_ID</code> to the environment.</p> : (
          <div className="grid gap-4 md:grid-cols-2">
            {LINKS.map(([t, desc, p]) => (
              <a key={p} href={`${base}/${p}`} target="_blank" rel="noopener noreferrer" className="rounded-2xl border bg-card p-5 transition hover:border-accent">
                <p className="text-lg font-bold">{t} ↗</p><p className="mt-1 text-sm text-muted">{desc}</p>
              </a>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}