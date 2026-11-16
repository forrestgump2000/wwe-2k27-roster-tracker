"use client";
import Link from "next/link";
import { useCallback, useEffect, useMemo, useState, type CSSProperties } from "react";
import type { Wrestler } from "@/lib/wrestlers";
import type { Prediction, Report, RosterEntry } from "@/lib/store";
import { GAME_BY_CODE, MAINLINE } from "@/lib/games";
import { METHODS, OFFICIAL_METHODS, REPORT_REASONS, DISPUTE_AT } from "@/lib/meta";
import { appearance, ordinal, post, timeAgo } from "@/lib/client";
import { Backdrop, CardLogo, Render, renderCredit } from "./Render";
import { RatingChart } from "./RatingChart";
import { AddModal } from "./AddModal";
import { Toast } from "./Toast";
import { PhotoModal } from "./PhotoModal";
import { usePhotoOverride } from "@/lib/photoOverrides";
import { useSharedPhoto } from "@/lib/sharedPhotos";

type Detail = { entry: RosterEntry | null; preds: Prediction[]; reports: Report[] };

export function Profile({ w }: { w: Wrestler }) {
  const [d, setD] = useState<Detail | null>(null);
  const [tab, setTab] = useState<"overview" | "predictions" | "reports">("overview");
  const [adding, setAdding] = useState(false);
  const [photo, setPhoto] = useState(false);
  const custom = usePhotoOverride(w.slug);
  const shared = useSharedPhoto(w.slug);
  const [toast, setToast] = useState("");
  const clearToast = useCallback(() => setToast(""), []);

  const load = useCallback(async () => {
    const r = await fetch(`/api/wrestler/${w.slug}`, { cache: "no-store" });
    if (r.ok) setD(await r.json());
  }, [w.slug]);
  useEffect(() => { load(); }, [load]);

  const a = appearance(w);
  const predAvg = d?.preds.length ? d.preds.reduce((s, p) => s + p.rating, 0) / d.preds.length : undefined;
  const ratings = Object.values(w.ratings);
  const peak = ratings.length ? Math.max(...ratings) : null;
  const last = (() => { const k = Object.keys(w.ratings); return k.length ? { code: k[k.length - 1], v: w.ratings[k[k.length - 1]] } : null; })();
  const disputed = (d?.reports.length ?? 0) >= DISPUTE_AT;
  const method = METHODS.find((m) => m.id === d?.entry?.method);
  const official = d?.entry && OFFICIAL_METHODS.has(d.entry.method);

  return (
    <div className="wrap" style={{ "--c": w.color } as CSSProperties}>
      <Link href="/" className="back">← Back to roster</Link>
      <div className="prof">
        <div className="prof-side">
        <div className="card prof-card" style={{ "--c": w.color } as CSSProperties}>
          <Backdrop />
          <CardLogo />
          {predAvg != null && <div className="ovr"><b>{Math.round(predAvg)}</b><small>PRED</small></div>}
          <Render w={w} />
          <div className="bd-floor" />
          <div className="plate">
            <div className="nm">{w.name}</div>
            <div className="meta"><span className={`chip ${w.brand.replace(" ", "")}`}>{w.brand}</span><span className="chip">{w.div === "F" ? "Women's" : "Men's"} division</span></div>
          </div>
        </div>
        <button className="btn btn-ghost btn-sm photo-btn" onClick={() => setPhoto(true)}>📷 {custom ? "Change your photo" : "Change photo"}</button>
        </div>

        <div>
          {(() => { const c = renderCredit(w.slug); return custom ? <p className="credit" style={{ textAlign: "left", marginTop: 0 }}>Showing the photo saved on this device (only visible to you)</p> : shared ? <p className="credit" style={{ textAlign: "left", marginTop: 0 }}>Photo shared by {shared.by || "Anonymous"} · Credit: {shared.credit} · <button className="linkish" onClick={() => setTab("reports")}>Report photo</button></p> : c ? <p className="credit" style={{ textAlign: "left", marginTop: 0 }}>Render cut out from a photo by {c.author} · <a href={c.page} target="_blank" rel="noopener noreferrer">{c.license}, Wikimedia Commons</a></p> : null; })()}
          <h1 className="p-name">{w.name}</h1>
          <div className="p-chips">
            {!d ? <span className="chip">Loading…</span> : d.entry ? (
              disputed ? <span className="chip warn">⚑ Disputed by the community</span>
                : <span className={`chip ${official ? "ok" : "rumor"}`}>{official ? "✓ Confirmed for WWE 2K27" : "◉ Reported for WWE 2K27"}</span>
            ) : <span className="chip">Not on the 2K27 roster yet</span>}
            {w.hot && <span className="chip Legend">🔥 Highly speculated</span>}
            {w.custom && <span className="chip community">◆ Community-added superstar</span>}
          </div>

          {d && !d.entry && (
            <div className="panel" style={{ display: "flex", gap: 16, alignItems: "center", flexWrap: "wrap" }}>
              <div style={{ flex: 1, minWidth: 220 }}><b>Has {w.name} been confirmed?</b><div className="muted" style={{ fontSize: 14, marginTop: 4 }}>Add them with proof and they’ll appear on everyone’s roster.</div></div>
              <button className="btn btn-red" onClick={() => setAdding(true)}>＋ Add to roster</button>
            </div>
          )}
          {disputed && <div className="banner">⚑ <span>{d!.reports.length} people have reported this entry. Treat the confirmation with caution until a better source is added.</span></div>}

          <div className="ptabs" role="tablist">
            <button className={`ptab ${tab === "overview" ? "on" : ""}`} onClick={() => setTab("overview")}>Overview</button>
            <button className={`ptab ${tab === "predictions" ? "on" : ""}`} onClick={() => setTab("predictions")}>Predictions<em>{d?.preds.length ?? 0}</em></button>
            <button className={`ptab ${tab === "reports" ? "on" : ""}`} onClick={() => setTab("reports")}>Report<em>{d?.reports.length ?? 0}</em></button>
          </div>

          {tab === "overview" && (
            <>
              <div className="panel">
                <h3>Mainline appearance</h3>
                <div className="big-n">
                  <div className="num">{a.all}<sup>{ordinal(a.all)}</sup></div>
                  <p>
                    {w.custom ? <>{w.name} was added by the community, so there’s no verified game history on record — WWE 2K27 could be their <b>series debut</b>.</> : a.debut ? <>WWE 2K27 would be <b>{w.name}’s debut</b> in a mainline WWE game.</>
                      : <>WWE 2K27 would be <b>{w.name}’s {a.all}{ordinal(a.all)} mainline WWE game</b> — and their <b>{a.twoK}{ordinal(a.twoK)}</b> in the 2K era.</>}
                    {" "}They’ve appeared in <b>{w.mainline.length + w.spinoffs.length}</b> WWE games in total.
                  </p>
                </div>
                <div className="kpis">
                  <div className="kpi"><b>{peak ?? "—"}</b><span>Peak OVR</span></div>
                  <div className="kpi"><b>{last ? last.v : "—"}</b><span>{last ? `Last (${last.code})` : "Last OVR"}</span></div>
                  <div className="kpi"><b style={{ color: "var(--red2)" }}>{predAvg != null ? Math.round(predAvg) : "—"}</b><span>2K27 predicted</span></div>
                </div>
              </div>

              {d?.entry && (
                <div className="panel">
                  <h3>How they were confirmed</h3>
                  <div className="conf">
                    <div className={`ic ${official ? "" : "rumor"}`}>{method?.icon ?? "•"}</div>
                    <div style={{ minWidth: 0 }}>
                      <b>{method?.label ?? d.entry.method}</b>
                      <p>{d.entry.details}</p>
                      {d.entry.source && <a className="src" href={d.entry.source} target="_blank" rel="noopener noreferrer nofollow">{d.entry.source}</a>}
                      <div><small>Added by {d.entry.addedBy || "Anonymous"} · {timeAgo(d.entry.addedAt)}</small></div>
                    </div>
                  </div>
                </div>
              )}

              <div className="panel">
                <h3>Overall rating history {predAvg != null && <span style={{ color: "var(--red2)", letterSpacing: 1 }}>- - 2K27 prediction</span>}</h3>
                <RatingChart w={w} predicted={predAvg} />
                <p className="note">Ratings are launch overalls, compiled by the community and may be approximate. Spot a mistake? Use the Report tab.</p>
              </div>

              <Games w={w} />
            </>
          )}

          {tab === "predictions" && <Predictions w={w} preds={d?.preds ?? []} avg={predAvg} onDone={() => { load(); setToast("Prediction locked in!"); }} />}
          {tab === "reports" && <Reports w={w} reports={d?.reports ?? []} onDone={() => { load(); setToast("Thanks — report submitted."); }} />}
        </div>
      </div>
      {adding && <AddModal added={new Set()} initial={w} onClose={() => setAdding(false)} onAdded={() => { setAdding(false); load(); setToast(`${w.name} added to the roster!`); }} />}
      {photo && <PhotoModal w={w} onClose={() => setPhoto(false)} onSaved={(m) => { setPhoto(false); setToast(m); }} />}
      {toast && <Toast msg={toast} onDone={clearToast} />}
    </div>
  );
}

function Games({ w }: { w: Wrestler }) {
  const eras = useMemo(() => {
    const m = new Map<string, string[]>();
    for (const c of w.mainline) {
      const e = GAME_BY_CODE[c].era;
      m.set(e, [...(m.get(e) ?? []), c]);
    }
    return [...m.entries()];
  }, [w]);
  let n = 0;
  return (
    <div className="panel">
      <h3>Every game <span>{w.mainline.length + w.spinoffs.length} total</span></h3>
      <div className="games">
        {eras.map(([era, codes]) => (
          <div key={era} style={{ display: "contents" }}>
            <div className="era">{era} era</div>
            {codes.map((c) => {
              n++;
              const g = GAME_BY_CODE[c];
              return (
                <div className="game" key={c}>
                  <span className="no">{n}</span>
                  <span className="t">{g.title}</span>
                  <span className="y">{g.year}</span>
                  <span className="r">{w.ratings[c] ?? ""}</span>
                </div>
              );
            })}
          </div>
        ))}
        <div className="era">Up next</div>
        <div className="game next">
          <span className="no">{w.mainline.length + 1}</span>
          <span className="t"><b>WWE 2K27</b></span>
          <span className="y">2027</span>
          <span className="r">?</span>
        </div>
      </div>
      {w.spinoffs.length > 0 && (
        <>
          <div className="era" style={{ marginTop: 18 }}>Spin-offs & other WWE games</div>
          <div className="chips-wrap">
            {w.spinoffs.map((c) => GAME_BY_CODE[c]).sort((a, b) => a.year - b.year).map((g) => (
              <span className="gchip" key={g.code}>{g.title}<small>{g.year}</small></span>
            ))}
          </div>
        </>
      )}
      <p className="note">Mainline = the annual SmackDown! → SmackDown vs. Raw → WWE ’12/’13 → WWE 2K series ({MAINLINE.length} games). DLC, pre-order and unlockable characters count. Verified against full per-game rosters from TheSmackDownHotel and the Pro Wrestling & SmackDown fandom wikis.</p>
    </div>
  );
}

function Predictions({ w, preds, avg, onDone }: { w: Wrestler; preds: Prediction[]; avg?: number; onDone: () => void }) {
  const last = Object.values(w.ratings).pop() ?? 80;
  const [v, setV] = useState(last);
  const [by, setBy] = useState("");
  const [comment, setComment] = useState("");
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");
  useEffect(() => { try { setBy(localStorage.getItem("wwe-nick") ?? ""); } catch {} }, []);
  const bins = useMemo(() => {
    const b = [0, 0, 0, 0, 0, 0, 0, 0];
    for (const p of preds) b[Math.min(7, Math.max(0, Math.floor((p.rating - 60) / 5)))]++;
    return b;
  }, [preds]);
  const max = Math.max(1, ...bins);

  async function submit() {
    setBusy(true); setErr("");
    try { localStorage.setItem("wwe-nick", by); } catch {}
    const r = await post("/api/predict", { slug: w.slug, rating: v, by, comment });
    setBusy(false);
    if (!r.ok) return setErr(r.error ?? "Failed");
    setComment(""); onDone();
  }

  return (
    <>
      <div className="panel">
        <h3>Community prediction <span>Unofficial</span></h3>
        {preds.length ? (
          <div className="pred-hero">
            <div><div className="pred-avg">{avg!.toFixed(1)}</div><div className="muted" style={{ fontSize: 13 }}>avg of {preds.length} prediction{preds.length > 1 ? "s" : ""}</div></div>
            <div style={{ flex: 1, minWidth: 220 }}>
              <div className="hist">{bins.map((b, i) => <div key={i} style={{ height: `${(b / max) * 100}%` }} title={`${b}`} />)}</div>
              <div className="hist-x">{["<65", "65", "70", "75", "80", "85", "90", "95+"].map((l) => <span key={l}>{l}</span>)}</div>
            </div>
          </div>
        ) : <p className="muted" style={{ margin: 0 }}>No predictions yet. Be the first to call it.</p>}
      </div>
      <div className="panel">
        <h3>Drop your prediction</h3>
        <div className="slider-v">{v}</div>
        <input className="slider" type="range" min={60} max={99} value={v} onChange={(e) => setV(+e.target.value)} aria-label="Predicted overall" />
        <div className="row" style={{ justifyContent: "space-between", fontSize: 12, marginBottom: 14 }} ><span className="muted">60</span><span className="muted">{Object.keys(w.ratings).length ? `Last official: ${last}` : "No previous rating"}</span><span className="muted">99</span></div>
        <div className="field"><input className="inp" maxLength={30} placeholder="Your name (optional)" value={by} onChange={(e) => setBy(e.target.value)} /></div>
        <div className="field"><input className="inp" maxLength={200} placeholder="Why? (optional)" value={comment} onChange={(e) => setComment(e.target.value)} /></div>
        <div className="row">{err && <span className="err">{err}</span>}<span className="spacer" /><button className="btn btn-red" disabled={busy} onClick={submit}>{busy ? "Saving…" : "Lock in prediction"}</button></div>
      </div>
      {preds.length > 0 && (
        <div className="panel">
          <h3>Latest predictions</h3>
          <div className="feed">
            {preds.slice(0, 50).map((p, i) => (
              <div className="fi" key={i}><div className="n">{p.rating}</div><div style={{ minWidth: 0 }}><b>{p.by}</b> <small>· {timeAgo(p.at)}</small>{p.comment && <p>{p.comment}</p>}</div></div>
            ))}
          </div>
        </div>
      )}
    </>
  );
}

function Reports({ w, reports, onDone }: { w: Wrestler; reports: Report[]; onDone: () => void }) {
  const [reason, setReason] = useState("");
  const [details, setDetails] = useState("");
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");
  async function submit() {
    if (!reason) return setErr("Pick a reason");
    setBusy(true); setErr("");
    const r = await post("/api/report", { slug: w.slug, reason, details });
    setBusy(false);
    if (!r.ok) return setErr(r.error ?? "Failed");
    setReason(""); setDetails(""); onDone();
  }
  return (
    <>
      <div className="panel">
        <h3>Report {w.name}</h3>
        <p className="muted" style={{ marginTop: 0, fontSize: 14, lineHeight: 1.5 }}>
          Not actually confirmed, weak source, or wrong info? Entries with {DISPUTE_AT}+ reports get flagged as disputed for everyone.
        </p>
        <div className="methods" style={{ marginBottom: 14 }}>
          {REPORT_REASONS.map((r) => (
            <button key={r.id} className={`method ${reason === r.id ? "on" : ""}`} onClick={() => setReason(r.id)}><span>⚑</span>{r.label}</button>
          ))}
        </div>
        <div className="field"><textarea className="inp" maxLength={300} placeholder="Details (optional) — e.g. the trailer shows someone else" value={details} onChange={(e) => setDetails(e.target.value)} /></div>
        <div className="row">{err && <span className="err">{err}</span>}<span className="spacer" /><button className="btn btn-ghost" disabled={busy} onClick={submit}>{busy ? "Sending…" : "Submit report"}</button></div>
      </div>
      {reports.length > 0 && (
        <div className="panel">
          <h3>Reports</h3>
          <div className="feed">
            {reports.map((r, i) => (
              <div className="fi" key={i}><div className="n" style={{ color: "var(--red2)" }}>⚑</div><div style={{ minWidth: 0 }}><b>{REPORT_REASONS.find((x) => x.id === r.reason)?.label ?? r.reason}</b> <small>· {timeAgo(r.at)}</small>{r.details && <p>{r.details}</p>}</div></div>
            ))}
          </div>
        </div>
      )}
    </>
  );
}
