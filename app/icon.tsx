import { ImageResponse } from "next/og";
import { IconArt, anton } from "@/lib/art";
export const size = { width: 64, height: 64 };
export const contentType = "image/png";
export default async function Icon() {
  return new ImageResponse(<IconArt s={64} />, { ...size, fonts: [{ name: "Anton", data: await anton() }] });
}
