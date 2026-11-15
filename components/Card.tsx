import Link from "next/link";
import type { CSSProperties } from "react";
import type { Wrestler } from "@/lib/wrestlers";
import { OFFICIAL_METHODS, DISPUTE_AT } from "@/lib/meta";
import { appearance, ordinal } from "@/lib/client";
import { Backdrop, CardLogo, Render } from "./Render";

export function Card({ w, method, pred, reports, i = 0 }: { w: Wrestler; method?: string; pred?: { avg: number; count: number }; reports: number; i?: number }) {
  const a = appearance(w);
  const official = !!method && OFFICIAL_METHODS.has(method);
  return (
    <Link href={`/w/${w.slug}`} className="card" style={{ "--c": w.color, animationDelay: `${Math.min(i, 20) * 35}ms` } as CSSProperties}>
      <Backdrop />
      <CardLogo />
      <div className="app-n">{w.custom ? "◆ Community-added" : a.debut ? "★ Series debut" : `${a.all}${ordinal(a.all)} appearance`}</div>
      {pred && (
        <div className="ovr" title={`${pred.count} community predictions`}>
          <b>{Math.round(pred.avg)}</b>
          <small>PRED</small>
        </div>
      )}
      <Render w={w} />
      <div className="bd-floor" />
      <div className="plate">
        <div className="nm">{w.name}</div>
        <div className="meta">
          <span className={`chip ${w.brand.replace(" ", "")}`}>{w.brand}</span>
          {!method ? (
            <span className="chip dim">Not confirmed</span>
          ) : reports >= DISPUTE_AT ? (
            <span className="chip warn">⚑ Disputed</span>
          ) : (
            <span className={`chip ${official ? "ok" : "rumor"}`}>{official ? "✓ Confirmed" : "◉ Reported"}</span>
          )}
        </div>
      </div>
    </Link>
  );
}
