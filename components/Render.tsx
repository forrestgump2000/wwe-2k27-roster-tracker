"use client";
import { useState } from "react";
import type { Wrestler } from "@/lib/wrestlers";
import RENDERS from "@/lib/renders.json";
import { usePhotoOverride } from "@/lib/photoOverrides";
import { useSharedPhoto } from "@/lib/sharedPhotos";

type Credit = { author: string; license: string; page: string };
export const renderCredit = (slug: string) => (RENDERS as Record<string, Credit>)[slug];

export function Silhouette({ w }: { w: Wrestler }) {
  const id = `g-${w.slug}`;
  const f = w.div === "F";
  return (
    <svg viewBox="0 0 300 360" aria-hidden>
      <defs>
        <linearGradient id={id} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#2a2a35" />
          <stop offset="1" stopColor="#050507" />
        </linearGradient>
        <linearGradient id={`${id}-r`} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor={w.color} stopOpacity=".9" />
          <stop offset=".5" stopColor="#fff" stopOpacity=".05" />
          <stop offset="1" stopColor={w.color} stopOpacity=".9" />
        </linearGradient>
      </defs>
      {f && (
        <path d="M98 112 C92 40 208 40 202 112 C206 172 218 224 228 268 L186 256 L172 204 L128 204 L114 256 L72 268 C82 224 94 172 98 112Z" fill={`url(#${id})`} stroke={`url(#${id}-r)`} strokeWidth="2" />
      )}
      <path
        d={f
          ? "M44 360 C48 300 72 266 112 254 C128 249 136 238 138 222 L138 204 L162 204 L162 222 C164 238 172 249 188 254 C228 266 252 300 256 360Z"
          : "M14 360 C20 288 48 256 100 242 C118 237 128 226 130 210 L130 192 L170 192 L170 210 C172 226 182 237 200 242 C252 256 280 288 286 360Z"}
        fill={`url(#${id})`} stroke={`url(#${id}-r)`} strokeWidth="2.5"
      />
      <ellipse cx="150" cy="118" rx={f ? 40 : 45} ry={f ? 50 : 55} fill={`url(#${id})`} stroke={`url(#${id}-r)`} strokeWidth="2.5" />
      <text x="150" y="315" textAnchor="middle" fontFamily="var(--display)" fontSize="64" fill="rgba(255,255,255,.08)">
        {w.name.split(" ").map((p) => p[0]).join("").slice(0, 3).toUpperCase()}
      </text>
    </svg>
  );
}

export function Photo({ w, className, size = 384 }: { w: Wrestler; className?: string; size?: 96 | 384 | 640 }) {
  const [failed, setFailed] = useState(false);
  // priority: photo saved on this device > photo shared with everyone > default render
  const custom = usePhotoOverride(w.slug);
  const shared = useSharedPhoto(w.slug);
  const [sharedFailed, setSharedFailed] = useState(false);
  if (custom) {
    // eslint-disable-next-line @next/next/no-img-element
    return <img className={className} src={custom} alt={w.name} />;
  }
  if (shared && !sharedFailed) {
    // eslint-disable-next-line @next/next/no-img-element
    return <img className={className} src={shared.url} alt={w.name} loading="lazy" onError={() => setSharedFailed(true)} />;
  }
  if (failed || !renderCredit(w.slug)) return <Silhouette w={w} />;
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img className={className} src={`/_next/image?url=${encodeURIComponent(`/renders/${w.slug}.png`)}&w=${size}&q=80`} alt={w.name} loading="lazy" onError={() => setFailed(true)} />
  );
}

export function Render({ w }: { w: Wrestler }) {
  return (
    <div className="render">
      <Photo w={w} />
    </div>
  );
}

export function Backdrop() {
  return (
    <div className="bd">
      <div className="bd-27">2K27</div>
    </div>
  );
}

export function CardLogo() {
  return (
    <div className="bd-logo">
      WWE <span>2K27</span>
    </div>
  );
}
