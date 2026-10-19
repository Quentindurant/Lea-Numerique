import Link from "next/link";
import { MapPin, Phone, ArrowRight } from "lucide-react";
import RichText, { frenchSpacing } from "@/components/ui/RichText";
import { JsonLd } from "@/components/seo/JsonLd";
import { faqJsonLd } from "@/lib/jsonld";
import { site } from "@/lib/site";
import { solutionPath } from "@/lib/solutions";

const areas = [
  "Angers et son agglomération",
  "Maine-et-Loire (49)",
  "Pays de la Loire",
  "France entière, sur site ou à distance",
];

// Horaires de site.ts dans une phrase : « du lundi au vendredi, de 9h à 17h30 »
const hoursInSentence = site.hours.display.charAt(0).toLowerCase() + site.hours.display.slice(1);

// Réponses en texte enrichi (liens [libellé](href)) : le JSON-LD FAQPage reprend exactement le texte visible.
export const homeFaq: { question: string; answer: string }[] = [
  {
    question: "Où intervenez-vous ?",
    answer: `Nous sommes basés au ${site.address.street} à Angers et accompagnons les organisations de l'Anjou et du Maine-et-Loire. Nous intervenons également partout en France, sur site ou à distance. Notre équipe est joignable ${hoursInSentence}, au [${site.phoneDisplay}](tel:${site.phone}).`,
  },
  {
    question: "Quelles solutions de téléphonie IP proposez-vous aux entreprises ?",
    answer: `Nous installons des IPBX Yeastar et 3CX, des téléphones IP Yealink et la solution Wazo : standard virtuel, renvoi sur mobile, messagerie vocale et visioconférence intégrée. Nous assurons la mise en service et la formation de vos utilisateurs. Le détail de l'offre est sur notre page [téléphonie IP et standard d'entreprise](${solutionPath("telephonie-ip")}).`,
  },
  {
    question: "Pouvez-vous fournir nos lignes, nos forfaits mobiles et notre accès internet ?",
    answer: `Oui. Nous fournissons des lignes fixes et des trunks SIP, des forfaits mobiles professionnels et des accès internet fibre, avec la portabilité de vos numéros actuels. Le détail est sur notre page [opérateur télécom pour les entreprises](${solutionPath("operateur-telecom")}).`,
  },
  {
    question: "Proposez-vous des contrats de maintenance informatique ?",
    answer:
      "Oui. Nos contrats de maintenance sont personnalisés selon votre structure : helpdesk téléphonique dédié, télémaintenance sécurisée, intervention sur site, suivi avec rapports mensuels et gestion de votre parc matériel. En savoir plus sur [nos contrats de maintenance informatique](/services#maintenance).",
  },
  {
    question: "Comment protéger une PME ou une collectivité contre les cyberattaques ?",
    answer: `Nous commençons par un audit de sécurité, puis déployons les protections adaptées : pare-feu Fortinet, antivirus et EDR entreprise, filtrage web et DNS, sauvegarde externalisée chiffrée et, si besoin, un plan de reprise d'activité (PRA). Voir aussi [nos solutions de cybersécurité](${solutionPath("cybersecurite")}) et [nos services de sécurité informatique](/services#securite).`,
  },
  {
    question: "Pouvez-vous reprendre ou faire évoluer notre installation existante ?",
    answer:
      "Oui. Nous réalisons d'abord un audit de votre infrastructure existante (téléphonie, réseau, postes, sécurité), puis vous remettons des préconisations personnalisées et, si nécessaire, un plan de transformation IT par étapes. En savoir plus sur [notre conseil et audit informatique](/services#conseil).",
  },
  {
    question: "Travaillez-vous avec les collectivités et les établissements de santé ?",
    answer:
      "Oui. Nous accompagnons des mairies et collectivités, des collèges et lycées, des EHPAD et établissements de santé, ainsi que des PME/PMI, des industries, des notaires et des professions libérales. Chaque solution est adaptée aux contraintes du secteur.",
  },
  {
    question: "Le devis est-il gratuit ? Sous quel délai répondez-vous ?",
    answer:
      "Oui, le devis est gratuit et sans engagement. Nous vous répondons sous 24h ouvrées et organisons si nécessaire une visite ou un appel de diagnostic. Vous pouvez [demander votre devis en ligne](/contact).",
  },
];

// Liens sur fond clair : #5A4ED8 (contraste 5,4:1 sur #F5F4FF) plutôt que #7C6EFA (3,5:1)
const lightLink =
  "text-[#5A4ED8] decoration-[#5A4ED8]/40 hover:text-[#0D0D1A] hover:decoration-[#0D0D1A] focus-visible:outline-[#5A4ED8]";

export default function ServiceArea() {
  return (
    <section className="bg-white py-24">
      <JsonLd data={faqJsonLd(homeFaq)} />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          {/* Zone d'intervention */}
          <div>
            <span className="text-[#7C6EFA] font-semibold text-sm uppercase tracking-widest">
              Zone d&apos;intervention
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold text-[#0D0D1A] mt-3 mb-6 leading-tight">
              Votre prestataire IT à Angers et en Maine-et-Loire
            </h2>
            <p className="text-gray-600 leading-relaxed mb-5">
              Léa Numérique accompagne les entreprises, collectivités et établissements de
              santé de l&apos;Anjou pour leurs abonnements télécoms et leurs projets de téléphonie IP, de réseau,
              d&apos;informatique et de cybersécurité. Nous intervenons sur site pour les audits, les installations et la maintenance ;
              notre télémaintenance sécurisée prend le relais pour le support au quotidien.
            </p>
            <p className="text-gray-600 leading-relaxed mb-8">
              Au-delà du Maine-et-Loire, nous intervenons partout en France, sur site ou à distance, notamment
              pour les organisations multi-sites.
            </p>
            <ul className="space-y-3 mb-8">
              {areas.map((area) => (
                <li key={area} className="flex items-center gap-3 text-[#0D0D1A]">
                  <MapPin className="w-4 h-4 text-[#7C6EFA] flex-shrink-0" aria-hidden="true" />
                  {area}
                </li>
              ))}
            </ul>
            <address className="not-italic bg-[#F5F4FF] rounded-2xl p-5 text-gray-600 text-sm leading-relaxed mb-8">
              <strong className="text-[#0D0D1A]">{site.name}</strong>{" "}
              <br />
              {site.address.street}, {site.address.postalCode} {site.address.city}{" "}
              <br />
              <a href={`tel:${site.phone}`} className="inline-flex items-center gap-2 mt-2 text-[#5A4ED8] font-semibold hover:underline">
                <Phone className="w-4 h-4" aria-hidden="true" />
                {site.phoneDisplay}
              </a>
            </address>
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 bg-[#7C6EFA] hover:bg-[#5A4ED8] text-white px-8 py-4 rounded-full font-semibold transition-colors"
            >
              Demander un devis gratuit
              <ArrowRight className="w-4 h-4" aria-hidden="true" />
            </Link>
          </div>

          {/* FAQ */}
          <div>
            <span className="text-[#7C6EFA] font-semibold text-sm uppercase tracking-widest">FAQ</span>
            <h2 className="text-3xl sm:text-4xl font-bold text-[#0D0D1A] mt-3 mb-6 leading-tight">
              Questions fréquentes
            </h2>
            <div className="space-y-3">
              {homeFaq.map((item) => (
                <details key={item.question} className="group bg-[#F5F4FF] rounded-2xl">
                  <summary className="flex items-center justify-between gap-4 cursor-pointer list-none p-5 font-semibold text-[#0D0D1A] rounded-2xl [&::-webkit-details-marker]:hidden focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#5A4ED8]">
                    <h3 className="text-base">{frenchSpacing(item.question)}</h3>
                    <span className="text-[#5A4ED8] text-xl transition-transform group-open:rotate-45" aria-hidden="true">+</span>
                  </summary>
                  <p className="px-5 pb-5 text-gray-600 text-sm leading-relaxed">
                    <RichText text={item.answer} linkClassName={lightLink} />
                  </p>
                </details>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
