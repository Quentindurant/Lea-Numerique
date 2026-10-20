import { site, absoluteUrl } from "@/lib/site";
import { AREA_SERVED, OPENING_HOURS, ORGANIZATION_ID, WEBSITE_ID } from "@/lib/jsonld";

export { ORGANIZATION_ID, WEBSITE_ID };

export function JsonLd({ data }: { data: Record<string, unknown> }) {
  return (
    <script
      type="application/ld+json"
      // Échappe "<" pour empêcher toute fermeture prématurée de la balise script
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, "\\u003c") }}
    />
  );
}

export const siteJsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "ProfessionalService",
      "@id": ORGANIZATION_ID,
      name: site.name,
      legalName: site.legal.legalName,
      alternateName: site.alternateNames,
      description: site.description,
      ...(site.legal.foundingDate ? { foundingDate: site.legal.foundingDate } : {}),
      ...(site.legal.vatNumber ? { vatID: site.legal.vatNumber } : {}),
      ...(site.legal.siren
        ? { identifier: { "@type": "PropertyValue", propertyID: "SIREN", value: site.legal.siren.replace(/\s/g, "") } }
        : {}),
      url: site.url,
      // Mascotte (418 x 489, lisible sur fond blanc). Pas /images/logo.png : 600 x 71, sous le minimum
      // de 112 px demandé par Google, et jaune pâle sur fond transparent, donc illisible sur blanc.
      logo: absoluteUrl("/images/mascotte.png"),
      image: absoluteUrl("/opengraph-image"),
      telephone: site.phone,
      email: site.email,
      address: {
        "@type": "PostalAddress",
        streetAddress: site.address.street,
        postalCode: site.address.postalCode,
        addressLocality: site.address.city,
        addressRegion: site.address.region,
        addressCountry: site.address.country,
      },
      openingHoursSpecification: [OPENING_HOURS],
      areaServed: AREA_SERVED,
      knowsAbout: [
        "Opérateur télécom pour entreprises",
        "Lignes téléphoniques professionnelles",
        "Trunk SIP",
        "Portabilité des numéros",
        "Forfaits mobiles professionnels",
        "Accès internet fibre professionnel",
        "Téléphonie IP",
        "Standard téléphonique IPBX",
        "Réseaux informatiques",
        "Wi-Fi professionnel",
        "Câblage réseau",
        "Matériel informatique professionnel",
        "Maintenance informatique",
        "Cybersécurité",
        "Pare-feu",
        "Alarme anti-intrusion",
        "Alarme incendie",
        "Télésurveillance",
        "Contrôle d'accès",
        "Interphonie",
        "Vidéosurveillance",
      ],
      contactPoint: {
        "@type": "ContactPoint",
        contactType: "customer service",
        telephone: site.phone,
        email: site.email,
        areaServed: "FR",
        availableLanguage: "French",
        hoursAvailable: OPENING_HOURS,
      },
      // Renseignés uniquement quand les URLs existent dans site.ts (rien d'inventé)
      ...(site.mapUrl ? { hasMap: site.mapUrl } : {}),
      ...(site.sameAs.length ? { sameAs: site.sameAs } : {}),
    },
    {
      "@type": "WebSite",
      "@id": WEBSITE_ID,
      url: site.url,
      name: site.name,
      alternateName: site.alternateNames,
      inLanguage: "fr-FR",
      publisher: { "@id": ORGANIZATION_ID },
    },
  ],
};
