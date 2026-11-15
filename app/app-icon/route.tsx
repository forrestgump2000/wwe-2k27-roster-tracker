import { ImageResponse } from "next/og";
import { IconArt, anton } from "@/lib/art";
// Full-size 512px app icon (used by the web manifest)
export const dynamic = "force-static";
export async function GET() {
  return new ImageResponse(<IconArt s={512} />, { width: 512, height: 512, fonts: [{ name: "Anton", data: await anton() }] });
}
