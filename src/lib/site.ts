// Source unique des informations de l'entreprise (SEO, JSON-LD, footer, contact).
// Garder ces valeurs identiques à la fiche Google Business Profile (cohérence NAP).
export const site = {
  url: "https://lea-numerique.fr",
  name: "Léa Numérique",
  alternateNames: ["Lea Numerique", "LeaNumerique"],
  description:
    "Intégrateur IT à Angers : téléphonie IP, réseaux, informatique et cybersécurité pour entreprises, collectivités et santé en Maine-et-Loire. Devis gratuit.",
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
  hours: { days: "Lun – Ven", open: "09:00", close: "17:30", display: "Lun – Ven, 9h – 17h30" },
  serviceArea: "Angers, Maine-et-Loire et France entière",
  // À compléter dès que disponibles (fiche Google Business Profile, LinkedIn…)
  sameAs: [] as string[],
} as const;

export const absoluteUrl = (path = "/") => new URL(path, site.url).toString();
