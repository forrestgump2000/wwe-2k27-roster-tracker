"use client";
/** Community photos shared with everyone. Loaded once per page and refreshed every minute. */
import { useEffect, useState } from "react";
import type { SharedPhoto } from "./store";

let photos: Record<string, SharedPhoto> = {};
let started = false;
const listeners = new Set<() => void>();

export async function refreshSharedPhotos() {
  try {
    const r = await fetch("/api/photos", { cache: "no-store" });
    if (r.ok) {
      photos = await r.json();
      listeners.forEach((l) => l());
    }
  } catch {
    /* offline: keep what we have */
  }
}

export function useSharedPhoto(slug: string): SharedPhoto | undefined {
  const [, force] = useState(0);
  useEffect(() => {
    const l = () => force((n) => n + 1);
    listeners.add(l);
    if (!started) {
      started = true;
      refreshSharedPhotos();
      setInterval(refreshSharedPhotos, 60000);
    }
    return () => void listeners.delete(l);
  }, []);
  return photos[slug];
}
