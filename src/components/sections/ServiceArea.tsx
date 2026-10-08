import Link from "next/link";
import { MapPin, Phone, ArrowRight } from "lucide-react";
import { site } from "@/lib/site";

const areas = [
  "Angers et son agglomération",
  "Maine-et-Loire (49)",
  "Pays de la Loire",
  "France entière, sur site ou à distance",
];

const faq: { q: string; a: React.ReactNode }[] = [
  {
    q: "Où intervenez-vous ?",
    a: (
      <>
        Nous sommes basés au {site.address.street} à Angers et accompagnons les organisations de
        l&apos;Anjou et du Maine-et-Loire. Nous intervenons également partout en France, sur site ou à distance. Notre
        équipe est joignable du lundi au vendredi, de 9h à 17h30, au{" "}
        <a href={`tel:${site.phone}`} className="text-[#7C6EFA] hover:underline">{site.phoneDisplay}</a>.
      </>
    ),
  },
  {
    q: "Quelles solutions de téléphonie IP proposez-vous aux entreprises ?",
    a: (
      <>
        Nous installons des IPBX Yeastar et 3CX, des téléphones IP Yealink et les solutions Wazo et UNYC :
        standard virtuel, renvoi sur mobile, messagerie vocale et visioconférence intégrée. Nous assurons la
        mise en service et la formation de vos utilisateurs.{" "}
        <Link href="/solutions#telephonie" className="text-[#7C6EFA] hover:underline">Découvrir la téléphonie IP</Link>
      </>
    ),
  },
  {
    q: "Proposez-vous des contrats de maintenance informatique ?",
    a: (
      <>
        Oui. Nos contrats de maintenance sont personnalisés selon votre structure : helpdesk téléphonique
        dédié, télémaintenance sécurisée, intervention sur site, suivi avec rapports mensuels et gestion de
        votre parc matériel.{" "}
        <Link href="/services#maintenance" className="text-[#7C6EFA] hover:underline">Nos contrats de maintenance</Link>
      </>
    ),
  },
  {
    q: "Comment protéger une PME ou une collectivité contre les cyberattaques ?",
    a: (
      <>
        Nous commençons par un audit de sécurité, puis déployons les protections adaptées : pare-feu
        Fortinet, antivirus et EDR entreprise, filtrage web et DNS, sauvegarde externalisée chiffrée et, si
        besoin, un plan de reprise d&apos;activité (PRA).{" "}
        <Link href="/services#securite" className="text-[#7C6EFA] hover:underline">Nos services de sécurité informatique</Link>
      </>
    ),
  },
  {
    q: "Pouvez-vous reprendre ou faire évoluer notre installation existante ?",
    a: (
      <>
        Oui. Nous réalisons d&apos;abord un audit de votre infrastructure existante (téléphonie, réseau,
        postes, sécurité), puis vous remettons des préconisations personnalisées et, si nécessaire, un plan
        de transformation IT par étapes.{" "}
        <Link href="/services#conseil" className="text-[#7C6EFA] hover:underline">Conseil et audit informatique</Link>
      </>
    ),
  },
  {
    q: "Travaillez-vous avec les collectivités et les établissements de santé ?",
    a: (
      <>
        Oui. Nous accompagnons des mairies et collectivités, des collèges et lycées, des EHPAD et
        établissements de santé, ainsi que des PME/PMI, des industries, des notaires et des professions
        libérales. Chaque solution est adaptée aux contraintes du secteur.
      </>
    ),
  },
  {
    q: "Le devis est-il gratuit ? Sous quel délai répondez-vous ?",
    a: (
      <>
        Oui, le devis est gratuit et sans engagement. Nous vous répondons sous 24h ouvrées et organisons si
        nécessaire une visite ou un appel de diagnostic.{" "}
        <Link href="/contact" className="text-[#7C6EFA] hover:underline">Demander un devis gratuit</Link>
      </>
    ),
  },
];

export default function ServiceArea() {
  return (
    <section className="bg-white py-24">
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
              santé de l&apos;Anjou dans leurs projets de téléphonie IP, de réseau, d&apos;informatique et de
              cybersécurité. Nous intervenons sur site pour les audits, les installations et la maintenance ;
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
              <strong className="text-[#0D0D1A]">{site.name}</strong>
              <br />
              {site.address.street}, {site.address.postalCode} {site.address.city}
              <br />
              <a href={`tel:${site.phone}`} className="inline-flex items-center gap-2 mt-2 text-[#7C6EFA] font-semibold hover:underline">
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
              {faq.map((item) => (
                <details key={item.q} className="group bg-[#F5F4FF] rounded-2xl">
                  <summary className="flex items-center justify-between gap-4 cursor-pointer list-none p-5 font-semibold text-[#0D0D1A]">
                    <h3 className="text-base">{item.q}</h3>
                    <span className="text-[#7C6EFA] text-xl transition-transform group-open:rotate-45" aria-hidden="true">+</span>
                  </summary>
                  <p className="px-5 pb-5 text-gray-600 text-sm leading-relaxed">{item.a}</p>
                </details>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
