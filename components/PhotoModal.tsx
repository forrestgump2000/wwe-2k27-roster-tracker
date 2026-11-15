"use client";
import { useEffect, useRef, useState, type CSSProperties } from "react";
import type { Wrestler } from "@/lib/wrestlers";
import { resetPhoto, setPhotoFile, setPhotoUrl, usePhotoOverride } from "@/lib/photoOverrides";
import { Backdrop, CardLogo, Render } from "./Render";

export function PhotoModal({ w, onClose, onSaved }: { w: Wrestler; onClose: () => void; onSaved: (msg: string) => void }) {
  const custom = usePhotoOverride(w.slug);
  const [url, setUrl] = useState("");
  const [err, setErr] = useState("");
  const [busy, setBusy] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const k = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", k);
    document.body.style.overflow = "hidden";
    return () => { window.removeEventListener("keydown", k); document.body.style.overflow = ""; };
  }, [onClose]);

  async function run(fn: () => Promise<void>, msg: string) {
    setErr(""); setBusy(true);
    try { await fn(); onSaved(msg); } catch { setErr("Couldn’t save that photo here — your browser may be blocking storage."); }
    setBusy(false);
  }

  return (
    <div className="scrim" onMouseDown={(e) => e.target === e.currentTarget && onClose()}>
      <div className="modal sm" role="dialog" aria-modal="true" aria-label="Change photo">
        <div className="modal-h"><h2>Change photo</h2><button className="x" onClick={onClose} aria-label="Close">✕</button></div>
        <div className="modal-b">
          <div className="card" style={{ "--c": w.color, width: 170, margin: "0 auto 16px", aspectRatio: "3/4", animation: "none" } as CSSProperties}>
            <Backdrop /><CardLogo /><Render w={w} /><div className="bd-floor" />
          </div>
          <p className="muted" style={{ fontSize: 13.5, lineHeight: 1.5, marginTop: 0 }}>
            Your photo is saved <b style={{ color: "var(--text)" }}>only on this device</b> and shows only for you — it isn’t uploaded or shown to other visitors.
            Transparent PNGs look best.
          </p>
          <input ref={fileRef} type="file" accept="image/png,image/webp,image/jpeg,image/gif" hidden
            onChange={(e) => { const f = e.target.files?.[0]; e.target.value = ""; if (f) run(() => setPhotoFile(w.slug, f), "Photo updated on this device"); }} />
          <button className="btn btn-red" style={{ width: "100%" }} disabled={busy} onClick={() => fileRef.current?.click()}>⇪ Upload an image</button>
          <div className="row" style={{ margin: "12px 0" }}>
            <input className="inp" style={{ flex: 1, minWidth: 0 }} type="url" placeholder="…or paste an image link" value={url} onChange={(e) => setUrl(e.target.value)} />
            <button className="btn btn-ghost" disabled={busy || !/^https?:\/\/\S+$/i.test(url.trim())}
              onClick={() => run(() => setPhotoUrl(w.slug, url.trim()), "Photo updated on this device")}>Use</button>
          </div>
          {err && <p className="err" style={{ margin: 0 }}>{err}</p>}
        </div>
        <div className="modal-f">
          {custom && <button className="btn btn-ghost" disabled={busy} style={{ marginRight: "auto" }} onClick={() => run(() => resetPhoto(w.slug), "Back to the default photo")}>Reset to default</button>}
          <button className="btn btn-ghost" onClick={onClose}>Done</button>
        </div>
      </div>
    </div>
  );
}
