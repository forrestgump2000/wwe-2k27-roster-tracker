import { ImageResponse } from "next/og";
import { IconArt, anton } from "@/lib/art";
export const size = { width: 180, height: 180 };
export const contentType = "image/png";
export default async function AppleIcon() {
  return new ImageResponse(<IconArt s={180} />, { ...size, fonts: [{ name: "Anton", data: await anton() }] });
}
