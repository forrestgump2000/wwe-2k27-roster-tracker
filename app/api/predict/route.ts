import { NextResponse } from "next/server";
import { addPrediction } from "@/lib/store";
import { BY_SLUG } from "@/lib/wrestlers";
import { clean } from "@/lib/validate";

export async function POST(req: Request) {
  const body = await req.json().catch(() => ({}));
  const slug = clean(body.slug, 80);
  const rating = Math.round(Number(body.rating));
  if (!BY_SLUG[slug]) return NextResponse.json({ error: "Unknown superstar" }, { status: 400 });
  if (!(rating >= 40 && rating <= 100)) return NextResponse.json({ error: "Rating must be 40–100" }, { status: 400 });
  await addPrediction({ slug, rating, by: clean(body.by, 30) || "Anonymous", comment: clean(body.comment, 200) || undefined, at: new Date().toISOString() });
  return NextResponse.json({ ok: true });
}
