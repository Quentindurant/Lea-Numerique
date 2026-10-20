import { PhoneCall, Network, Laptop, ShieldCheck, RadioTower, Cctv } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import type { SolutionEntry, SolutionSlug } from "@/lib/solutions";
import type { BreadcrumbItem } from "@/components/ui/Breadcrumbs";

export const SOLUTION_ICONS: Record<SolutionSlug, LucideIcon> = {
  "telephonie-ip": PhoneCall,
  "operateur-telecom": RadioTower,
  "reseaux-wifi": Network,
  "materiel-informatique": Laptop,
  cybersecurite: ShieldCheck,
  "alarme-videosurveillance": Cctv,
};

// Fil d'Ariane : une seule source pour l'affichage et pour le JSON-LD BreadcrumbList
export const HUB_BREADCRUMB: BreadcrumbItem[] = [
  { name: "Accueil", path: "/" },
  { name: "Solutions", path: "/solutions" },
];

export function solutionBreadcrumb(entry: SolutionEntry): BreadcrumbItem[] {
  return [...HUB_BREADCRUMB, { name: entry.label, path: entry.path }];
}

/** Lien vers /services, proposé à côté des pages solutions */
export const SERVICES_LINK = {
  path: "/services",
  anchor: "Nos services : conseil, installation, maintenance et sécurité",
};

// Logos des marques partenaires (déclinaisons blanches, pour fond sombre), déjà utilisés sur l'accueil
const BRAND_LOGOS: Record<string, { src: string; width: number; height: number }> = {
  "3cx": { src: "/images/partenaire/3CX_blanc.png", width: 359, height: 130 },
  yeastar: { src: "/images/partenaire/yeastar_blanc.png", width: 380, height: 113 },
  yealink: { src: "/images/partenaire/Yealink-Logo-blanc.png", width: 3897, height: 828 },
  wazo: { src: "/images/partenaire/wazo_blanc.png", width: 300, height: 79 },
  ubiquiti: { src: "/images/partenaire/ubiquiti_blanc_1an.png", width: 1762, height: 1332 },
  "tp link": { src: "/images/partenaire/tp_link_blanc.png", width: 600, height: 300 },
  zyxel: { src: "/images/partenaire/zyxel_blc.png", width: 1313, height: 477 },
  fortinet: { src: "/images/partenaire/FORTINET_BLANCan.png", width: 1204, height: 136 },
  hp: { src: "/images/partenaire/hp_blancan.png", width: 1179, height: 1177 },
  lenovo: { src: "/images/partenaire/lenovo_blancan.png", width: 1600, height: 331 },
  dell: { src: "/images/partenaire/dell_blanc_9eb71b85-429b-4169-9ce0-6724d90539c0.png", width: 1200, height: 1199 },
  hikvision: { src: "/images/partenaire/hikvision_blancan.png", width: 2004, height: 254 },
};

const normalize = (value: string) =>
  value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, " ")
    .trim();

/** Logo d'une marque d'après son nom (« Yealink », « TP-Link », « Yealink (DECT) »…), ou null */
export function brandLogo(name: string) {
  const key = normalize(name);
  const match = Object.keys(BRAND_LOGOS).find((k) => key === k || key.startsWith(`${k} `));
  return match ? BRAND_LOGOS[match] : null;
}

/**
 * Identifiants d'ancre lisibles à partir de titres (accents retirés), uniques dans la page.
 * `reserved` : identifiants déjà pris par d'autres blocs de la page.
 */
export function headingIds(titles: string[], reserved: string[] = []): string[] {
  const seen = new Map<string, number>(reserved.map((id) => [id, 1]));
  return titles.map((title) => {
    const base = normalize(title).replace(/ /g, "-").slice(0, 60).replace(/-+$/, "") || "section";
    const count = seen.get(base) ?? 0;
    seen.set(base, count + 1);
    return count ? `${base}-${count + 1}` : base;
  });
}
