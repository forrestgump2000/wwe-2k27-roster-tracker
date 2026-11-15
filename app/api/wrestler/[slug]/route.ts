import { NextResponse } from "next/server";
import { getDetail } from "@/lib/store";

export const dynamic = "force-dynamic";

export async function GET(_: Request, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  return NextResponse.json(await getDetail(slug), { headers: { "Cache-Control": "no-store" } });
}
