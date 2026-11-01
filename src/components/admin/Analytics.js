"use client";
const ID = process.env.NEXT_PUBLIC_CLARITY_ID;
const base = ID ? `https://clarity.microsoft.com/projects/view/${ID}` : "";
const LINKS = [
  ["Dashboard", "Visitors, sessions, countries, devices and sources", "dashboard"],
  ["Heatmaps", "Where visitors click and how far they scroll", "heatmaps"],
  ["Recordings", "Watch real visitor sessions", "impressions"],
  ["Settings", "Add team members, exclude your own IP, cookie consent", "settings"],
];

export default function AnalyticsTab() {
  if (!ID) return <div className="rounded-2xl border bg-card p-6 text-muted">Analytics is not connected yet. Add <code>NEXT_PUBLIC_CLARITY_ID</code> to the environment and redeploy.</div>;
  return (
    <div className="grid gap-4">
      <p className="text-sm text-muted">Visitor analytics are powered by Microsoft Clarity (free). Open any page below. You may need to sign in with the account that was invited to the project.</p>
      <div className="grid gap-4 md:grid-cols-2">
        {LINKS.map(([t, d, p]) => (
          <a key={p} href={`${base}/${p}`} target="_blank" rel="noopener noreferrer" className="rounded-2xl border bg-card p-5 transition hover:border-accent">
            <p className="text-lg font-bold">{t} ↗</p>
            <p className="mt-1 text-sm text-muted">{d}</p>
          </a>
        ))}
      </div>
    </div>
  );
}