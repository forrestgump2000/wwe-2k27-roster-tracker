import { NextResponse } from "next/server";
import { addReport } from "@/lib/store";
import { superstarExists } from "@/lib/exists";
import { REPORT_REASONS } from "@/lib/meta";
import { clean } from "@/lib/validate";

export async function POST(req: Request) {
  const body = await req.json().catch(() => ({}));
  const slug = clean(body.slug, 80);
  const reason = clean(body.reason, 30);
  if (!(await superstarExists(slug))) return NextResponse.json({ error: "Unknown superstar" }, { status: 400 });
  if (!REPORT_REASONS.some((r) => r.id === reason)) return NextResponse.json({ error: "Pick a reason" }, { status: 400 });
  await addReport({ slug, reason, details: clean(body.details, 300) || undefined, at: new Date().toISOString() });
  return NextResponse.json({ ok: true });
}
