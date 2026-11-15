import { readFile } from "node:fs/promises";
import { join } from "node:path";

export const anton = () => readFile(join(process.cwd(), "assets/Anton-Regular.ttf"));

/** App icon artwork, scales with `s` (px). */
export function IconArt({ s }: { s: number }) {
  const tiny = s < 64;
  return (
    <div
      style={{
        width: s, height: s, display: "flex", alignItems: "center", justifyContent: "center", position: "relative", overflow: "hidden",
        borderRadius: tiny ? s * 0.2 : 0,
        background: "radial-gradient(circle at 50% 30%, #6b0007 0%, #1a0003 55%, #050507 100%)",
        fontFamily: "Anton",
      }}
    >
      <div style={{ position: "absolute", left: -s * 0.2, top: s * 0.5, width: s * 1.6, height: s * 0.16, background: "#e5101e", transform: "rotate(-24deg)", opacity: 0.85, display: "flex" }} />
      <div style={{ position: "absolute", left: -s * 0.2, top: s * 0.68, width: s * 1.6, height: s * 0.04, background: "#f3c74d", transform: "rotate(-24deg)", opacity: 0.9, display: "flex" }} />
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", lineHeight: 1 }}>
        {!tiny && <div style={{ fontSize: s * 0.13, color: "#ffffff", letterSpacing: s * 0.01, display: "flex" }}>WWE 2K</div>}
        <div style={{ fontSize: tiny ? s * 0.78 : s * 0.56, color: "#ffffff", marginTop: tiny ? 0 : -s * 0.02, textShadow: `0 ${s * 0.02}px ${s * 0.06}px rgba(0,0,0,.8)`, display: "flex" }}>27</div>
        {!tiny && <div style={{ fontSize: s * 0.09, color: "#f3c74d", letterSpacing: s * 0.02, marginTop: s * 0.01, display: "flex" }}>ROSTER</div>}
      </div>
    </div>
  );
}
