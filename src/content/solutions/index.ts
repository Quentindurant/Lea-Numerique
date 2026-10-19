import type { SolutionSlug } from "@/lib/solutions";
import type { SolutionContent } from "./types";
import { telephonieIp } from "./telephonie-ip";
import { operateurTelecom } from "./operateur-telecom";
import { reseauxWifi } from "./reseaux-wifi";
import { materielInformatique } from "./materiel-informatique";
import { cybersecurite } from "./cybersecurite";

export const solutionContents: Record<SolutionSlug, SolutionContent> = {
  "telephonie-ip": telephonieIp,
  "operateur-telecom": operateurTelecom,
  "reseaux-wifi": reseauxWifi,
  "materiel-informatique": materielInformatique,
  cybersecurite,
};

export function getSolutionContent(slug: SolutionSlug): SolutionContent {
  return solutionContents[slug];
}

export type { SolutionContent } from "./types";
