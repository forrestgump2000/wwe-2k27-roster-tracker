import { NextResponse } from "next/server";
import { addSharedPhoto, getSharedPhotos } from "@/lib/store";
import { superstarExists } from "@/lib/exists";
import { clean } from "@/lib/validate";

export const dynamic = "force-dynamic";
const MAX = 2 * 1024 * 1024;

/** Current shared photo for every superstar that has one. */
export async function GET() {
  return NextResponse.json(await getSharedPhotos(), { headers: { "Cache-Control": "public, s-maxage=10, stale-while-revalidate=60" } });
}

function sniff(b: Buffer): string | null {
  if (b.subarray(0, 8).equals(Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]))) return "image/png";
  if (b[0] === 0xff && b[1] === 0xd8 && b[2] === 0xff) return "image/jpeg";
  if (b.subarray(0, 4).toString() === "RIFF" && b.subarray(8, 12).toString() === "WEBP") return "image/webp";
  return null;
}

/** Share a photo with everyone (multipart: slug, file, credit, by, rights=yes). */
export async function POST(req: Request) {
  const form = await req.formData().catch(() => null);
  if (!form) return NextResponse.json({ error: "Bad upload" }, { status: 400 });
  const slug = clean(form.get("slug"), 80);
  const credit = clean(form.get("credit"), 120);
  const by = clean(form.get("by"), 30);
  const file = form.get("file");
  if (!(await superstarExists(slug))) return NextResponse.json({ error: "Unknown superstar" }, { status: 400 });
  if (form.get("rights") !== "yes") return NextResponse.json({ error: "Confirm you have the right to share this photo" }, { status: 400 });
  if (credit.length < 2) return NextResponse.json({ error: "Add a photo credit (who took or made it)" }, { status: 400 });
  if (!(file instanceof Blob)) return NextResponse.json({ error: "Choose an image" }, { status: 400 });
  if (file.size > MAX) return NextResponse.json({ error: "Image is too large (max 2 MB)" }, { status: 400 });
  const buf = Buffer.from(await file.arrayBuffer());
  const type = sniff(buf);
  if (!type) return NextResponse.json({ error: "Use a PNG, JPEG or WebP image" }, { status: 400 });
  await addSharedPhoto(slug, buf, type, credit, by || undefined);
  return NextResponse.json({ ok: true });
}
