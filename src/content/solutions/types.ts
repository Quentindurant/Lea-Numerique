import type { SolutionSlug } from "@/lib/solutions";

/**
 * Texte enrichi minimal : du texte brut dans lequel seuls les liens au format
 * [libellé](/chemin) sont interprétés. Aucun autre balisage (pas de gras, pas de HTML).
 * Exemple : "Voir aussi nos [contrats de maintenance](/services#maintenance)."
 */
export type RichText = string;

export interface SolutionSubsection {
  /** Titre H3 */
  title: string;
  paragraphs: RichText[];
}

export interface SolutionSection {
  /** Titre H2, descriptif (il doit avoir du sens lu seul) */
  title: string;
  paragraphs: RichText[];
  /** Liste à puces facultative, affichée après les paragraphes */
  bullets?: RichText[];
  /** Sous-sections H3 facultatives, affichées après la liste */
  subsections?: SolutionSubsection[];
}

/**
 * Contenu d'une page /solutions/<slug>.
 * Ce contrat est figé : le gabarit de page (SolutionPage) le consomme tel quel.
 */
export interface SolutionContent {
  slug: SolutionSlug;
  /** Date réelle de dernière modification du contenu (YYYY-MM-DD), reprise dans le sitemap */
  lastModified: string;

  seo: {
    /**
     * Titre de la balise <title>, SANS le suffixe " | Léa Numérique" ajouté automatiquement (16 caractères).
     * Titre complet visé : 50 à 60 caractères, donc ici 34 à 44 caractères.
     */
    title: string;
    /** Meta description de 140 à 155 caractères, avec un appel à l'action */
    description: string;
  };

  hero: {
    /** Petit libellé affiché au-dessus du H1 */
    eyebrow: string;
    /** Le H1, unique sur la page */
    title: string;
    /** Chapeau de 2 à 3 phrases */
    intro: RichText;
    image: { src: string; alt: string };
  };

  /** Corps de page : 3 à 5 sections H2 (besoin du client, notre solution, déroulé, etc.) */
  sections: SolutionSection[];

  /** Marques travaillées, chacune avec une phrase réellement utile. Facultatif : section masquée si absent */
  brands?: {
    /** Titre H2 de la section marques */
    title: string;
    items: { name: string; description: RichText }[];
  };

  /** Exemple type de projet. Présenté comme un exemple de déroulé, jamais comme une référence client réelle */
  example: {
    /** Titre H2 */
    title: string;
    context: RichText;
    steps: string[];
    outcome: RichText;
  };

  /** 3 à 5 questions propres au sujet de la page (reprises dans le JSON-LD FAQPage) */
  faq: {
    /** Titre H2 de la FAQ */
    title: string;
    items: { question: string; answer: RichText }[];
  };

  /** Appel à l'action final */
  cta: { title: string; text: string; label: string };
}
