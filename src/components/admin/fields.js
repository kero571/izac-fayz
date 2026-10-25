"use client";
import { createContext, useContext, useState } from "react";
import { uploadToCloudinary } from "@/lib/cloudinaryUpload";
import { imageUrl, videoUrl } from "@/lib/media";

export const AdminCtx = createContext(null);
export const useAdmin = () => useContext(AdminCtx);

export const uid = () => Math.random().toString(36).slice(2, 9);
const toPath = (p) => (Array.isArray(p) ? p : String(p).split("."));
export const getIn = (obj, path) => toPath(path).reduce((o, k) => (o == null ? o : o[k]), obj);
export function setIn(obj, path, value) {
  const [k, ...rest] = toPath(path);
  const copy = Array.isArray(obj) ? [...obj] : { ...obj };
  copy[k] = rest.length ? setIn(obj?.[k] ?? {}, rest, value) : value;
  return copy;
}

const input = "w-full rounded-xl border bg-card px-3.5 py-2.5 text-sm text-ink placeholder:text-muted/60 focus:border-accent focus:outline-none";
const label = "mb-1.5 block text-xs font-semibold uppercase tracking-wider text-muted";

export function Field({ label: l, hint, children }) {
  return (
    <label className="block">
      <span className={label}>{l}</span>
      {children}
      {hint && <span className="mt-1.5 block text-xs text-muted">{hint}</span>}
    </label>
  );
}

export function Text({ path, label: l, area, hint, placeholder, number }) {
  const { get, set } = useAdmin();
  const v = get(path) ?? "";
  const on = (e) => set(path, number ? Number(e.target.value) || 0 : e.target.value);
  return (
    <Field label={l} hint={hint}>
      {area ? <textarea rows={4} className={input} value={v} onChange={on} placeholder={placeholder} /> : <input className={input} type={number ? "number" : "text"} value={v} onChange={on} placeholder={placeholder} />}
    </Field>
  );
}

/** One item per line ⇄ array of strings */
export function TextList({ path, label: l, hint }) {
  const { get, set } = useAdmin();
  const [raw, setRaw] = useState(null);
  const arr = get(path) || [];
  return (
    <Field label={l} hint={hint || "One per line"}>
      <textarea rows={4} className={input} value={raw ?? arr.join("\n")}
        onChange={(e) => { setRaw(e.target.value); set(path, e.target.value.split("\n").map((s) => s.trim()).filter(Boolean)); }}
        onBlur={() => setRaw(null)} />
    </Field>
  );
}

export function Toggle({ path, label: l, invert }) {
  const { get, set } = useAdmin();
  const on = Boolean(get(path)) !== Boolean(invert);
  return (
    <button type="button" role="switch" aria-checked={on} onClick={() => set(path, !get(path))} className="flex items-center gap-3 text-sm text-ink">
      <span className={`relative h-6 w-11 rounded-full transition-colors ${on ? "bg-accent" : "bg-line"}`}>
        <span className={`absolute top-0.5 h-5 w-5 rounded-full bg-white transition-all ${on ? "left-[22px]" : "left-0.5"}`} />
      </span>
      {l}
    </button>
  );
}

export function Select({ path, label: l, options }) {
  const { get, set } = useAdmin();
  return (
    <Field label={l}>
      <select className={input} value={get(path) ?? ""} onChange={(e) => set(path, e.target.value)}>
        {options.map((o) => { const [v, t] = Array.isArray(o) ? o : [o, o]; return <option key={v} value={v}>{t}</option>; })}
      </select>
    </Field>
  );
}

export function Color({ path, label: l }) {
  const { get, set } = useAdmin();
  const v = get(path) || "#000000";
  return (
    <Field label={l}>
      <div className="flex items-center gap-2">
        <input type="color" value={v} onChange={(e) => set(path, e.target.value)} className="h-11 w-14 cursor-pointer rounded-lg border bg-card p-1" />
        <input className={input} value={v} onChange={(e) => /^#[0-9a-f]{0,6}$/i.test(e.target.value) && set(path, e.target.value)} />
      </div>
    </Field>
  );
}

export function Btn({ children, variant = "ghost", ...p }) {
  const cls = variant === "primary" ? "bg-accent text-on-accent font-bold" : variant === "danger" ? "border text-red-400" : "border text-ink";
  return <button type="button" {...p} className={`rounded-xl px-4 py-2.5 text-sm transition-opacity disabled:opacity-40 ${cls} ${p.className || ""}`}>{children}</button>;
}

/** Upload to Cloudinary (or paste a local path such as /works/reel-1.mp4). Replacing/removing a Cloudinary file deletes it on save. */
export function Media({ path, label: l, kind = "image", folder, hint, accept: acceptProp }) {
  const { get, set, getToken, queueDelete } = useAdmin();
  const m = get(path);
  const [progress, setProgress] = useState(null);
  const [err, setErr] = useState("");
  const accept = acceptProp || (kind === "video" ? "video/*" : kind === "raw" ? "application/pdf" : "image/*");

  async function onFile(e) {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    setErr(""); setProgress(0);
    try {
      const media = await uploadToCloudinary({ file, resourceType: kind, folder, token: await getToken(), onProgress: setProgress });
      if (m?.provider === "cloudinary") queueDelete(m, kind);
      set(path, media);
    } catch (x) { setErr(x.message); }
    setProgress(null);
  }
  function remove() {
    if (m?.provider === "cloudinary") queueDelete(m, kind);
    set(path, null);
  }

  return (
    <div>
      <span className={label}>{l}</span>
      <div className="rounded-xl border bg-card p-3">
        {m?.url && (
          <div className="mb-3">
            {kind === "image" && /* eslint-disable-next-line @next/next/no-img-element */ <img src={imageUrl(m, 320)} alt="" className="max-h-44 rounded-lg" />}
            {kind === "video" && <video src={videoUrl(m)} controls preload="metadata" className="max-h-56 rounded-lg" />}
            {kind === "raw" && <a href={m.url} target="_blank" rel="noopener noreferrer" className="text-sm text-accent underline">{m.url}</a>}
            <p className="mt-1.5 text-xs text-muted">{m.provider === "cloudinary" ? "Stored on Cloudinary" : "File from the project (/public)"}</p>
          </div>
        )}
        <div className="flex flex-wrap items-center gap-2">
          <label className={`cursor-pointer rounded-xl border px-4 py-2.5 text-sm text-ink ${progress !== null ? "pointer-events-none opacity-50" : ""}`}>
            {progress !== null ? `Uploading… ${progress}%` : m?.url ? "Replace file" : "Upload file"}
            <input type="file" accept={accept} className="sr-only" onChange={onFile} />
          </label>
          {m?.url && <Btn variant="danger" onClick={remove}>Remove</Btn>}
        </div>
        <input className={`${input} mt-3`} placeholder="…or paste a file path / URL, e.g. /works/reel-1.mp4"
          value={m?.provider === "local" ? m.url : ""} onChange={(e) => set(path, e.target.value ? { provider: "local", url: e.target.value } : null)} />
        {hint && <p className="mt-2 text-xs text-muted">{hint}</p>}
        {err && <p className="mt-2 text-sm text-red-400">{err}</p>}
      </div>
    </div>
  );
}

/** Upload many files at once and add one list item per file. */
export function BulkUpload({ path, kind = "image", folder, make, text = "Upload several files" }) {
  const { get, set, getToken } = useAdmin();
  const [status, setStatus] = useState("");
  async function onFiles(e) {
    const files = [...(e.target.files || [])];
    e.target.value = "";
    let items = get(path) || [];
    for (const [i, file] of files.entries()) {
      try {
        setStatus(`Uploading ${i + 1}/${files.length}…`);
        const media = await uploadToCloudinary({ file, resourceType: kind, folder, token: await getToken() });
        items = [...items, make(media, file)];
        set(path, items);
      } catch (x) { setStatus(`Failed: ${x.message}`); return; }
    }
    setStatus("");
  }
  return (
    <label className="inline-block cursor-pointer rounded-xl bg-accent px-4 py-2.5 text-sm font-bold text-on-accent">
      {status || text}
      <input type="file" multiple accept={kind === "video" ? "video/*" : "image/*"} className="sr-only" onChange={onFiles} />
    </label>
  );
}

/** Editable list: add / remove / reorder. render(item, itemPath, index) draws the fields. */
export function ListEditor({ path, newItem, title, render, addLabel = "Add item", extra, onRemove }) {
  const { get, set } = useAdmin();
  const items = get(path) || [];
  const move = (i, d) => { const a = [...items]; const j = i + d; if (j < 0 || j >= a.length) return; [a[i], a[j]] = [a[j], a[i]]; set(path, a); };
  return (
    <div className="space-y-3">
      {items.map((it, i) => (
        <details key={it.id || i} className="rounded-2xl border bg-card/60">
          <summary className="flex cursor-pointer items-center justify-between gap-3 px-4 py-3 text-sm font-semibold text-ink">
            <span className="truncate">{i + 1}. {title(it) || "(untitled)"}</span>
            <span className="flex shrink-0 gap-1.5" onClick={(e) => e.preventDefault()}>
              <Btn onClick={() => move(i, -1)} aria-label="Move up" className="!px-2.5 !py-1">↑</Btn>
              <Btn onClick={() => move(i, 1)} aria-label="Move down" className="!px-2.5 !py-1">↓</Btn>
              <Btn variant="danger" className="!px-2.5 !py-1" onClick={() => { if (confirm("Delete this item?")) { onRemove?.(it); set(path, items.filter((_, k) => k !== i)); } }}>Delete</Btn>
            </span>
          </summary>
          <div className="grid gap-4 border-t p-4">{render(it, `${Array.isArray(path) ? path.join(".") : path}.${i}`, i)}</div>
        </details>
      ))}
      <div className="flex flex-wrap items-center gap-3">
        <Btn variant="primary" onClick={() => set(path, [...items, newItem()])}>+ {addLabel}</Btn>
        {extra}
      </div>
    </div>
  );
}

export function Card({ title, children, hint }) {
  return (
    <section className="rounded-3xl border bg-alt p-5 md:p-6">
      <h2 className="text-lg font-bold text-ink">{title}</h2>
      {hint && <p className="mt-1 text-sm text-muted">{hint}</p>}
      <div className="mt-5 grid gap-4">{children}</div>
    </section>
  );
}
