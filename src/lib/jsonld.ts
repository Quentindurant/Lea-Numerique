// Données structurées (JSON-LD) : fonctions partagées par le graphe global et par les pages.
// Règle : chaque valeur reprend exactement un contenu visible de la page ou une donnée de site.ts.
import type { BreadcrumbItem } from "@/components/ui/Breadcrumbs";
import { frenchSpacing, richTextToPlainText } from "@/components/ui/RichText";
import type { SolutionContent } from "@/content/solutions/types";
import { absoluteUrl, site } from "@/lib/site";
import { findSolution, solutionPath } from "@/lib/solutions";

const CONTEXT = "https://schema.org";

/** Identifiant de l'entreprise (ProfessionalService du graphe global, présent sur toutes les pages) */
export const ORGANIZATION_ID = absoluteUrl("/#organization");
export const WEBSITE_ID = absoluteUrl("/#website");

/** Zone desservie, telle qu'affichée sur l'accueil (bloc « Zone d'intervention ») */
export const AREA_SERVED = [
  { "@type": "City", name: "Angers" },
  { "@type": "AdministrativeArea", name: "Maine-et-Loire" },
  { "@type": "AdministrativeArea", name: "Pays de la Loire" },
  { "@type": "Country", name: "France" },
];

/** Horaires d'ouverture (site.ts) : du lundi au vendredi */
export const OPENING_HOURS = {
  "@type": "OpeningHoursSpecification",
  dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
  opens: site.hours.open,
  closes: site.hours.close,
};

/** Fil d'Ariane : mêmes libellés que le fil visible, URLs absolues */
export function breadcrumbJsonLd(items: BreadcrumbItem[]) {
  return {
    "@context": CONTEXT,
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      item: absoluteUrl(item.path),
    })),
  };
}

/** FAQ : questions et réponses identiques au texte visible (liens réduits à leur libellé) */
export function faqJsonLd(items: { question: string; answer: string }[]) {
  return {
    "@context": CONTEXT,
    "@type": "FAQPage",
    mainEntity: items.map((item) => ({
      "@type": "Question",
      name: frenchSpacing(item.question),
      acceptedAnswer: { "@type": "Answer", text: richTextToPlainText(item.answer) },
    })),
  };
}

/** Service décrit par une page /solutions/<slug> : nom = H1, description = chapeau visible */
export function serviceJsonLd(content: SolutionContent) {
  const url = absoluteUrl(solutionPath(content.slug));
  return {
    "@context": CONTEXT,
    "@type": "Service",
    "@id": `${url}#service`,
    name: frenchSpacing(content.hero.title),
    serviceType: findSolution(content.slug)?.label ?? frenchSpacing(content.hero.title),
    description: richTextToPlainText(content.hero.intro),
    url,
    provider: { "@id": ORGANIZATION_ID },
    areaServed: AREA_SERVED,
  };
}
