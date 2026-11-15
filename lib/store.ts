import "server-only";
import { list, put } from "@vercel/blob";

/**
 * Shared community database.
 *
 * Production: Vercel Blob. Every write is a new immutable JSON file, so there is
 * never a read-modify-write race. Small facts (rating, report reason) are also
 * encoded in the pathname so the home page can aggregate from a single listing.
 *
 *   roster/{slug}/{ts}.json            – confirmation entry (earliest wins)
 *   preds/{slug}/{rating}_{ts}.json    – rating prediction
 *   reports/{slug}/{reason}_{ts}.json  – report
 *
 * Local dev without BLOB_READ_WRITE_TOKEN: in-memory store.
 */

export type RosterEntry = {
  slug: string;
  method: string;
  details: string;
  source?: string;
  addedBy?: string;
  addedAt: string;
};
export type Prediction = { slug: string; rating: number; by: string; comment?: string; at: string };
export type Report = { slug: string; reason: string; details?: string; at: string };

export type Summary = {
  roster: RosterEntry[];
  preds: Record<string, { count: number; avg: number }>;
  reports: Record<string, number>;
};

const useBlob = !!process.env.BLOB_READ_WRITE_TOKEN;

type Mem = { roster: RosterEntry[]; preds: Prediction[]; reports: Report[] };
const g = globalThis as unknown as { __wweMem?: Mem };
const mem: Mem = (g.__wweMem ??= { roster: [], preds: [], reports: [] });

type BlobItem = { pathname: string; url: string; uploadedAt: Date };

async function listAll(prefix: string): Promise<BlobItem[]> {
  const out: BlobItem[] = [];
  let cursor: string | undefined;
  do {
    const res = await list({ prefix, cursor, limit: 1000 });
    out.push(...res.blobs);
    cursor = res.hasMore ? res.cursor : undefined;
  } while (cursor);
  return out;
}

async function readJson<T>(url: string): Promise<T | null> {
  try {
    // URLs carry a random suffix and are never overwritten, so they can be cached forever.
    const r = await fetch(url, { cache: "force-cache" });
    if (!r.ok) return null;
    return (await r.json()) as T;
  } catch {
    return null;
  }
}

const seg = (p: string, i: number) => p.split("/")[i] ?? "";
const stamp = () => `${Date.now()}`;

export async function getSummary(): Promise<Summary> {
  if (!useBlob) {
    return {
      roster: [...mem.roster],
      preds: aggregatePreds(mem.preds.map((p) => [p.slug, p.rating] as const)),
      reports: countBy(mem.reports.map((r) => r.slug)),
    };
  }
  const [rosterBlobs, predBlobs, reportBlobs] = await Promise.all([
    listAll("roster/"),
    listAll("preds/"),
    listAll("reports/"),
  ]);

  // earliest confirmation per slug wins
  const first = new Map<string, BlobItem>();
  for (const b of rosterBlobs) {
    const slug = seg(b.pathname, 1);
    const cur = first.get(slug);
    if (!cur || new Date(b.uploadedAt) < new Date(cur.uploadedAt)) first.set(slug, b);
  }
  const roster = (await Promise.all([...first.values()].map((b) => readJson<RosterEntry>(b.url)))).filter(
    (x): x is RosterEntry => !!x
  );

  const preds = aggregatePreds(
    predBlobs.map((b) => [seg(b.pathname, 1), parseInt(seg(b.pathname, 2).split("_")[0], 10)] as const)
  );
  const reports = countBy(reportBlobs.map((b) => seg(b.pathname, 1)));
  return { roster, preds, reports };
}

function aggregatePreds(items: ReadonlyArray<readonly [string, number]>) {
  const acc: Record<string, { count: number; sum: number }> = {};
  for (const [slug, r] of items) {
    if (!Number.isFinite(r)) continue;
    (acc[slug] ??= { count: 0, sum: 0 }).count++;
    acc[slug].sum += r;
  }
  const out: Summary["preds"] = {};
  for (const [k, v] of Object.entries(acc)) out[k] = { count: v.count, avg: Math.round((v.sum / v.count) * 10) / 10 };
  return out;
}

function countBy(keys: string[]) {
  const out: Record<string, number> = {};
  for (const k of keys) out[k] = (out[k] ?? 0) + 1;
  return out;
}

export async function getEntry(slug: string): Promise<RosterEntry | null> {
  if (!useBlob) return mem.roster.find((r) => r.slug === slug) ?? null;
  const blobs = await listAll(`roster/${slug}/`);
  if (!blobs.length) return null;
  blobs.sort((a, b) => +new Date(a.uploadedAt) - +new Date(b.uploadedAt));
  return readJson<RosterEntry>(blobs[0].url);
}

export async function getDetail(slug: string) {
  if (!useBlob) {
    return {
      entry: mem.roster.find((r) => r.slug === slug) ?? null,
      preds: mem.preds.filter((p) => p.slug === slug).sort((a, b) => b.at.localeCompare(a.at)),
      reports: mem.reports.filter((p) => p.slug === slug).sort((a, b) => b.at.localeCompare(a.at)),
    };
  }
  const [entry, predBlobs, reportBlobs] = await Promise.all([
    getEntry(slug),
    listAll(`preds/${slug}/`),
    listAll(`reports/${slug}/`),
  ]);
  const newest = (a: BlobItem, b: BlobItem) => +new Date(b.uploadedAt) - +new Date(a.uploadedAt);
  const preds = (await Promise.all(predBlobs.sort(newest).slice(0, 200).map((b) => readJson<Prediction>(b.url)))).filter(
    (x): x is Prediction => !!x
  );
  const reports = (
    await Promise.all(reportBlobs.sort(newest).slice(0, 100).map((b) => readJson<Report>(b.url)))
  ).filter((x): x is Report => !!x);
  return { entry, preds, reports };
}

async function write(path: string, data: unknown) {
  await put(path, JSON.stringify(data), {
    access: "public",
    addRandomSuffix: true,
    contentType: "application/json",
  });
}

/** Returns false if the wrestler is already on the shared roster. */
export async function addEntry(e: RosterEntry): Promise<boolean> {
  if (!useBlob) {
    if (mem.roster.some((r) => r.slug === e.slug)) return false;
    mem.roster.push(e);
    return true;
  }
  const existing = await list({ prefix: `roster/${e.slug}/`, limit: 1 });
  if (existing.blobs.length) return false;
  await write(`roster/${e.slug}/${stamp()}.json`, e);
  return true;
}

export async function addPrediction(p: Prediction) {
  if (!useBlob) return void mem.preds.push(p);
  await write(`preds/${p.slug}/${p.rating}_${stamp()}.json`, p);
}

export async function addReport(r: Report) {
  if (!useBlob) return void mem.reports.push(r);
  await write(`reports/${r.slug}/${r.reason}_${stamp()}.json`, r);
}
