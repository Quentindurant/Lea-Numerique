// Source unique des informations de l'entreprise (SEO, JSON-LD, footer, contact).
// Garder ces valeurs identiques à la fiche Google Business Profile (cohérence NAP).

/** Informations légales (mentions légales, LCEN). Un champ à null n'est pas affiché. */
export type LegalInfo = {
  companyName: string;
  /** Dénomination exacte au registre (reprise dans le JSON-LD legalName) */
  legalName: string;
  /** Date de création au registre (AAAA-MM-JJ, reprise dans le JSON-LD foundingDate) */
  foundingDate: string | null;
  legalForm: string;
  /** Capital social, tel qu'il doit être affiché (ex. « 1 000 € ») */
  shareCapital: string | null;
  /** SIREN (9 chiffres) */
  siren: string | null;
  /** Immatriculation au RCS : ville du greffe et numéro */
  rcs: { city: string; number: string } | null;
  /** Numéro de TVA intracommunautaire */
  vatNumber: string | null;
  /** Nom du directeur ou de la directrice de la publication */
  publicationDirector: string | null;
  /** Hébergeur du site : nom, adresse, téléphone ou site web */
  host: { name: string; address: string; phone: string | null; website: string | null } | null;
};

// Données du registre (RCS, RNE, INSEE) relevées le 20/10/2026 et fournies par le propriétaire
const legal: LegalInfo = {
  companyName: "LE@ Numérique, exerçant sous le nom Léa Numérique",
  legalName: "LE@ Numérique",
  foundingDate: "2018-03-01",
  legalForm: "SAS (société par actions simplifiée)",
  // Siège social : site.address (19 place du Président Kennedy, 49100 Angers)
  shareCapital: "95 300 €",
  siren: "837 873 694",
  rcs: { city: "Angers", number: "837 873 694" },
  vatNumber: "FR51837873694",
  // Représentant légal (présidente de la SAS) : directeur de la publication d'office
  publicationDirector: "Groupe GC Développement, président de la société",
  host: null, // à fournir par le propriétaire (nom, adresse, téléphone ou site de l'hébergeur)
};

export const site = {
  url: "https://lea-numerique.fr",
  name: "Léa Numérique",
  alternateNames: ["Lea Numerique", "LeaNumerique"],
  description:
    "Opérateur télécom à Angers : lignes, mobiles et fibre, téléphonie IP, réseau, cybersécurité, alarme et vidéosurveillance en Maine-et-Loire. Devis gratuit.",
  phone: "+33219230691",
  phoneDisplay: "02 19 23 06 91",
  email: "hello@lea-numerique.fr",
  address: {
    street: "19 place du Président Kennedy",
    postalCode: "49100",
    city: "Angers",
    region: "Pays de la Loire",
    department: "Maine-et-Loire",
    country: "FR",
  },
  hours: { days: "Du lundi au vendredi", open: "09:00", close: "17:30", display: "Du lundi au vendredi, de 9h à 17h30" },
  serviceArea: "Angers, Maine-et-Loire et France entière",
  // À compléter dès que disponibles (fiche Google Business Profile, LinkedIn…)
  sameAs: [] as string[],
  // URL de la fiche Google Maps (Google Business Profile), à fournir par le propriétaire : alimente hasMap
  mapUrl: null as string | null,
  legal,
} as const;

/** Libellés des informations légales encore manquantes (signalées au build par /mentions-legales) */
export function missingLegalFields(info: LegalInfo = site.legal): string[] {
  const labels: [keyof LegalInfo, string][] = [
    ["shareCapital", "capital social"],
    ["siren", "SIREN"],
    ["rcs", "RCS (ville et numéro)"],
    ["vatNumber", "TVA intracommunautaire"],
    ["publicationDirector", "directeur de la publication"],
    ["host", "hébergeur (nom, adresse, téléphone ou site)"],
  ];
  return labels.filter(([key]) => info[key] === null).map(([, label]) => label);
}

export const absoluteUrl = (path = "/") => new URL(path, site.url).toString();
