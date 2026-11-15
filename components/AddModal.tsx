"use client";
import { useEffect, useMemo, useState, type CSSProperties } from "react";
import { WRESTLERS, BRAND_ORDER, type Wrestler, type Brand } from "@/lib/wrestlers";
import { METHODS } from "@/lib/meta";
import { post } from "@/lib/client";
import { Photo } from "./Render";

export function AddModal({ added, onClose, onAdded, initial }: { added: Set<string>; onClose: () => void; onAdded: (w: Wrestler) => void; initial?: Wrestler }) {
  const [q, setQ] = useState("");
  const [brand, setBrand] = useState<Brand | "All" | "Hot">("All");
  const [sel, setSel] = useState<Wrestler | null>(initial ?? null);
  const [method, setMethod] = useState("");
  const [details, setDetails] = useState("");
  const [source, setSource] = useState("");
  const [name, setName] = useState("");
  const [err, setErr] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    try { setName(localStorage.getItem("wwe-nick") ?? ""); } catch {}
    const k = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", k);
    document.body.style.overflow = "hidden";
    return () => { window.removeEventListener("keydown", k); document.body.style.overflow = ""; };
  }, [onClose]);

  const list = useMemo(() => {
    const s = q.trim().toLowerCase();
    return WRESTLERS.filter((w) =>
      (brand === "All" || (brand === "Hot" ? w.hot : w.brand === brand)) && (!s || w.name.toLowerCase().includes(s))
    ).sort((a, b) => Number(added.has(a.slug)) - Number(added.has(b.slug)) || a.name.localeCompare(b.name));
  }, [q, brand, added]);

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
          <h2>{sel ? "Confirm superstar" : "Add to the roster"}</h2>
          <button className="x" onClick={onClose} aria-label="Close">✕</button>
        </div>

        {!sel ? (
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
          </div>
        ) : (
          <>
            <div className="modal-b">
              <div className="sel-head" style={{ "--c": sel.color } as CSSProperties}>
                <div className="av"><Photo w={sel} size={96} /></div>
                <div style={{ flex: 1 }}>
                  <b style={{ fontFamily: "var(--display)", fontSize: 26, fontWeight: 400, textTransform: "uppercase" }}>{sel.name}</b>
                  <div className="muted" style={{ fontSize: 13 }}>{sel.brand} · {sel.mainline.length} previous mainline games</div>
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
