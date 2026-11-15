"use client";
import { useCallback, useEffect, useState } from "react";
import type { Summary } from "./store";
import type { Wrestler } from "./wrestlers";
import { MAINLINE } from "./games";

export function useSummary(pollMs = 20000) {
  const [data, setData] = useState<Summary | null>(null);
  const [error, setError] = useState(false);
  const load = useCallback(async () => {
    try {
      const r = await fetch("/api/roster", { cache: "no-store" });
      if (!r.ok) throw new Error();
      setData(await r.json());
      setError(false);
    } catch {
      setError(true);
    }
  }, []);
  useEffect(() => {
    load();
    const t = setInterval(load, pollMs);
    const onFocus = () => load();
    window.addEventListener("focus", onFocus);
    return () => {
      clearInterval(t);
      window.removeEventListener("focus", onFocus);
    };
  }, [load, pollMs]);
  return { data, error, reload: load };
}

export async function post(url: string, body: unknown): Promise<{ ok: boolean; error?: string }> {
  try {
    const r = await fetch(url, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
    const j = await r.json().catch(() => ({}));
    return r.ok ? { ok: true } : { ok: false, error: j.error ?? "Something went wrong" };
  } catch {
    return { ok: false, error: "Network error — try again" };
  }
}

export const ordinal = (n: number) => {
  const s = ["th", "st", "nd", "rd"], v = n % 100;
  return s[(v - 20) % 10] || s[v] || s[0];
};

export function appearance(w: Wrestler) {
  const all = w.mainline.length + 1;
  const twoK = w.mainline.filter((c) => MAINLINE.find((g) => g.code === c)?.era === "2K").length + 1;
  return { all, twoK, debut: all === 1 };
}

export function timeAgo(iso: string) {
  const s = (Date.now() - new Date(iso).getTime()) / 1000;
  if (s < 60) return "just now";
  const m = s / 60; if (m < 60) return `${Math.floor(m)}m ago`;
  const h = m / 60; if (h < 24) return `${Math.floor(h)}h ago`;
  const d = h / 24; if (d < 30) return `${Math.floor(d)}d ago`;
  return new Date(iso).toLocaleDateString();
}
