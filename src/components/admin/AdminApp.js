"use client";
import { useCallback, useEffect, useRef, useState } from "react";
import { onAuthStateChanged, signInWithEmailAndPassword, signOut } from "firebase/auth";
import { authedFetch } from "@/lib/cloudinaryUpload";
import { clientAuth, firebaseReady } from "@/lib/firebaseClient";
import { themeCss } from "@/lib/theme";
import { AdminCtx, Btn, getIn, setIn } from "./fields";
import { TABS } from "./Editors";

const inputCls = "w-full rounded-xl border bg-card px-4 py-3 text-ink focus:border-accent focus:outline-none";

export default function AdminApp() {
  const [user, setUser] = useState(undefined); // undefined = still checking
  useEffect(() => {
    if (!firebaseReady) return setUser(null);
    return onAuthStateChanged(clientAuth(), setUser);
  }, []);

  if (!firebaseReady) return <Shell><Notice>Firebase is not configured. Add the <code>NEXT_PUBLIC_FIREBASE_*</code> variables (see README).</Notice></Shell>;
  if (user === undefined) return <Shell><p className="text-muted">Loading…</p></Shell>;
  if (!user) return <Login />;
  return <Dashboard user={user} />;
}

const Shell = ({ children }) => <main className="grid min-h-svh place-items-center bg-base p-5">{children}</main>;
const Notice = ({ children }) => <p className="max-w-md rounded-2xl border bg-card p-5 text-ink">{children}</p>;

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState("");
  const [busy, setBusy] = useState(false);
  async function submit(e) {
    e.preventDefault();
    setBusy(true); setErr("");
    try { await signInWithEmailAndPassword(clientAuth(), email.trim(), password); }
    catch { setErr("Wrong email or password."); }
    setBusy(false);
  }
  return (
    <Shell>
      <form onSubmit={submit} className="w-full max-w-sm space-y-4 rounded-3xl border bg-card p-7">
        <h1 className="flex items-center gap-2.5 text-2xl font-bold text-ink"><span className="h-3 w-3 rounded-full bg-accent" /> Dashboard</h1>
        <p className="text-sm text-muted">Sign in to edit your website.</p>
        <input className={inputCls} type="email" autoComplete="username" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        <input className={inputCls} type="password" autoComplete="current-password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required />
        {err && <p className="text-sm text-red-400">{err}</p>}
        <button disabled={busy} className="h-12 w-full rounded-xl bg-accent font-bold text-on-accent disabled:opacity-50">{busy ? "Signing in…" : "Sign in"}</button>
      </form>
    </Shell>
  );
}

function Dashboard({ user }) {
  const [c, setC] = useState(null);
  const [error, setError] = useState("");
  const [dirty, setDirty] = useState(false);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState("");
  const [tab, setTab] = useState("general");
  const pending = useRef([]); // Cloudinary files to delete after a successful save

  const getToken = useCallback(() => user.getIdToken(), [user]);

  useEffect(() => {
    (async () => {
      try { setC((await authedFetch(await getToken(), "/api/content")).content); }
      catch (e) { setError(e.message); }
    })();
  }, [getToken]);

  useEffect(() => {
    const warn = (e) => dirty && e.preventDefault();
    addEventListener("beforeunload", warn);
    return () => removeEventListener("beforeunload", warn);
  }, [dirty]);

  const set = useCallback((path, value) => { setC((old) => setIn(old, path, value)); setDirty(true); setMsg(""); }, []);
  const get = useCallback((path) => getIn(c, path), [c]);
  const queueDelete = useCallback((media, type) => { if (media?.publicId) pending.current.push({ publicId: media.publicId, resourceType: type || media.type || "image" }); }, []);

  async function save() {
    setSaving(true); setMsg("");
    try {
      const token = await getToken();
      await authedFetch(token, "/api/content", { method: "PUT", body: JSON.stringify({ content: c }) });
      // delete replaced/removed Cloudinary files, unless they are still used somewhere
      const used = JSON.stringify(c);
      const todo = pending.current.filter((p) => !used.includes(p.publicId));
      pending.current = [];
      await Promise.allSettled(todo.map((p) => authedFetch(token, "/api/cloudinary/delete", { method: "POST", body: JSON.stringify(p) })));
      setDirty(false); setMsg("Saved ✓ — the website is updated.");
    } catch (e) { setMsg(`Could not save: ${e.message}`); }
    setSaving(false);
  }

  async function reset() {
    if (!confirm("Reset the whole website to the original content? This cannot be undone.")) return;
    try {
      const token = await getToken();
      await authedFetch(token, "/api/content", { method: "DELETE" });
      setC((await authedFetch(token, "/api/content")).content); setDirty(false); setMsg("Reset to defaults.");
    } catch (e) { setMsg(e.message); }
  }

  if (error) return <Shell><Notice>{error}<br /><Btn className="mt-4" onClick={() => signOut(clientAuth())}>Sign out</Btn></Notice></Shell>;
  if (!c) return <Shell><p className="text-muted">Loading your content…</p></Shell>;

  const Active = TABS.find((t) => t.id === tab).Comp;
  return (
    <AdminCtx.Provider value={{ c, get, set, getToken, queueDelete }}>
      {/* live theme: the dashboard itself previews your colors */}
      <style dangerouslySetInnerHTML={{ __html: themeCss({ ...c.theme, font: "system" }) }} />
      <div className="min-h-svh bg-base text-ink">
        <header className="sticky top-0 z-40 flex flex-wrap items-center justify-between gap-3 border-b bg-base/90 px-4 py-3 backdrop-blur md:px-8">
          <p className="flex items-center gap-2.5 font-bold"><span className="h-3 w-3 rounded-full bg-accent" /> Dashboard <span className="hidden text-sm font-normal text-muted sm:inline">· {user.email}</span></p>
          <div className="flex flex-wrap items-center gap-2">
            {msg && <span className="text-sm text-muted">{msg}</span>}
            {dirty && !msg && <span className="text-sm text-accent">Unsaved changes</span>}
            <a href="/" target="_blank" rel="noopener" className="rounded-xl border px-4 py-2.5 text-sm">View site ↗</a>
            <Btn variant="primary" disabled={!dirty || saving} onClick={save}>{saving ? "Saving…" : "Save changes"}</Btn>
            <Btn onClick={() => signOut(clientAuth())}>Sign out</Btn>
          </div>
        </header>

        <div className="mx-auto grid max-w-6xl gap-6 px-4 py-6 md:px-8 lg:grid-cols-[210px_1fr]">
          <nav aria-label="Dashboard sections" className="no-scrollbar -mx-4 flex gap-2 overflow-x-auto px-4 lg:sticky lg:top-24 lg:mx-0 lg:h-fit lg:flex-col lg:overflow-visible lg:px-0">
            {TABS.map((t) => (
              <button key={t.id} onClick={() => setTab(t.id)} className={`shrink-0 rounded-xl border px-4 py-2.5 text-left text-sm font-semibold ${tab === t.id ? "border-accent bg-accent text-on-accent" : "bg-card text-muted hover:text-ink"}`}>{t.label}</button>
            ))}
            <button onClick={reset} className="mt-2 shrink-0 rounded-xl px-4 py-2.5 text-left text-xs text-muted underline">Reset to defaults</button>
          </nav>
          <div className="min-w-0 space-y-6"><Active /></div>
        </div>
      </div>
    </AdminCtx.Provider>
  );
}
