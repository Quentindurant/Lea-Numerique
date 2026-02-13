import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Politique de confidentialité — Léa Numérique",
};

export default function PolitiqueConfidentialite() {
  return (
    <section className="bg-[#F5F4FF] pt-40 pb-24">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-[#0D0D1A] mb-10">
          Politique de confidentialité
        </h1>

        <div className="space-y-8 text-gray-600 leading-relaxed">
          <div>
            <h2 className="text-xl font-bold text-[#0D0D1A] mb-3">
              Collecte des données
            </h2>
            <p>
              Léa Numérique collecte uniquement les données personnelles que vous nous
              transmettez via le formulaire de contact (nom, email, téléphone, message).
              Ces données sont utilisées exclusivement pour traiter votre demande.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-bold text-[#0D0D1A] mb-3">
              Utilisation des données
            </h2>
            <p>
              Les informations collectées sont utilisées pour :
            </p>
            <ul className="list-disc list-inside mt-2 space-y-1">
              <li>Répondre à vos demandes de contact et de devis</li>
              <li>Améliorer nos services</li>
              <li>Vous informer de nos offres si vous y avez consenti</li>
            </ul>
          </div>

          <div>
            <h2 className="text-xl font-bold text-[#0D0D1A] mb-3">
              Conservation des données
            </h2>
            <p>
              Vos données sont conservées pour une durée maximale de 3 ans à compter
              du dernier contact, sauf obligation légale contraire.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-bold text-[#0D0D1A] mb-3">Vos droits</h2>
            <p>
              Conformément au RGPD, vous disposez d&apos;un droit d&apos;accès, de rectification,
              de suppression et de portabilité de vos données. Pour exercer ces droits,
              contactez-nous à :{" "}
              <a
                href="mailto:hello@lea-numerique.fr"
                className="text-[#7C6EFA] hover:underline"
              >
                hello@lea-numerique.fr
              </a>
            </p>
          </div>

          <div>
            <h2 className="text-xl font-bold text-[#0D0D1A] mb-3">
              Partage des données
            </h2>
            <p>
              Nous ne vendons ni ne partageons vos données personnelles avec des tiers,
              sauf obligation légale ou nécessité technique liée à la transmission des
              emails (service EmailJS).
            </p>
          </div>

          <div>
            <h2 className="text-xl font-bold text-[#0D0D1A] mb-3">Contact DPO</h2>
            <p>
              Pour toute question relative à la protection de vos données :{" "}
              <a
                href="mailto:hello@lea-numerique.fr"
                className="text-[#7C6EFA] hover:underline"
              >
                hello@lea-numerique.fr
              </a>
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
