"use client";
import { useEffect, useRef, useState, type CSSProperties } from "react";
import type { Wrestler } from "@/lib/wrestlers";
import { resetPhoto, setPhotoFile, setPhotoUrl, shrink, usePhotoOverride } from "@/lib/photoOverrides";
import { refreshSharedPhotos, useSharedPhoto } from "@/lib/sharedPhotos";
import { Backdrop, CardLogo, Render } from "./Render";

type Mode = "share" | "me";

export function PhotoModal({ w, onClose, onSaved, publishDevice = false }: { w: Wrestler; onClose: () => void; onSaved: (msg: string) => void; publishDevice?: boolean }) {
  const custom = usePhotoOverride(w.slug);
  const shared = useSharedPhoto(w.slug);
  const [mode, setMode] = useState<Mode>("share");
  const [url, setUrl] = useState("");
  const [err, setErr] = useState("");
  const [busy, setBusy] = useState(false);
  // share-with-everyone form
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState("");
  const [credit, setCredit] = useState("");
  const [by, setBy] = useState("");
  const [rights, setRights] = useState(false);
  const [fromDevice, setFromDevice] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);
  const shareRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    try { setBy(localStorage.getItem("wwe-nick") ?? ""); } catch {}
    const k = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", k);
    document.body.style.overflow = "hidden";
    return () => { window.removeEventListener("keydown", k); document.body.style.overflow = ""; };
  }, [onClose]);
  useEffect(() => () => { if (preview) URL.revokeObjectURL(preview); }, [preview]);

  /** Loads the photo saved on this device into the share form so it can be made public. */
  async function useDevicePhoto() {
    if (!custom) return;
    setErr("");
    try {
      const r = await fetch(custom);
      if (!r.ok) throw new Error();
      const blob = await r.blob();
      if (!blob.type.startsWith("image/")) throw new Error();
      setFile(new File([blob], "device-photo", { type: blob.type }));
      setPreview(URL.createObjectURL(blob));
      setFromDevice(true);
    } catch {
      setErr(custom.startsWith("blob:")
        ? "Couldn’t read the photo saved on this device."
        : "Your device photo is a link to another site, which blocks copying it. Download the image and upload it with “Choose an image” instead.");
    }
  }
  const autoLoaded = useRef(false);
  useEffect(() => {
    if (publishDevice && custom && !autoLoaded.current) { autoLoaded.current = true; useDevicePhoto(); }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [publishDevice, custom]);

  async function run(fn: () => Promise<void>, msg: string) {
    setErr(""); setBusy(true);
    try { await fn(); onSaved(msg); } catch (e) { setErr(e instanceof Error && e.message ? e.message : "Couldn’t save that photo."); }
    setBusy(false);
  }

  async function share() {
    if (!file) return setErr("Choose an image to share");
    if (credit.trim().length < 2) return setErr("Add a photo credit");
    if (!rights) return setErr("Confirm you have the right to share this photo");
    await run(async () => {
      try { localStorage.setItem("wwe-nick", by); } catch {}
      const img = await shrink(file);
      const fd = new FormData();
      fd.set("slug", w.slug); fd.set("credit", credit.trim()); fd.set("by", by.trim()); fd.set("rights", "yes");
      fd.set("file", img, "photo.webp");
      const r = await fetch("/api/photos", { method: "POST", body: fd });
      if (!r.ok) throw new Error((await r.json().catch(() => ({}))).error ?? "Upload failed");
      await refreshSharedPhotos();
      // it's public now, so the private device copy is no longer needed
      if (fromDevice) await resetPhoto(w.slug);
    }, fromDevice ? "Your photo is now public for everyone" : custom ? "Shared! (Your device photo still shows for you — reset it to see the shared one)" : "Photo shared with everyone");
  }

  return (
    <div className="scrim" onMouseDown={(e) => e.target === e.currentTarget && onClose()}>
      <div className="modal sm" role="dialog" aria-modal="true" aria-label="Change photo">
        <div className="modal-h"><h2>Change photo</h2><button className="x" onClick={onClose} aria-label="Close">✕</button></div>
        <div className="modal-b">
          <div className="card" style={{ "--c": w.color, width: 150, margin: "0 auto 16px", aspectRatio: "3/4", animation: "none" } as CSSProperties}>
            <Backdrop /><CardLogo />
            {mode === "share" && preview ? (
              // eslint-disable-next-line @next/next/no-img-element
              <div className="render"><img src={preview} alt="Preview" /></div>
            ) : <Render w={w} />}
            <div className="bd-floor" />
          </div>
          <div className="seg" role="tablist">
            <button className={mode === "share" ? "on" : ""} onClick={() => { setMode("share"); setErr(""); }}>🌍 Share with everyone</button>
            <button className={mode === "me" ? "on" : ""} onClick={() => { setMode("me"); setErr(""); }}>📱 Just for me</button>
          </div>

          {mode === "share" ? (
            <>
              <p className="muted small-note">
                Becomes {w.name}’s photo for <b>every visitor</b>. Newest shared photo wins; photos reported 3+ times are hidden.
                {shared && <> Currently showing a photo shared by {shared.by || "Anonymous"}.</>}
              </p>
              <input ref={shareRef} type="file" accept="image/png,image/webp,image/jpeg" hidden
                onChange={(e) => { const f = e.target.files?.[0]; e.target.value = ""; if (f) { setFile(f); setPreview(URL.createObjectURL(f)); setFromDevice(false); setErr(""); } }} />
              {custom && (
                <button className={`btn ${fromDevice ? "btn-gold" : "btn-ghost"}`} style={{ width: "100%", marginBottom: 8 }} disabled={busy} onClick={useDevicePhoto}>
                  {fromDevice ? "✓ Using the photo saved on this device" : "📱 Make my device photo public"}
                </button>
              )}
              <button className="btn btn-ghost" style={{ width: "100%" }} disabled={busy} onClick={() => shareRef.current?.click()}>
                ⇪ {file && !fromDevice ? `Selected: ${file.name.slice(0, 28)}` : custom ? "…or choose a different image" : "Choose an image (transparent PNG looks best)"}
              </button>
              <div className="field" style={{ marginTop: 12 }}>
                <label>Photo credit <i>*</i></label>
                <input className="inp" maxLength={120} placeholder="Who took or made it — e.g. “My own photo” or “Jane Doe, CC BY 2.0”" value={credit} onChange={(e) => setCredit(e.target.value)} />
              </div>
              <div className="field">
                <label>Your name (optional)</label>
                <input className="inp" maxLength={30} placeholder="Anonymous" value={by} onChange={(e) => setBy(e.target.value)} />
              </div>
              <label className="check">
                <input type="checkbox" checked={rights} onChange={(e) => setRights(e.target.checked)} />
                <span>I have the right to share this photo publicly — it’s my own, freely licensed, or I have permission. I won’t upload images copied from WWE.com or other copyrighted sources.</span>
              </label>
            </>
          ) : (
            <>
              <p className="muted small-note">
                Saved <b>only on this device</b> and shown only to you. It overrides the shared photo for you until you reset it.
              </p>
              <input ref={fileRef} type="file" accept="image/png,image/webp,image/jpeg,image/gif" hidden
                onChange={(e) => { const f = e.target.files?.[0]; e.target.value = ""; if (f) run(() => setPhotoFile(w.slug, f), "Photo updated on this device"); }} />
              <button className="btn btn-ghost" style={{ width: "100%" }} disabled={busy} onClick={() => fileRef.current?.click()}>⇪ Upload an image</button>
              <div className="row" style={{ margin: "12px 0 0" }}>
                <input className="inp" style={{ flex: 1, minWidth: 0 }} type="url" placeholder="…or paste an image link" value={url} onChange={(e) => setUrl(e.target.value)} />
                <button className="btn btn-ghost" disabled={busy || !/^https?:\/\/\S+$/i.test(url.trim())}
                  onClick={() => run(() => setPhotoUrl(w.slug, url.trim()), "Photo updated on this device")}>Use</button>
              </div>
            </>
          )}
          {err && <p className="err" style={{ margin: "12px 0 0" }}>{err}</p>}
        </div>
        <div className="modal-f">
          {custom && <button className="btn btn-ghost" disabled={busy} style={{ marginRight: "auto" }} onClick={() => run(() => resetPhoto(w.slug), shared ? "Now showing the shared photo" : "Back to the default photo")}>Reset my device photo</button>}
          {mode === "share"
            ? <button className="btn btn-red" disabled={busy} onClick={share}>{busy ? "Sharing…" : "Share photo"}</button>
            : <button className="btn btn-ghost" onClick={onClose}>Done</button>}
        </div>
      </div>
    </div>
  );
}
