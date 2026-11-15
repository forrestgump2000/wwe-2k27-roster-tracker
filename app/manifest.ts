import type { MetadataRoute } from "next";
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "WWE 2K27 Roster Tracker",
    short_name: "2K27 Roster",
    description: "Community-powered WWE 2K27 roster tracker: confirmations, rating history and predictions.",
    start_url: "/",
    display: "standalone",
    background_color: "#060609",
    theme_color: "#060609",
    icons: [{ src: "/app-icon", sizes: "512x512", type: "image/png" }, { src: "/apple-icon", sizes: "180x180", type: "image/png" }],
  };
}
