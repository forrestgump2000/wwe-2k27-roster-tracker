// Step 3: writes lib/renders.json (credits for every render that exists in public/renders).
import { readFileSync, writeFileSync, readdirSync } from "node:fs";
const credits = JSON.parse(readFileSync("lib/photo-credits.json", "utf8"));
const have = new Set(readdirSync("public/renders").map((f) => f.replace(/\.png$/, "")));
const out = Object.fromEntries(Object.entries(credits).filter(([k]) => have.has(k)).map(([k, v]) => [k, { author: v.author, license: v.license, page: v.page }]));
writeFileSync("lib/renders.json", JSON.stringify(out));
console.log(Object.keys(out).length, "renders");
