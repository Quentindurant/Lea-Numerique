import { pageMetadata } from "@/lib/seo";
import { missingLegalFields, site } from "@/lib/site";

export const metadata = pageMetadata({
  title: "Mentions légales",
  description:
    "Mentions légales de Léa Numérique, SAS basée 19 place du Président Kennedy à Angers : éditeur du site, hébergement, propriété intellectuelle.",
  path: "/mentions-legales",
  noindex: true,
});

// Ligne « libellé : valeur » ; une valeur absente (null) n'est jamais affichée
function Fields({ fields }: { fields: { label: string; value: string | null }[] }) {
  return (
    <dl className="space-y-1">
      {fields
        .filter((f): f is { label: string; value: string } => Boolean(f.value))
        .map((f) => (
          <div key={f.label}>
            <dt className="inline font-bold">{f.label}{"\u00A0"}:</dt> <dd className="inline">{f.value}</dd>
          </div>
        ))}
    </dl>
  );
}

export default function MentionsLegales() {
  const { legal, address } = site;

  // Rendu statique : l'avertissement s'affiche dans la sortie de `next build`
  const missing = missingLegalFields();
  if (missing.length > 0) {
    console.warn(
      `[mentions-legales] Informations légales à fournir par le propriétaire (src/lib/site.ts, objet legal) : ${missing.join(", ")}.`,
    );
  }

  return (
    <section className="bg-[#F5F4FF] pt-40 pb-24">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-[#0D0D1A] mb-10">Mentions légales</h1>

        <div className="space-y-8 text-gray-600 leading-relaxed">
          <div>
            <h2 className="text-xl font-bold text-[#0D0D1A] mb-3">Éditeur du site</h2>
            <Fields
              fields={[
                { label: "Raison sociale", value: legal.companyName },
                { label: "Forme juridique", value: legal.legalForm },
                { label: "Capital social", value: legal.shareCapital },
                { label: "Siège social", value: `${address.street}, ${address.postalCode} ${address.city}` },
                { label: "SIREN", value: legal.siren },
                { label: "RCS", value: legal.rcs ? `${legal.rcs.city} ${legal.rcs.number}` : null },
                { label: "TVA intracommunautaire", value: legal.vatNumber },
                { label: "Téléphone", value: site.phoneDisplay },
                { label: "Email", value: site.email },
                { label: "Directeur de la publication", value: legal.publicationDirector },
              ]}
            />
          </div>

          <div>
            <h2 className="text-xl font-bold text-[#0D0D1A] mb-3">Hébergement</h2>
            {legal.host ? (
              <Fields
                fields={[
                  { label: "Hébergeur", value: legal.host.name },
                  { label: "Adresse", value: legal.host.address },
                  { label: "Téléphone", value: legal.host.phone },
                  { label: "Site", value: legal.host.website },
                ]}
              />
            ) : (
              <p>
                Ce site est hébergé par un prestataire dont les coordonnées sont disponibles
                sur demande.
              </p>
            )}
          </div>

          <div>
            <h2 className="text-xl font-bold text-[#0D0D1A] mb-3">
              Propriété intellectuelle
            </h2>
            <p>
              L&apos;ensemble du contenu de ce site (textes, images, graphismes, logo, icônes)
              est protégé par le droit d&apos;auteur. Toute reproduction, totale ou partielle,
              est strictement interdite sans autorisation préalable.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-bold text-[#0D0D1A] mb-3">
              Limitation de responsabilité
            </h2>
            <p>
              Léa Numérique s&apos;efforce de maintenir les informations du site à jour.
              Cependant, nous ne pouvons garantir l&apos;exactitude, la complétude ou
              l&apos;actualité des informations diffusées.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-bold text-[#0D0D1A] mb-3">Cookies</h2>
            <p>
              Ce site n&apos;utilise pas de cookies de traçage ou publicitaires. Seuls des
              cookies techniques nécessaires au bon fonctionnement du site peuvent être
              déposés.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
