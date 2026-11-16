"use client";
/**
 * Personal photo overrides. Stored only in this browser (IndexedDB), never uploaded:
 * a custom photo changes what *you* see, not what other visitors see.
 */
import { useEffect, useState } from "react";

const DB = "wwe2k27-photos", STORE = "photos";
const cache = new Map<string, string>(); // slug -> object URL or remote URL
const listeners = new Set<() => void>();
let loaded: Promise<void> | null = null;

function open(): Promise<IDBDatabase> {
  return new Promise((res, rej) => {
    const r = indexedDB.open(DB, 1);
    r.onupgradeneeded = () => r.result.createObjectStore(STORE);
    r.onsuccess = () => res(r.result);
    r.onerror = () => rej(r.error);
  });
}

async function tx<T>(mode: IDBTransactionMode, fn: (s: IDBObjectStore) => IDBRequest<T>): Promise<T> {
  const db = await open();
  return new Promise((res, rej) => {
    const req = fn(db.transaction(STORE, mode).objectStore(STORE));
    req.onsuccess = () => res(req.result);
    req.onerror = () => rej(req.error);
  });
}

function load() {
  return (loaded ??= (async () => {
    try {
      const keys = (await tx("readonly", (s) => s.getAllKeys())) as string[];
      for (const k of keys) {
        const v = await tx<Blob | string>("readonly", (s) => s.get(k));
        if (v) cache.set(k, typeof v === "string" ? v : URL.createObjectURL(v));
      }
    } catch {
      /* private mode / storage blocked: overrides simply unavailable */
    }
    listeners.forEach((l) => l());
  })());
}

const emit = () => listeners.forEach((l) => l());

export function usePhotoOverride(slug: string) {
  const [, force] = useState(0);
  useEffect(() => {
    const l = () => force((n) => n + 1);
    listeners.add(l);
    load();
    return () => void listeners.delete(l);
  }, []);
  return cache.get(slug);
}

/** Downscales to max 640px tall and keeps transparency (WebP). */
export async function shrink(file: File): Promise<Blob> {
  const bmp = await createImageBitmap(file);
  const s = Math.min(1, 640 / bmp.height);
  const c = document.createElement("canvas");
  c.width = Math.round(bmp.width * s);
  c.height = Math.round(bmp.height * s);
  c.getContext("2d")!.drawImage(bmp, 0, 0, c.width, c.height);
  return new Promise((res, rej) => c.toBlob((b) => (b ? res(b) : rej(new Error("encode"))), "image/webp", 0.9));
}

export async function setPhotoFile(slug: string, file: File) {
  const blob = await shrink(file);
  await tx("readwrite", (s) => s.put(blob, slug));
  const old = cache.get(slug);
  if (old?.startsWith("blob:")) URL.revokeObjectURL(old);
  cache.set(slug, URL.createObjectURL(blob));
  emit();
}

export async function setPhotoUrl(slug: string, url: string) {
  await tx("readwrite", (s) => s.put(url, slug));
  cache.set(slug, url);
  emit();
}

export async function resetPhoto(slug: string) {
  await tx("readwrite", (s) => s.delete(slug));
  const old = cache.get(slug);
  if (old?.startsWith("blob:")) URL.revokeObjectURL(old);
  cache.delete(slug);
  emit();
}
