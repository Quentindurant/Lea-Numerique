import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Phone } from "lucide-react";
import Breadcrumbs from "@/components/ui/Breadcrumbs";
import { frenchSpacing as fr } from "@/components/ui/RichText";
import ArrowLabel from "@/components/solutions/ArrowLabel";
import { HUB_BREADCRUMB, SERVICES_LINK, SOLUTION_ICONS } from "@/components/solutions/shared";
import { JsonLd } from "@/components/seo/JsonLd";
import { breadcrumbJsonLd } from "@/lib/jsonld";
import { getSolutionContent } from "@/content/solutions";
import { pageMetadata } from "@/lib/seo";
import { site } from "@/lib/site";
import { SOLUTIONS, type SolutionSlug } from "@/lib/solutions";

export const metadata = pageMetadata({
  title: "Nos solutions télécom et IT à Angers",
  description:
    "Opérateur télécom, téléphonie IP, réseaux, matériel informatique et cybersécurité : nos solutions pour les professionnels du Maine-et-Loire. Devis gratuit.",
  path: "/solutions",
});

// Résumés propres à la page hub : le détail de chaque domaine est sur sa page dédiée.
// Titre H2, ancre héritée (#telephonie...), lien, image et marques viennent du registre et du contenu des pages.
const summaries: Record<SolutionSlug, { summary: string; points: string[] }> = {
  "telephonie-ip": {
    summary:
      "Avec un standard IP, la voix passe par le réseau informatique : chaque poste suit son utilisateur, au bureau comme en télétravail. Nous installons des IPBX Yeastar ou 3CX et des téléphones Yealink, fixes ou sans fil, puis formons vos équipes.",
    points: ["Standard virtuel et messagerie vocale", "Renvoi des appels sur mobile", "Visioconférence intégrée", "Centralisation des appels"],
  },
  "operateur-telecom": {
    summary:
      "Lignes fixes, trunks SIP pour votre standard, forfaits mobiles et accès internet fibre : nous fournissons vos abonnements télécoms professionnels et prenons en charge la portabilité de vos numéros. Le même interlocuteur suit aussi votre standard et votre réseau.",
    points: ["Lignes fixes et trunks SIP", "Portabilité de vos numéros", "Forfaits mobiles professionnels", "Accès internet fibre pro"],
  },
  "reseaux-wifi": {
    summary:
      "Téléphones, postes et serveurs dépendent tous du réseau local. Nous dimensionnons le câblage et la couverture Wi-Fi selon vos locaux, séparons les usages en VLAN et donnons la priorité à la voix avec la QoS.",
    points: ["Câblage RJ45 et fibre optique", "Wi-Fi professionnel", "VPN entre vos sites", "Monitoring réseau"],
  },
  "materiel-informatique": {
    summary:
      "Un portable de collaborateur nomade n'a pas les mêmes contraintes qu'un serveur de fichiers. Nous choisissons avec vous le matériel HP, Lenovo ou Dell adapté à chaque usage et assurons son déploiement, migration Windows comprise.",
    points: ["Postes de travail et portables", "Serveurs et NAS", "Imprimantes professionnelles", "Maintenance préventive"],
  },
  cybersecurite: {
    summary:
      "Aucun outil ne protège seul contre toutes les menaces : la sécurité se construit par couches. Après un audit, nous combinons les protections adaptées à vos risques, du pare-feu Fortinet à la sauvegarde externalisée chiffrée.",
    points: ["Antivirus et EDR entreprise", "Filtrage web et DNS", "Plan de reprise d'activité (PRA)", "Vidéosurveillance des locaux"],
  },
};

const focusRing = "focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#7C6EFA]";

export default function Solutions() {
  return (
    <div className="bg-[#0D0D1A]">
      <JsonLd data={breadcrumbJsonLd(HUB_BREADCRUMB)} />
      {/* Hero */}
      <section className="pt-28 pb-20 sm:pt-32 lg:pt-36 lg:pb-28">
        <div className="max-w-6xl mx-auto px-6 lg:px-8">
          <Breadcrumbs items={HUB_BREADCRUMB} className="mb-10 lg:mb-14" />
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-12 items-end">
            <div>
              <div className="inline-flex items-center gap-2 border border-[#7C6EFA]/40 rounded-full px-4 py-1.5 mb-10">
                <span className="w-1.5 h-1.5 rounded-full bg-[#7C6EFA] motion-safe:animate-pulse" aria-hidden="true" />
                <span className="text-[#7C6EFA] text-sm">Nos domaines d&apos;expertise</span>
              </div>
              {/* Tailles choisies pour que chaque ligne tienne sans mot isolé, du mobile (390 px) au bureau */}
              <h1 className="text-[2.5rem] sm:text-6xl lg:text-[3.5rem] xl:text-[4rem] font-bold text-white leading-none">
                Nos solutions télécom et IT{" "}
                <br />
                <span className="block mt-3 text-[#7C6EFA] text-3xl sm:text-5xl lg:text-[2.5rem] xl:text-5xl leading-tight">
                  à Angers et en Anjou
                </span>
              </h1>
            </div>
            <p className="text-white/70 text-lg sm:text-xl leading-relaxed pb-2">
              {fr(
                "Abonnements télécoms, téléphonie, réseau, matériel et sécurité : Léa Numérique prend en charge ces cinq domaines pour les entreprises, les collectivités et les établissements de santé du Maine-et-Loire. Chacun a sa page détaillée, avec notre méthode et un exemple de déroulé.",
              )}
            </p>
          </div>
        </div>
      </section>

      {/* Les domaines (les id reprennent les anciennes ancres /solutions#telephonie, etc.) */}
      <div className="border-t border-white/[0.06]">
        <div className="max-w-6xl mx-auto px-6 lg:px-8 py-20 lg:py-28">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {SOLUTIONS.map((entry, index) => {
              const content = getSolutionContent(entry.slug);
              const { summary, points } = summaries[entry.slug];
              const Icon = SOLUTION_ICONS[entry.slug];
              const headingId = `${entry.slug}-titre`;
              const lastAlone = SOLUTIONS.length % 2 === 1 && index === SOLUTIONS.length - 1;
              return (
                <section
                  key={entry.slug}
                  id={entry.legacyAnchor}
                  aria-labelledby={headingId}
                  className={`scroll-mt-24 flex flex-col overflow-hidden rounded-3xl border border-white/[0.06] bg-[#1A1A2E] ${
                    lastAlone ? "lg:col-span-2 lg:w-[calc(50%-1rem)] lg:justify-self-center" : ""
                  }`}
                >
                  <div className="relative h-48 sm:h-56">
                    <Image
                      src={content.hero.image.src}
                      alt={content.hero.image.alt}
                      fill
                      sizes="(min-width: 1152px) 544px, (min-width: 1024px) 50vw, 100vw"
                      className="object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#1A1A2E] via-[#1A1A2E]/20 to-transparent" aria-hidden="true" />
                    <div className="absolute top-4 left-4 w-12 h-12 rounded-xl bg-[#7C6EFA] flex items-center justify-center">
                      <Icon className="text-white w-5 h-5" aria-hidden="true" />
                    </div>
                  </div>

                  <div className="flex flex-1 flex-col p-6 sm:p-8">
                    <span className="text-white/50 font-mono text-sm" aria-hidden="true">
                      {String(index + 1).padStart(2, "0")} /
                    </span>
                    <h2 id={headingId} className="text-2xl sm:text-3xl font-bold text-white mt-2">
                      {entry.label}
                    </h2>
                    <p className="text-white/70 leading-relaxed mt-4">{fr(summary)}</p>

                    <ul className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2.5 mt-6">
                      {points.map((point) => (
                        <li key={point} className="flex items-start gap-3">
                          <span className="w-1.5 h-1.5 rounded-full bg-[#7C6EFA] flex-shrink-0 mt-2" aria-hidden="true" />
                          <span className="text-white/70 text-sm leading-relaxed">{fr(point)}</span>
                        </li>
                      ))}
                    </ul>

                    {content.brands?.items.length ? (
                      <div className="flex flex-wrap items-center gap-x-3 gap-y-2 mt-6">
                        <span className="text-white/60 text-xs uppercase tracking-widest" id={`${entry.slug}-marques`}>
                          Marques
                        </span>
                        <ul className="flex flex-wrap gap-2" aria-labelledby={`${entry.slug}-marques`}>
                          {content.brands.items.map((brand) => (
                            <li key={brand.name} className="text-xs text-white/70 border border-white/15 px-3 py-1 rounded-full">
                              {brand.name}
                            </li>
                          ))}
                        </ul>
                      </div>
                    ) : null}

                    <div className="mt-auto pt-8">
                      <Link
                        href={entry.path}
                        className={`group text-[#7C6EFA] hover:text-white font-semibold transition-colors rounded-sm ${focusRing}`}
                      >
                        <ArrowLabel text={entry.anchor} />
                      </Link>
                    </div>
                  </div>
                </section>
              );
            })}
          </div>
        </div>
      </div>

      {/* Lien entre les domaines */}
      <section aria-labelledby="domaines-lies" className="border-t border-white/[0.06]">
        <div className="max-w-6xl mx-auto px-6 lg:px-8 py-20 lg:py-28">
          <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_minmax(0,2fr)] gap-6 lg:gap-16">
            <h2 id="domaines-lies" className="text-3xl sm:text-4xl font-bold text-white leading-tight">
              Cinq domaines qui fonctionnent ensemble
            </h2>
            <div className="space-y-5">
              <p className="text-white/70 leading-relaxed">
                Un trunk SIP passe par votre accès internet et un téléphone IP a besoin d&apos;un réseau qui
                priorise la voix ; un poste de travail, lui, n&apos;est protégé que si le pare-feu et la sauvegarde
                suivent. Avec un seul interlocuteur pour l&apos;ensemble,
                un incident ne passe pas d&apos;un prestataire à l&apos;autre avant d&apos;être traité.
              </p>
              <p className="text-white/70 leading-relaxed">
                {fr(
                  "Quel que soit le domaine, le projet suit les mêmes étapes : audit de l'existant, proposition chiffrée, installation, formation des utilisateurs, puis maintenance.",
                )}
              </p>
              <p>
                <Link
                  href={SERVICES_LINK.path}
                  className={`group text-[#7C6EFA] hover:text-white font-semibold transition-colors rounded-sm ${focusRing}`}
                >
                  <ArrowLabel text={SERVICES_LINK.anchor} />
                </Link>
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section aria-labelledby="solutions-contact" className="border-t border-white/[0.06]">
        <div className="max-w-6xl mx-auto px-6 lg:px-8 py-20 lg:py-28">
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-10">
            <div className="max-w-2xl">
              <h2 id="solutions-contact" className="text-3xl sm:text-4xl font-bold text-white leading-tight mb-4">
                {fr("Un projet ou une installation à reprendre ?")}
              </h2>
              <p className="text-white/70 leading-relaxed">
                {fr("Décrivez-nous votre situation : nous vous répondons sous 24h ouvrées. Le devis est gratuit et sans engagement.")}
              </p>
            </div>
            <div className="flex w-full sm:w-auto flex-col sm:flex-row gap-4 flex-shrink-0">
              <Link
                href="/contact"
                className={`inline-flex items-center justify-center gap-2 bg-[#7C6EFA] hover:bg-[#5A4ED8] text-white px-8 py-4 rounded-full font-semibold transition-all duration-200 shadow-lg shadow-[#7C6EFA]/20 ${focusRing}`}
              >
                Demander un devis
                <ArrowRight className="w-4 h-4" aria-hidden="true" />
              </Link>
              <a
                href={`tel:${site.phone}`}
                className={`inline-flex items-center justify-center gap-2 border border-white/20 hover:border-[#7C6EFA]/60 text-white/80 hover:text-white px-8 py-4 rounded-full font-semibold transition-colors ${focusRing}`}
              >
                <Phone className="w-4 h-4" aria-hidden="true" />
                <span className="sr-only">Appeler le </span>
                {fr(site.phoneDisplay)}
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
