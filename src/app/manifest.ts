import type { MetadataRoute } from "next";
import { site } from "@/lib/site";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: `${site.name} – Intégrateur IT à Angers`,
    short_name: site.name,
    description: site.description,
    start_url: "/",
    display: "browser",
    background_color: "#0D0D1A",
    theme_color: "#0D0D1A",
    lang: "fr",
    icons: [{ src: "/icon.png", sizes: "512x512", type: "image/png" }],
  };
}
