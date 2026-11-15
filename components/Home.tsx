"use client";
import { useCallback, useMemo, useState, type CSSProperties } from "react";
import { BY_SLUG, WRESTLERS, type Wrestler } from "@/lib/wrestlers";
import { OFFICIAL_METHODS } from "@/lib/meta";
import { appearance, useSummary } from "@/lib/client";
import { Card } from "./Card";
import { AddModal } from "./AddModal";
import { Toast } from "./Toast";

const FILTERS = ["All", "Men", "Women", "Raw", "SmackDown", "NXT", "Free Agent", "Legend", "Alumni"] as const;
type F = (typeof FILTERS)[number];
const SORTS = { recent: "Newest", az: "A–Z", pred: "Top predicted" } as const;

export function Home() {
  const { data, error, reload } = useSummary();
  const [open, setOpen] = useState(false);
  const [filter, setFilter] = useState<F>("All");
  const [sort, setSort] = useState<keyof typeof SORTS>("recent");
  const [q, setQ] = useState("");
  const [toast, setToast] = useState("");
  const clearToast = useCallback(() => setToast(""), []);

  const roster = useMemo(
    () => (data?.roster ?? []).map((e) => ({ e, w: BY_SLUG[e.slug] })).filter((x): x is { e: typeof x.e; w: Wrestler } => !!x.w),
    [data]
  );
  const added = useMemo(() => new Set(roster.map((r) => r.w.slug)), [roster]);

  const shown = useMemo(() => {
    const s = q.trim().toLowerCase();
    const list = roster.filter(({ w }) => {
      if (s && !w.name.toLowerCase().includes(s)) return false;
      if (filter === "All") return true;
      if (filter === "Men") return w.div === "M";
      if (filter === "Women") return w.div === "F";
      return w.brand === filter;
    });
    const p = (slug: string) => data?.preds[slug]?.avg ?? 0;
    if (sort === "az") list.sort((a, b) => a.w.name.localeCompare(b.w.name));
    else if (sort === "pred") list.sort((a, b) => p(b.w.slug) - p(a.w.slug));
    else list.sort((a, b) => b.e.addedAt.localeCompare(a.e.addedAt));
    return list;
  }, [roster, filter, sort, q, data]);

  const count = (f: F) =>
    roster.filter(({ w }) => (f === "All" ? true : f === "Men" ? w.div === "M" : f === "Women" ? w.div === "F" : w.brand === f)).length;

  const official = roster.filter((r) => OFFICIAL_METHODS.has(r.e.method)).length;
  const debuts = roster.filter((r) => appearance(r.w).debut).length;
  const legends = roster.filter((r) => r.w.brand === "Legend" || r.w.brand === "Alumni").length;

  return (
    <>
      <section className="hero">
        <div className="hero-bg2k" aria-hidden>2K27</div>
        <div className="wrap" style={{ position: "relative" }}>
          <div className="hero-kicker">Community roster tracker</div>
          <h1>
            <span className="outline">WWE</span> <span className="red">2K27</span>
            <br />Roster
          </h1>
          <p>
            Every confirmed superstar, the moment they’re revealed. Add who’s in, show your proof, predict their ratings,
            and call out anything that isn’t legit — one shared roster for everyone.
          </p>
          <div className="hero-cta">
            <button className="btn btn-red" onClick={() => setOpen(true)}>＋ Add a superstar</button>
            <a className="btn btn-ghost" href="#roster">View roster ↓</a>
          </div>
          <div className="stats">
            <div className="stat"><b>{data ? roster.length : "–"}</b><span>On the roster</span></div>
            <div className="stat" style={{ "--accent": "var(--green)" } as CSSProperties}><b>{data ? official : "–"}</b><span>Officially confirmed</span></div>
            <div className="stat" style={{ "--accent": "var(--gold)" } as CSSProperties}><b>{data ? legends : "–"}</b><span>Legends & returns</span></div>
            <div className="stat" style={{ "--accent": "#60a5fa" } as CSSProperties}><b>{data ? debuts : "–"}</b><span>Series debuts</span></div>
          </div>
        </div>
      </section>

      <section className="wrap" id="roster">
        <div className="toolbar">
          <div className="tabs">
            {FILTERS.map((f) => (
              <button key={f} className={`tab ${filter === f ? "on" : ""}`} onClick={() => setFilter(f)}>
                {f === "Legend" ? "Legends" : f}<em>{count(f)}</em>
              </button>
            ))}
          </div>
          <div className="row">
            <div className="search">
              <span>⌕</span>
              <input placeholder="Search roster" value={q} onChange={(e) => setQ(e.target.value)} />
            </div>
            <select className="tab" value={sort} onChange={(e) => setSort(e.target.value as keyof typeof SORTS)} aria-label="Sort">
              {Object.entries(SORTS).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
            </select>
          </div>
        </div>

        {!data && !error && (
          <div className="grid">{Array.from({ length: 8 }).map((_, i) => <div key={i} className="skel" />)}</div>
        )}
        {error && !data && <div className="empty"><h3>Can’t reach the roster</h3><p>Check your connection and try again.</p><button className="btn btn-ghost" onClick={reload}>Retry</button></div>}

        {data && roster.length === 0 && (
          <div className="empty">
            <div className="ghosts"><div>?</div><div>?</div><div>?</div></div>
            <h3>The roster is empty</h3>
            <p>Nobody’s been confirmed yet. Be the first to add a superstar from our database of {WRESTLERS.length} current stars and legends.</p>
            <button className="btn btn-red" onClick={() => setOpen(true)}>＋ Add the first superstar</button>
          </div>
        )}

        {data && roster.length > 0 && shown.length === 0 && (
          <div className="empty"><h3>No matches</h3><p>Nobody on the roster matches that filter yet.</p></div>
        )}

        {shown.length > 0 && (
          <div className="grid">
            {shown.map(({ w, e }, i) => (
              <Card key={w.slug} w={w} method={e.method} pred={data?.preds[w.slug]} reports={data?.reports[w.slug] ?? 0} i={i} />
            ))}
          </div>
        )}
      </section>

      {open && (
        <AddModal
          added={added}
          onClose={() => setOpen(false)}
          onAdded={(w) => { setOpen(false); setToast(`${w.name} is on the WWE 2K27 roster!`); reload(); }}
        />
      )}
      {toast && <Toast msg={toast} onDone={clearToast} />}
    </>
  );
}
