import { ImageResponse } from "next/og";
import { IconArt, anton } from "@/lib/art";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt = "WWE 2K27 Roster Tracker";

const CARDS = [
  { c: "#e5101e", r: -10, x: 0, y: 30 },
  { c: "#2563eb", r: 0, x: 120, y: 0 },
  { c: "#f3c74d", r: 10, x: 240, y: 30 },
];

export default async function OG() {
  return new ImageResponse(
    (
      <div style={{ width: 1200, height: 630, display: "flex", position: "relative", overflow: "hidden", fontFamily: "Anton",
        background: "radial-gradient(900px 500px at 10% 0%, rgba(229,16,30,.45), transparent 60%), radial-gradient(700px 500px at 100% 100%, rgba(243,199,77,.18), transparent 60%)", backgroundColor: "#060609" }}>
        <div style={{ position: "absolute", right: -40, top: -60, fontSize: 520, color: "rgba(255,255,255,.04)", display: "flex", lineHeight: 1 }}>2K27</div>
        <div style={{ display: "flex", flexDirection: "column", padding: "70px 0 0 72px", width: 700 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
            <div style={{ display: "flex", borderRadius: 18, overflow: "hidden" }}><IconArt s={84} /></div>
            <div style={{ display: "flex", fontSize: 26, color: "#f3c74d", letterSpacing: 6 }}>COMMUNITY ROSTER TRACKER</div>
          </div>
          <div style={{ display: "flex", fontSize: 150, color: "white", lineHeight: 0.95, marginTop: 34 }}>WWE <span style={{ color: "#ff2a36", marginLeft: 30 }}>2K27</span></div>
          <div style={{ display: "flex", fontSize: 150, color: "white", lineHeight: 0.95 }}>ROSTER</div>
          <div style={{ display: "flex", fontFamily: "sans-serif", fontSize: 28, color: "#a1a1ad", marginTop: 26, lineHeight: 1.4 }}>
            Confirmations · Rating history · Predictions
          </div>
        </div>
        <div style={{ position: "absolute", right: 70, top: 120, width: 420, height: 420, display: "flex" }}>
          {CARDS.map((k, i) => (
            <div key={i} style={{ position: "absolute", left: k.x, top: k.y, width: 190, height: 280, borderRadius: 22, transform: `rotate(${k.r}deg)`, display: "flex", flexDirection: "column", justifyContent: "flex-end", alignItems: "center", overflow: "hidden",
              border: "2px solid rgba(255,255,255,.18)", background: `radial-gradient(circle at 50% 35%, ${k.c}, #0a0a0f 70%)`, boxShadow: "0 30px 60px rgba(0,0,0,.6)" }}>
              <div style={{ position: "absolute", top: 12, left: 14, fontSize: 18, color: "white", display: "flex" }}>WWE <span style={{ color: "#ff3b47", marginLeft: 5 }}>2K27</span></div>
              <div style={{ width: 70, height: 84, borderRadius: 40, background: "#0b0b10", border: `3px solid ${k.c}`, display: "flex", marginBottom: -6 }} />
              <div style={{ width: 170, height: 96, borderRadius: "80px 80px 0 0", background: "#0b0b10", border: `3px solid ${k.c}`, display: "flex", marginBottom: -4 }} />
              <div style={{ position: "absolute", bottom: 14, fontSize: 30, color: "white", display: "flex" }}>???</div>
            </div>
          ))}
        </div>
      </div>
    ),
    { ...size, fonts: [{ name: "Anton", data: await anton() }] }
  );
}
