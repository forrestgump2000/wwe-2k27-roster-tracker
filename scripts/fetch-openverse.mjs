// Fallback for step 1: searches Openverse (Flickr, Wikimedia & other CC sources) for superstars
// who still have no render. Only CC BY / CC BY-SA / CC0 / public-domain images whose title names the
// superstar are used. Usage: RAW_DIR=/tmp/raw node scripts/fetch-openverse.mjs
import { readFileSync, writeFileSync, existsSync, readdirSync } from "node:fs";
const RAW = process.env.RAW_DIR ?? "raw-photos";
const src = readFileSync("lib/wrestlers.ts", "utf8");
const names = [...src.matchAll(/^\s*w\("((?:[^"\\]|\\.)+)"/gm)].map((m) => m[1].replace(/\\"/g, '"'));
const slug = (s) => s.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/['’.]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
const norm = (s) => slug(s).replace(/-/g, " ");
const credits = JSON.parse(readFileSync("lib/photo-credits.json", "utf8"));
const have = new Set(readdirSync("public/renders").map((f) => f.replace(/\.png$/, "")));
const H = { headers: { "User-Agent": "WWE2K27RosterTracker/1.0 (fan project; build script)" } };
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const LIC = { by: "CC BY", "by-sa": "CC BY-SA", cc0: "CC0", pdm: "Public domain" };
for (const name of names) {
  const s = slug(name);
  if (have.has(s)) continue;
  if (process.env.ONLY && !process.env.ONLY.split(",").includes(s)) continue;
  const q = name.replace(/"[^"]*"/g, "").replace(/\s+/g, " ").trim();
  const r = await fetch(`https://api.openverse.org/v1/images/?q=${encodeURIComponent(`"${q}"`)}&license=by,by-sa,cc0,pdm&page_size=20`, H);
  await sleep(1200);
  if (!r.ok) { console.log("err  ", name, r.status); continue; }
  const results = (await r.json()).results ?? [];
  const hit = results
    .filter((x) => norm(x.title ?? "").includes(norm(q)) && (x.width ?? 0) >= 300)
    .sort((a, b) => Number(/crop/i.test(b.title)) - Number(/crop/i.test(a.title)))[0];
  if (!hit) { console.log("none ", name); continue; }
  let url = hit.url;
  const m = url.match(/^https:\/\/upload\.wikimedia\.org\/wikipedia\/commons\/(.)\/(..)\/(.+)$/);
  if (m && hit.width > 500) url = `https://upload.wikimedia.org/wikipedia/commons/thumb/${m[1]}/${m[2]}/${m[3]}/500px-${m[3]}`;
  const img = await fetch(url, H);
  if (!img.ok) { console.log("nodl ", name, img.status); continue; }
  writeFileSync(`${RAW}/${s}.jpg`, Buffer.from(await img.arrayBuffer()));
  credits[s] = {
    file: hit.title,
    author: (hit.creator ?? "Unknown").slice(0, 120),
    license: `${LIC[hit.license] ?? hit.license.toUpperCase()}${hit.license_version && hit.license !== "pdm" && hit.license !== "cc0" ? " " + hit.license_version : ""}`,
    page: hit.foreign_landing_url,
  };
  console.log("ok   ", name, "|", hit.title, "|", credits[s].license);
  await sleep(800);
}
writeFileSync("lib/photo-credits.json", JSON.stringify(credits, null, 1));
