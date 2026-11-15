// Step 1 of the render pipeline.
// Finds each wrestler's lead photo on Wikipedia (hosted on Wikimedia Commons under a free licence),
// records author + licence for attribution, and downloads a 500px copy to RAW_DIR.
// Step 2 (scripts/cutout.swift) removes the background to make the transparent renders.
// Usage: RAW_DIR=/tmp/raw node scripts/fetch-photos.mjs [--force]
import { readFileSync, writeFileSync, existsSync, mkdirSync } from "node:fs";
const RAW = process.env.RAW_DIR ?? "raw-photos";
mkdirSync(RAW, { recursive: true });
const src = readFileSync("lib/wrestlers.ts", "utf8");
const rows = [...src.matchAll(/^\s*w\("((?:[^"\\]|\\.)+)",.*$/gm)].map((m) => {
  const name = m[1].replace(/\\"/g, '"');
  const wiki = m[0].match(/wiki: "([^"]+)"/)?.[1] ?? name.replace(/ /g, "_");
  return { name, wiki };
});
const slug = (s) => s.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/['’.]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
const OUT = "lib/photo-credits.json";
const out = existsSync(OUT) ? JSON.parse(readFileSync(OUT, "utf8")) : {};
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const H = { headers: { "User-Agent": "WWE2K27RosterTracker/1.0 (fan project; build script)" } };
async function get(url, kind = "json") {
  for (let a = 0; a < 5; a++) {
    const r = await fetch(url, H);
    if (r.status === 429) { await sleep(6000 * (a + 1)); continue; }
    if (!r.ok) return null;
    return kind === "json" ? r.json() : Buffer.from(await r.arrayBuffer());
  }
  return null;
}
const strip = (h = "") => h.replace(/<[^>]+>/g, "").replace(/\s+/g, " ").trim();
for (const r of rows) {
  const s = slug(r.name);
  if (out[s] && existsSync(`${RAW}/${s}.jpg`) && !process.argv.includes("--force")) continue;
  const j = await get(`https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(r.wiki)}`);
  await sleep(300);
  if (!j?.originalimage?.source || !/wrestl|wwe/i.test(`${j.description ?? ""} ${j.extract ?? ""}`)) { console.log("skip ", r.name); continue; }
  const file = decodeURIComponent(j.originalimage.source.split("?")[0].split("/").pop());
  const meta = await get(`https://commons.wikimedia.org/w/api.php?action=query&format=json&prop=imageinfo&iiprop=extmetadata|url&iiurlwidth=500&titles=${encodeURIComponent("File:" + file)}`);
  const page = meta && Object.values(meta.query?.pages ?? {})[0];
  const ii = page?.imageinfo?.[0];
  const em = ii?.extmetadata ?? {};
  const license = strip(em.LicenseShortName?.value);
  if (!ii || !license || /fair use|non-free/i.test(license)) { console.log("nolic", r.name, license); continue; }
  const img = await get(ii.thumburl ?? ii.url, "buf");
  if (!img) { console.log("nodl ", r.name); continue; }
  writeFileSync(`${RAW}/${s}.jpg`, img);
  out[s] = { file, author: strip(em.Artist?.value).slice(0, 120) || "Unknown", license, page: ii.descriptionurl };
  console.log("ok   ", r.name, "|", license);
  await sleep(500);
}
writeFileSync(OUT, JSON.stringify(out, null, 1));
console.log(Object.keys(out).length, "/", rows.length);
