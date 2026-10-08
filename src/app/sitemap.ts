import type { MetadataRoute } from "next";
import { absoluteUrl } from "@/lib/site";

// lastModified fixe : à mettre à jour à la main quand le contenu d'une page change
// (une date qui bouge à chaque déploiement fait ignorer le lastmod par Google).
const pages: { path: string; lastModified: string; priority: number }[] = [
  { path: "/", lastModified: "2026-10-08", priority: 1 },
  { path: "/solutions", lastModified: "2026-10-08", priority: 0.9 },
  { path: "/services", lastModified: "2026-10-08", priority: 0.9 },
  { path: "/contact", lastModified: "2026-10-08", priority: 0.8 },
  { path: "/a-propos", lastModified: "2026-10-08", priority: 0.7 },
  { path: "/mentions-legales", lastModified: "2026-10-08", priority: 0.2 },
  { path: "/politique-confidentialite", lastModified: "2026-10-08", priority: 0.2 },
];

export default function sitemap(): MetadataRoute.Sitemap {
  return pages.map((p) => ({
    url: absoluteUrl(p.path),
    lastModified: p.lastModified,
    priority: p.priority,
  }));
}
