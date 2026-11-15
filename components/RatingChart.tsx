import { RATED } from "@/lib/games";
import type { Wrestler } from "@/lib/wrestlers";

export function RatingChart({ w, predicted }: { w: Wrestler; predicted?: number }) {
  const slots = [...RATED, "2K27"];
  const vals: (number | null)[] = slots.map((c) => (c === "2K27" ? null : w.ratings[c] ?? null));
  const nums = vals.filter((v): v is number => v != null);
  if (!nums.length) return <p className="muted" style={{ margin: 0 }}>No rated 2K appearances yet — WWE 2K27 would be their first rating.</p>;
  const all = predicted ? [...nums, predicted] : nums;
  const lo = Math.max(40, Math.floor((Math.min(...all) - 4) / 5) * 5);
  const hi = Math.min(100, Math.ceil((Math.max(...all) + 2) / 5) * 5);
  const W = 640, H = 240, pl = 34, pr = 14, pt = 20, pb = 34;
  const x = (i: number) => pl + (i * (W - pl - pr)) / (slots.length - 1);
  const y = (v: number) => pt + ((hi - v) * (H - pt - pb)) / (hi - lo || 1);

  // split into contiguous segments so missing games show as gaps
  const segs: { i: number; v: number }[][] = [];
  let cur: { i: number; v: number }[] = [];
  vals.forEach((v, i) => {
    if (v == null) { if (cur.length) segs.push(cur); cur = []; } else cur.push({ i, v });
  });
  if (cur.length) segs.push(cur);
  const lastIdx = vals.map((v, i) => (v != null ? i : -1)).filter((i) => i >= 0).pop()!;
  const ticks = [];
  for (let t = lo; t <= hi; t += 5) ticks.push(t);
  const c = w.color;

  return (
    <svg className="chart" viewBox={`0 0 ${W} ${H}`} role="img" aria-label={`${w.name} overall ratings by game`}>
      <defs>
        <linearGradient id="area" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={c} stopOpacity=".45" />
          <stop offset="1" stopColor={c} stopOpacity="0" />
        </linearGradient>
      </defs>
      {ticks.map((t) => (
        <g key={t}>
          <line x1={pl} x2={W - pr} y1={y(t)} y2={y(t)} stroke="rgba(255,255,255,.07)" />
          <text x={pl - 8} y={y(t) + 4} textAnchor="end" fontSize="11" fill="#63636f">{t}</text>
        </g>
      ))}
      {slots.map((s, i) => (
        <text key={s} x={x(i)} y={H - 10} textAnchor="middle" fontSize="10.5" fill={s === "2K27" ? "#ff3b47" : "#7a7a88"} fontWeight={s === "2K27" ? 800 : 500}>
          {s.replace("2K", "'")}
        </text>
      ))}
      {segs.map((sg, k) => (
        <g key={k}>
          {sg.length > 1 && (
            <path d={`M${sg.map((p) => `${x(p.i)},${y(p.v)}`).join(" L")} L${x(sg[sg.length - 1].i)},${H - pb} L${x(sg[0].i)},${H - pb}Z`} fill="url(#area)" />
          )}
          <path d={`M${sg.map((p) => `${x(p.i)},${y(p.v)}`).join(" L")}`} fill="none" stroke={c} strokeWidth="3" strokeLinejoin="round" strokeLinecap="round" style={{ filter: `drop-shadow(0 0 6px ${c})` }} />
        </g>
      ))}
      {predicted != null && (
        <path d={`M${x(lastIdx)},${y(vals[lastIdx]!)} L${x(slots.length - 1)},${y(predicted)}`} stroke="#ff3b47" strokeWidth="2.5" strokeDasharray="5 6" fill="none" />
      )}
      {vals.map((v, i) =>
        v == null ? null : (
          <g key={i}>
            <circle cx={x(i)} cy={y(v)} r="5" fill="#0b0b10" stroke={c} strokeWidth="2.5" />
            <text x={x(i)} y={y(v) - 11} textAnchor="middle" fontSize="11.5" fontWeight="700" fill="#e7e7ee">{v}</text>
          </g>
        )
      )}
      {predicted != null && (
        <g>
          <circle cx={x(slots.length - 1)} cy={y(predicted)} r="6.5" fill="#ff3b47" />
          <text x={x(slots.length - 1)} y={y(predicted) - 12} textAnchor="middle" fontSize="12" fontWeight="800" fill="#ff8a92">{Math.round(predicted)}?</text>
        </g>
      )}
    </svg>
  );
}
