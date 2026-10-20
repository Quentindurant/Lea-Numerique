import type { MetadataRoute } from "next";
import { absoluteUrl } from "@/lib/site";
import { SOLUTIONS } from "@/lib/solutions";
import { getSolutionContent } from "@/content/solutions";

// lastModified fixe : à mettre à jour à la main quand le contenu d'une page change
// (une date qui bouge à chaque déploiement fait ignorer le lastmod par Google).
// Les pages solutions reprennent la date lastModified de leur fichier de contenu.
// /mentions-legales et /politique-confidentialite sont en noindex : elles n'ont pas leur place ici.
const pages: { path: string; lastModified: string; priority: number }[] = [
  { path: "/", lastModified: "2026-10-20", priority: 1 },
  { path: "/solutions", lastModified: "2026-10-20", priority: 0.9 },
  ...SOLUTIONS.map((s) => ({ path: s.path, lastModified: getSolutionContent(s.slug).lastModified, priority: 0.8 })),
  { path: "/services", lastModified: "2026-10-20", priority: 0.9 },
  { path: "/contact", lastModified: "2026-10-20", priority: 0.8 },
  { path: "/a-propos", lastModified: "2026-10-20", priority: 0.7 },
];

export default function sitemap(): MetadataRoute.Sitemap {
  return pages.map((p) => ({
    url: absoluteUrl(p.path),
    lastModified: p.lastModified,
    priority: p.priority,
  }));
}
