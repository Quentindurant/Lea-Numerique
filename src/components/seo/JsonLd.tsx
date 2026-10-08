import { site, absoluteUrl } from "@/lib/site";

export function JsonLd({ data }: { data: Record<string, unknown> }) {
  return (
    <script
      type="application/ld+json"
      // Échappe "<" pour empêcher toute fermeture prématurée de la balise script
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, "\\u003c") }}
    />
  );
}

export const ORGANIZATION_ID = absoluteUrl("/#organization");
export const WEBSITE_ID = absoluteUrl("/#website");

export const siteJsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "ProfessionalService",
      "@id": ORGANIZATION_ID,
      name: site.name,
      alternateName: site.alternateNames,
      description: site.description,
      url: site.url,
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
      areaServed: [
        { "@type": "City", name: "Angers" },
        { "@type": "AdministrativeArea", name: "Maine-et-Loire" },
        { "@type": "Country", name: "France" },
      ],
      knowsAbout: [
        "Téléphonie IP",
        "Standard téléphonique IPBX",
        "Réseaux informatiques",
        "Wi-Fi professionnel",
        "Câblage réseau",
        "Matériel informatique professionnel",
        "Maintenance informatique",
        "Cybersécurité",
        "Pare-feu",
        "Vidéosurveillance",
      ],
      contactPoint: {
        "@type": "ContactPoint",
        contactType: "customer service",
        telephone: site.phone,
        email: site.email,
        areaServed: "FR",
        availableLanguage: "French",
        hoursAvailable: {
          "@type": "OpeningHoursSpecification",
          dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
          opens: site.hours.open,
          closes: site.hours.close,
        },
      },
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
