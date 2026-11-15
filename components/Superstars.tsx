"use client";
import { useCallback, useMemo, useState } from "react";
import { type Wrestler } from "@/lib/wrestlers";
import { mergeWrestlers } from "@/lib/custom";
import { useSummary } from "@/lib/client";
import { Card } from "./Card";
import { AddModal } from "./AddModal";
import { Toast } from "./Toast";

const BRANDS = ["All", "Raw", "SmackDown", "NXT", "Free Agent", "Legend", "Alumni"] as const;
const STATUS = { all: "Everyone", on: "On 2K27 roster", off: "Not confirmed yet", hot: "🔥 Most speculated", community: "Community-added" } as const;
const SORTS = { az: "A–Z", games: "Most games", debut: "Series debuts first" } as const;

export function Superstars() {
  const { data, reload } = useSummary();
  const [brand, setBrand] = useState<(typeof BRANDS)[number]>("All");
  const [status, setStatus] = useState<keyof typeof STATUS>("all");
  const [div, setDiv] = useState<"all" | "M" | "F">("all");
  const [sort, setSort] = useState<keyof typeof SORTS>("az");
  const [q, setQ] = useState("");
  const [adding, setAdding] = useState(false);
  const [toast, setToast] = useState("");
  const clearToast = useCallback(() => setToast(""), []);

  const merged = useMemo(() => mergeWrestlers(data?.custom), [data]);
  const WRESTLERS = merged.all;
  const entries = useMemo(() => new Map((data?.roster ?? []).map((e) => [e.slug, e])), [data]);
  const added = useMemo(() => new Set(entries.keys()), [entries]);

  const list = useMemo(() => {
    const s = q.trim().toLowerCase();
    const out = WRESTLERS.filter((w) => {
      if (s && !w.name.toLowerCase().includes(s)) return false;
      if (brand !== "All" && w.brand !== brand) return false;
      if (div !== "all" && w.div !== div) return false;
      if (status === "on" && !entries.has(w.slug)) return false;
      if (status === "off" && entries.has(w.slug)) return false;
      if (status === "hot" && !w.hot) return false;
      if (status === "community" && !w.custom) return false;
      return true;
    });
    const games = (w: Wrestler) => w.mainline.length + w.spinoffs.length;
    if (sort === "games") out.sort((a, b) => games(b) - games(a) || a.name.localeCompare(b.name));
    else if (sort === "debut") out.sort((a, b) => a.mainline.length - b.mainline.length || a.name.localeCompare(b.name));
    else out.sort((a, b) => a.name.localeCompare(b.name));
    return out;
  }, [q, brand, div, status, sort, entries, WRESTLERS]);

  const count = (b: (typeof BRANDS)[number]) => (b === "All" ? WRESTLERS.length : WRESTLERS.filter((w) => w.brand === b).length);

  return (
    <>
      <section className="hero hero-sm">
        <div className="hero-bg2k" aria-hidden>ALL</div>
        <div className="wrap" style={{ position: "relative" }}>
          <div className="hero-kicker">The full database</div>
          <h1>Superstars</h1>
          <p>
            Every current WWE superstar from Raw, SmackDown and NXT, plus free agents, legends and alumni. {WRESTLERS.length} in total.
            Open any profile for their verified game history, or add them to the 2K27 roster once they’re confirmed.
          </p>
          <div className="stats">
            <div className="stat"><b>{WRESTLERS.length}</b><span>Superstars</span></div>
            <div className="stat" style={{ "--accent": "var(--green)" } as React.CSSProperties}><b>{data ? added.size : "–"}</b><span>On 2K27 roster</span></div>
            <div className="stat" style={{ "--accent": "var(--gold)" } as React.CSSProperties}><b>{WRESTLERS.filter((w) => w.brand === "Raw" || w.brand === "SmackDown" || w.brand === "NXT").length}</b><span>Current main roster & NXT</span></div>
            <div className="stat" style={{ "--accent": "#60a5fa" } as React.CSSProperties}><b>{WRESTLERS.filter((w) => w.mainline.length === 0).length}</b><span>No mainline games yet</span></div>
          </div>
        </div>
      </section>

      <section className="wrap">
        <div className="toolbar">
          <div className="tabs">
            {BRANDS.map((b) => (
              <button key={b} className={`tab ${brand === b ? "on" : ""}`} onClick={() => setBrand(b)}>
                {b === "Legend" ? "Legends" : b}<em>{count(b)}</em>
              </button>
            ))}
          </div>
        </div>
        <div className="toolbar" style={{ marginTop: -6 }}>
          <div className="row">
            <div className="search">
              <span>⌕</span>
              <input placeholder="Search superstars" value={q} onChange={(e) => setQ(e.target.value)} />
            </div>
            <select className="tab" value={status} onChange={(e) => setStatus(e.target.value as keyof typeof STATUS)} aria-label="Status">
              {Object.entries(STATUS).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
            </select>
            <select className="tab" value={div} onChange={(e) => setDiv(e.target.value as "all" | "M" | "F")} aria-label="Division">
              <option value="all">All divisions</option><option value="M">Men</option><option value="F">Women</option>
            </select>
            <select className="tab" value={sort} onChange={(e) => setSort(e.target.value as keyof typeof SORTS)} aria-label="Sort">
              {Object.entries(SORTS).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
            </select>
          </div>
          <div className="row">
            <span className="muted" style={{ fontSize: 13 }}>{list.length} shown</span>
            <button className="btn btn-red btn-sm" onClick={() => setAdding(true)}>＋ Add to roster</button>
          </div>
        </div>

        {list.length ? (
          <div className="grid">
            {list.map((w, i) => {
              const e = entries.get(w.slug);
              return <Card key={w.slug} w={w} method={e?.method} pred={data?.preds[w.slug]} reports={data?.reports[w.slug] ?? 0} i={i} />;
            })}
          </div>
        ) : (
          <div className="empty"><h3>No matches</h3><p>No superstars match those filters.</p></div>
        )}
      </section>

      {adding && (
        <AddModal added={added} extra={merged.extra} onCreated={reload} onClose={() => setAdding(false)}
          onAdded={(w) => { setAdding(false); setToast(`${w.name} is on the WWE 2K27 roster!`); reload(); }} />
      )}
      {toast && <Toast msg={toast} onDone={clearToast} />}
    </>
  );
}
