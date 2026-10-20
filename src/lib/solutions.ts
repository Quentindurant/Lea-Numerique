// Registre des pages solutions : source unique des URLs, libellés et ancres héritées.
// Toute page ou tout composant qui pointe vers une solution doit passer par ce registre.

export const SOLUTIONS = [
  {
    slug: "telephonie-ip",
    path: "/solutions/telephonie-ip",
    // Libellé court (menu, fil d'Ariane, footer)
    label: "Téléphonie IP",
    // Ancre descriptive pour les liens internes
    anchor: "Téléphonie IP et standard d'entreprise",
    // Ancienne ancre de la page /solutions, conservée sur la page hub
    legacyAnchor: "telephonie",
  },
  {
    slug: "operateur-telecom",
    path: "/solutions/operateur-telecom",
    label: "Opérateur télécom",
    anchor: "Opérateur télécom : lignes, mobiles et fibre pro",
    // Nouvelle page : id de sa carte sur le hub (pas d'ancienne ancre à conserver)
    legacyAnchor: "operateur",
  },
  {
    slug: "reseaux-wifi",
    path: "/solutions/reseaux-wifi",
    label: "Réseaux et Wi-Fi",
    anchor: "Réseaux, Wi-Fi et câblage professionnels",
    legacyAnchor: "reseaux",
  },
  {
    slug: "cybersecurite",
    path: "/solutions/cybersecurite",
    label: "Cybersécurité",
    anchor: "Cybersécurité, pare-feu et sauvegarde",
    legacyAnchor: "cybersecurite",
  },
  {
    slug: "alarme-videosurveillance",
    path: "/solutions/alarme-videosurveillance",
    label: "Alarme et vidéosurveillance",
    anchor: "Alarme, vidéosurveillance et contrôle d'accès",
    // Nouvelle page : id de sa carte sur le hub (pas d'ancienne ancre à conserver)
    legacyAnchor: "alarme",
  },
  {
    slug: "materiel-informatique",
    path: "/solutions/materiel-informatique",
    label: "Matériel informatique",
    anchor: "Matériel informatique professionnel",
    legacyAnchor: "informatique",
  },
] as const;

export type SolutionSlug = (typeof SOLUTIONS)[number]["slug"];
export type SolutionEntry = (typeof SOLUTIONS)[number];

export const SOLUTION_SLUGS = SOLUTIONS.map((s) => s.slug) as SolutionSlug[];

export function solutionPath(slug: SolutionSlug): string {
  return `/solutions/${slug}`;
}

export function findSolution(slug: string): SolutionEntry | undefined {
  return SOLUTIONS.find((s) => s.slug === slug);
}
