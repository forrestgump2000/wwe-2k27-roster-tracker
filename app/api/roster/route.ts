import { NextResponse } from "next/server";
import { addEntry, getSummary } from "@/lib/store";
import { BY_SLUG } from "@/lib/wrestlers";
import { METHODS } from "@/lib/meta";
import { clean } from "@/lib/validate";

export const dynamic = "force-dynamic";

export async function GET() {
  const data = await getSummary();
  return NextResponse.json(data, { headers: { "Cache-Control": "public, s-maxage=5, stale-while-revalidate=30" } });
}

export async function POST(req: Request) {
  const body = await req.json().catch(() => ({}));
  const slug = clean(body.slug, 80);
  const method = clean(body.method, 30);
  const details = clean(body.details, 400);
  const source = clean(body.source, 300);
  const addedBy = clean(body.addedBy, 30);
  if (!BY_SLUG[slug]) return NextResponse.json({ error: "Unknown superstar" }, { status: 400 });
  if (!METHODS.some((m) => m.id === method)) return NextResponse.json({ error: "Pick how they were confirmed" }, { status: 400 });
  if (details.length < 8) return NextResponse.json({ error: "Tell us how they were confirmed (at least a few words)" }, { status: 400 });
  if (source && !/^https?:\/\//i.test(source)) return NextResponse.json({ error: "Source must be a link starting with http" }, { status: 400 });
  const ok = await addEntry({ slug, method, details, source: source || undefined, addedBy: addedBy || undefined, addedAt: new Date().toISOString() });
  if (!ok) return NextResponse.json({ error: "Already on the roster — someone beat you to it!" }, { status: 409 });
  return NextResponse.json({ ok: true });
}
