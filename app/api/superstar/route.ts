import { NextResponse } from "next/server";
import { addCustom } from "@/lib/store";
import { BY_SLUG, slugify } from "@/lib/wrestlers";
import { clean } from "@/lib/validate";

const BRANDS = ["Raw", "SmackDown", "NXT", "Free Agent", "Legend", "Alumni"];

/** Create a community superstar who isn't in the built-in database. */
export async function POST(req: Request) {
  const body = await req.json().catch(() => ({}));
  const name = clean(body.name, 40).replace(/\s+/g, " ");
  const brand = clean(body.brand, 20);
  const div = body.div === "F" ? "F" : "M";
  const slug = slugify(name);
  if (name.length < 2 || !slug) return NextResponse.json({ error: "Enter the superstar’s name" }, { status: 400 });
  if (!BRANDS.includes(brand)) return NextResponse.json({ error: "Pick a brand" }, { status: 400 });
  if (BY_SLUG[slug]) return NextResponse.json({ error: `${BY_SLUG[slug].name} is already in the database — search for them instead`, slug }, { status: 409 });
  const ok = await addCustom({ slug, name, brand, div, addedBy: clean(body.addedBy, 30) || undefined, at: new Date().toISOString() });
  if (!ok) return NextResponse.json({ error: "Someone already created this superstar — search for them instead", slug }, { status: 409 });
  return NextResponse.json({ ok: true, slug });
}
