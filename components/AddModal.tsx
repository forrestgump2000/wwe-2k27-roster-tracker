"use client";
import { useEffect, useMemo, useState, type CSSProperties } from "react";
import { WRESTLERS, BRAND_ORDER, type Wrestler, type Brand } from "@/lib/wrestlers";
import { toWrestler } from "@/lib/custom";
import { METHODS } from "@/lib/meta";
import { post } from "@/lib/client";
import { Photo } from "./Render";

export function AddModal({ added, onClose, onAdded, initial, extra = [], onCreated }: { added: Set<string>; onClose: () => void; onAdded: (w: Wrestler) => void; initial?: Wrestler; extra?: Wrestler[]; onCreated?: () => void }) {
  const [q, setQ] = useState("");
  const [brand, setBrand] = useState<Brand | "All" | "Hot">("All");
  const [sel, setSel] = useState<Wrestler | null>(initial ?? null);
  const [method, setMethod] = useState("");
  const [details, setDetails] = useState("");
  const [source, setSource] = useState("");
  const [name, setName] = useState("");
  const [err, setErr] = useState("");
  const [busy, setBusy] = useState(false);
  const [creating, setCreating] = useState(false);
  const [newName, setNewName] = useState("");
  const [newBrand, setNewBrand] = useState<Brand | "">("");
  const [newDiv, setNewDiv] = useState<"M" | "F">("M");
  const pool = useMemo(() => [...WRESTLERS, ...extra], [extra]);

  useEffect(() => {
    try { setName(localStorage.getItem("wwe-nick") ?? ""); } catch {}
    const k = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", k);
    document.body.style.overflow = "hidden";
    return () => { window.removeEventListener("keydown", k); document.body.style.overflow = ""; };
  }, [onClose]);

  const list = useMemo(() => {
    const s = q.trim().toLowerCase();
    return pool.filter((w) =>
      (brand === "All" || (brand === "Hot" ? w.hot : w.brand === brand)) && (!s || w.name.toLowerCase().includes(s))
    ).sort((a, b) => Number(added.has(a.slug)) - Number(added.has(b.slug)) || a.name.localeCompare(b.name));
  }, [q, brand, added, pool]);

  async function create() {
    setErr("");
    if (newName.trim().length < 2) return setErr("Enter the superstar’s name");
    if (!newBrand) return setErr("Pick a brand");
    setBusy(true);
    try { localStorage.setItem("wwe-nick", name); } catch {}
    const r = await fetch("/api/superstar", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ name: newName, brand: newBrand, div: newDiv, addedBy: name }) });
    const j = await r.json().catch(() => ({}));
    setBusy(false);
    const existing = j.slug ? pool.find((w) => w.slug === j.slug) : undefined;
    if (!r.ok && !existing) return setErr(j.error ?? "Couldn’t create superstar");
    onCreated?.();
    setCreating(false);
    setSel(existing ?? toWrestler({ slug: j.slug, name: newName.trim(), brand: newBrand, div: newDiv, at: new Date().toISOString() }));
  }

  async function submit() {
    if (!sel) return;
    setErr("");
    if (!method) return setErr("Pick how they were confirmed");
    if (details.trim().length < 8) return setErr("Describe how they were confirmed");
    setBusy(true);
    try { localStorage.setItem("wwe-nick", name); } catch {}
    const r = await post("/api/roster", { slug: sel.slug, method, details, source, addedBy: name });
    setBusy(false);
    if (!r.ok) return setErr(r.error ?? "Failed");
    onAdded(sel);
  }

  return (
    <div className="scrim" onMouseDown={(e) => e.target === e.currentTarget && onClose()}>
      <div className="modal" role="dialog" aria-modal="true" aria-label="Add superstar">
        <div className="modal-h">
          <h2>{sel ? "Confirm superstar" : creating ? "New superstar" : "Add to the roster"}</h2>
          <button className="x" onClick={onClose} aria-label="Close">✕</button>
        </div>

        {!sel && creating ? (
          <>
            <div className="modal-b">
              <p className="muted" style={{ marginTop: 0, fontSize: 14, lineHeight: 1.5 }}>
                Add someone who isn’t in the database yet — a surprise signing, a new call-up, anyone. They’ll be added to the shared database for everyone,
                then you’ll confirm how they made the 2K27 roster.
              </p>
              <div className="field">
                <label>Ring name <i>*</i></label>
                <input className="inp" autoFocus maxLength={40} placeholder="e.g. Kenny Omega" value={newName} onChange={(e) => setNewName(e.target.value)} />
              </div>
              <div className="field">
                <label>Brand <i>*</i></label>
                <div className="tabs">
                  {BRAND_ORDER.map((b) => (
                    <button key={b} type="button" className={`tab ${newBrand === b ? "on" : ""}`} onClick={() => setNewBrand(b)}>{b}</button>
                  ))}
                </div>
              </div>
              <div className="field" style={{ marginBottom: 0 }}>
                <label>Division</label>
                <div className="tabs">
                  <button type="button" className={`tab ${newDiv === "M" ? "on" : ""}`} onClick={() => setNewDiv("M")}>Men’s</button>
                  <button type="button" className={`tab ${newDiv === "F" ? "on" : ""}`} onClick={() => setNewDiv("F")}>Women’s</button>
                </div>
              </div>
            </div>
            <div className="modal-f">
              {err && <span className="err">{err}</span>}
              <button className="btn btn-ghost" onClick={() => { setCreating(false); setErr(""); }}>Back</button>
              <button className="btn btn-red" disabled={busy} onClick={create}>{busy ? "Creating…" : "Next: confirm"}</button>
            </div>
          </>
        ) : !sel ? (
          <div className="modal-b">
            <div className="search" style={{ width: "100%" }}>
              <span>⌕</span>
              <input autoFocus placeholder={`Search ${WRESTLERS.length} superstars & legends…`} value={q} onChange={(e) => setQ(e.target.value)} />
            </div>
            <div className="tabs" style={{ marginTop: 12 }}>
              {(["All", "Hot", ...BRAND_ORDER] as const).map((b) => (
                <button key={b} className={`tab ${brand === b ? "on" : ""}`} onClick={() => setBrand(b)}>
                  {b === "Hot" ? "🔥 Most speculated" : b}
                </button>
              ))}
            </div>
            <div className="picker">
              {list.map((w) => {
                const on = added.has(w.slug);
                return (
                  <button key={w.slug} className={`pick ${on ? "added" : ""}`} disabled={on} onClick={() => setSel(w)} style={{ "--c": w.color } as CSSProperties}>
                    <div className="av"><Photo w={w} size={96} /></div>
                    <div><b>{w.name}</b><small>{on ? "On roster ✓" : w.brand}</small></div>
                    {w.hot && !on && <span className="tag">🔥</span>}
                  </button>
                );
              })}
              {!list.length && <p className="muted">No superstars match “{q}”.</p>}
            </div>
            <button className="create-new" onClick={() => { setCreating(true); setNewName(q.trim()); setErr(""); }}>
              <span>＋</span>
              <div><b>Can’t find them? Create a new superstar</b><small>Add someone who isn’t in the database yet</small></div>
            </button>
          </div>
        ) : (
          <>
            <div className="modal-b">
              <div className="sel-head" style={{ "--c": sel.color } as CSSProperties}>
                <div className="av"><Photo w={sel} size={96} /></div>
                <div style={{ flex: 1 }}>
                  <b style={{ fontFamily: "var(--display)", fontSize: 26, fontWeight: 400, textTransform: "uppercase" }}>{sel.name}</b>
                  <div className="muted" style={{ fontSize: 13 }}>{sel.brand} · {sel.custom ? "Community-added superstar" : `${sel.mainline.length} previous mainline games`}</div>
                </div>
                {!initial && <button className="btn btn-ghost btn-sm" onClick={() => setSel(null)}>Change</button>}
              </div>
              <div className="field">
                <label>How were they confirmed? <i>*</i></label>
                <div className="methods">
                  {METHODS.map((m) => (
                    <button key={m.id} type="button" className={`method ${method === m.id ? "on" : ""}`} onClick={() => setMethod(m.id)}>
                      <span>{m.icon}</span>{m.label}
                    </button>
                  ))}
                </div>
              </div>
              <div className="field">
                <label>Details <i>*</i></label>
                <textarea className="inp" maxLength={400} placeholder="e.g. Shown in the official WWE 2K27 roster reveal trailer at 0:42" value={details} onChange={(e) => setDetails(e.target.value)} />
              </div>
              <div className="field">
                <label>Source link</label>
                <input className="inp" type="url" placeholder="https://…" value={source} onChange={(e) => setSource(e.target.value)} />
              </div>
              <div className="field" style={{ marginBottom: 0 }}>
                <label>Your name (optional)</label>
                <input className="inp" maxLength={30} placeholder="Anonymous" value={name} onChange={(e) => setName(e.target.value)} />
              </div>
            </div>
            <div className="modal-f">
              {err && <span className="err">{err}</span>}
              <button className="btn btn-ghost" onClick={onClose}>Cancel</button>
              <button className="btn btn-red" disabled={busy} onClick={submit}>{busy ? "Adding…" : "Add to roster"}</button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
