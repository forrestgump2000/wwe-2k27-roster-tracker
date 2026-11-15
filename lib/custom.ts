import type { CustomSuperstar } from "./store";
import { BRAND_ORDER, BY_SLUG, WRESTLERS, type Brand, type Wrestler } from "./wrestlers";

const PALETTE = ["#e11d48", "#2563eb", "#16a34a", "#9333ea", "#ea580c", "#0891b2", "#ca8a04", "#db2777", "#4f46e5", "#0d9488"];

export function toWrestler(c: CustomSuperstar): Wrestler {
  let h = 0;
  for (const ch of c.slug) h = (h * 31 + ch.charCodeAt(0)) >>> 0;
  return {
    slug: c.slug,
    name: c.name,
    brand: (BRAND_ORDER as string[]).includes(c.brand) ? (c.brand as Brand) : "Free Agent",
    div: c.div,
    color: PALETTE[h % PALETTE.length],
    wiki: "",
    mainline: [],
    spinoffs: [],
    ratings: {},
    custom: true,
  };
}

/** Built-in database plus community-created superstars. */
export function mergeWrestlers(custom: CustomSuperstar[] = []) {
  const extra = custom.filter((c) => !BY_SLUG[c.slug]).map(toWrestler);
  const all = [...WRESTLERS, ...extra];
  return { all, extra, bySlug: Object.fromEntries(all.map((w) => [w.slug, w])) as Record<string, Wrestler> };
}
