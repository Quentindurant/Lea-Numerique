import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Mentions légales — Léa Numérique",
};

export default function MentionsLegales() {
  return (
    <section className="bg-[#F5F4FF] pt-40 pb-24">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-[#0D0D1A] mb-10">Mentions légales</h1>

        <div className="space-y-8 text-gray-600 leading-relaxed">
          <div>
            <h2 className="text-xl font-bold text-[#0D0D1A] mb-3">Éditeur du site</h2>
            <p>
              <strong>Raison sociale :</strong> Léa Numérique<br />
              <strong>Forme juridique :</strong> SAS<br />
              <strong>Siège social :</strong> 19 place du Président Kennedy, 49100 ANGERS<br />
              <strong>Email :</strong> hello@leanumerique.com
            </p>
          </div>

          <div>
            <h2 className="text-xl font-bold text-[#0D0D1A] mb-3">Hébergement</h2>
            <p>
              Ce site est hébergé par un prestataire dont les coordonnées sont disponibles
              sur demande.
            </p>
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
