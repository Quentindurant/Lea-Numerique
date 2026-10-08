import Image from "next/image";
import Link from "next/link";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import ProcessTimeline from "@/components/ui/ProcessTimeline";
import { Wrench, Cpu, ShieldCheck, MessageSquare, ArrowRight, CheckCircle2 } from "lucide-react";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Maintenance informatique entreprise Angers",
  description:
    "Audit, installation, maintenance et sécurité de votre parc IT à Angers et en Maine-et-Loire : helpdesk dédié, télémaintenance, intervention sur site.",
  path: "/services",
});

const services = [
  

  {
    id: "01",
    slug: "conseil",
    Icon: MessageSquare,
    title: "Conseil & Accompagnement",
    heading: "Conseil et audit informatique",
    tagline: "Des choix éclairés pour votre organisation.",
    image: "/images/conseil-audit-informatique.webp",
    alt: "La mascotte Léa Numérique conseille deux utilisateurs face à un problème informatique",
    related: [{ href: "/solutions", label: "Toutes nos solutions IT" }],
    description:
      "Nos experts vous accompagnent dans la stratégie IT de votre organisation : audit, préconisations, plan de transformation numérique.",
    items: [
      "Audit de l'infrastructure existante",
      "Préconisations personnalisées",
      "Plan de transformation IT",
      "Accompagnement au changement",
      "Veille technologique",
      "Relation partenaires & constructeurs",
    ],
  },
  {
    id: "02",
    slug: "installation",
    Icon: Wrench,
    title: "Installation & Déploiement",
    heading: "Installation réseau, téléphonie et postes de travail",
    tagline: "On s'occupe de tout, du câble au cloud.",
    image: "/images/installation-deploiement-it.webp",
    alt: "La mascotte Léa Numérique, casque de chantier, intervient sur une armoire de câblage",
    related: [
      { href: "/solutions#telephonie", label: "Téléphonie IP" },
      { href: "/solutions#reseaux", label: "Réseaux et Wi-Fi" },
      { href: "/solutions#informatique", label: "Postes de travail" },
    ],
    description:
      "Nous prenons en charge l'intégralité de l'installation de vos équipements IT. Câblage, configuration, tests — vous n'avez qu'à utiliser.",
    items: [
      "Câblage réseau RJ45 et fibre optique",
      "Configuration des équipements actifs",
      "Déploiement de postes de travail",
      "Mise en service téléphonie IP",
      "Tests et recette technique",
      "Formation des utilisateurs",
    ],
  },
    {
    id: "03",
    slug: "maintenance",
    Icon: Cpu,
    title: "Maintenance & Support",
    heading: "Maintenance informatique et support",
    tagline: "Réactif quand vous en avez besoin.",
    image: "/images/maintenance-support-informatique.webp",
    alt: "La mascotte Léa Numérique répond au téléphone devant un ordinateur portable",
    related: [
      { href: "/solutions#informatique", label: "Matériel informatique professionnel" },
      { href: "/contact", label: "Demander un contrat de maintenance" },
    ],
    description:
      "Un contrat de maintenance adapté à votre structure, avec un helpdesk disponible et des interventions rapides sur site à Angers et en Maine-et-Loire, ou en télémaintenance sécurisée partout en France.",
    items: [
      "Contrat de maintenance personnalisé",
      "Helpdesk téléphonique dédié",
      "Intervention sur site sous 4h",
      "Télémaintenance sécurisée",
      "Suivi et rapports mensuels",
      "Gestion du parc matériel",
    ],
  },
  {
    id: "04",
    slug: "securite",
    Icon: ShieldCheck,
    title: "Sécurité & Protection",
    heading: "Sécurité informatique et sauvegarde",
    tagline: "Votre sécurité n'est pas négociable.",
    image: "/images/securite-informatique.webp",
    alt: "La mascotte Léa Numérique sécurise un poste de travail : bouclier d'alerte, clé et cadenas",
    related: [{ href: "/solutions#cybersecurite", label: "Nos solutions de cybersécurité" }],
    description:
      "Nous déployons des solutions de cybersécurité éprouvées pour protéger vos données et votre infrastructure contre les menaces modernes.",
    items: [
      "Pare-feu nouvelle génération (Fortinet)",
      "Antivirus & EDR entreprise",
      "Sauvegarde externalisée chiffrée",
      "Audit de sécurité complet",
      "Filtrage web et DNS",
      "Plan de reprise d'activité (PRA)",
    ],
  },
];


export default function Services() {
  return (
    <div className="bg-[#0D0D1A]">

      {/* Hero */}
      <section className="pt-48 pb-24">
        <div className="max-w-6xl mx-auto px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-end">
            <div>
              <div className="inline-flex items-center gap-2 border border-[#7C6EFA]/40 rounded-full px-4 py-1.5 mb-10">
                <span className="w-1.5 h-1.5 rounded-full bg-[#7C6EFA] animate-pulse" />
                <span className="text-[#7C6EFA] text-sm">Ce que nous faisons</span>
              </div>
              <h1 className="text-6xl sm:text-7xl font-bold text-white leading-none">
                Nos services IT<br />
                <span className="block mt-3 text-[#7C6EFA] text-4xl sm:text-5xl leading-tight">à Angers et en Anjou</span>
              </h1>
            </div>
            <p className="text-white/70 text-xl leading-relaxed">
              De l&apos;audit initial à la maintenance quotidienne, Léa Numérique accompagne
              les organisations d&apos;Angers et du Maine-et-Loire, sur site ou à distance,
              avec réactivité et expertise.
            </p>
          </div>
        </div>
      </section>

      {/* Services — image + contenu alternés */}
      {services.map((service, index) => {
        const { Icon } = service;
        const isEven = index % 2 === 0;
        return (
          <div key={service.id} id={service.slug} className="border-t border-white/[0.06] scroll-mt-24">
            <div className="max-w-6xl mx-auto px-6 lg:px-8 py-20 lg:py-28">
              <div
                className={`grid grid-cols-1 lg:grid-cols-2 gap-16 items-center ${
                  !isEven ? "lg:[&>*:first-child]:order-2" : ""
                }`}
              >
                {/* Image */}
                <div className="relative">
                  <div className="relative rounded-2xl overflow-hidden aspect-[4/3]">
                    <Image
                      src={service.image}
                      alt={service.alt}
                      fill
                      sizes="(min-width: 1024px) 50vw, 100vw"
                      className="object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0D0D1A]/70 to-transparent" />
                    <div className="absolute bottom-5 left-5 flex items-center gap-3 bg-[#0D0D1A]/80 backdrop-blur-sm border border-white/10 rounded-xl px-4 py-3">
                      <div className="w-9 h-9 rounded-lg bg-[#7C6EFA] flex items-center justify-center">
                        <Icon className="text-white w-4 h-4" />
                      </div>
                      <span className="text-white text-sm font-medium">{service.title}</span>
                    </div>
                  </div>
                </div>

                {/* Contenu */}
                <div className={!isEven ? "lg:col-start-1 lg:row-start-1" : ""}>
                  <div className="flex items-center gap-3 mb-5">
                    <div className="w-10 h-10 rounded-xl bg-[#7C6EFA]/10 border border-[#7C6EFA]/20 flex items-center justify-center">
                      <Icon className="text-[#7C6EFA] w-5 h-5" />
                    </div>
                    <span className="text-white/15 font-mono text-2xl font-bold">{service.id}</span>
                  </div>
                  <h2 className="text-3xl font-bold text-white mb-2">{service.heading}</h2>
                  <p className="text-[#7C6EFA]/80 text-sm italic mb-5">&ldquo;{service.tagline}&rdquo;</p>
                  <p className="text-white/70 text-sm leading-relaxed mb-8">{service.description}</p>

                  <Card className="bg-white/[0.03] border-white/[0.07] p-5">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {service.items.map((item) => (
                        <div key={item} className="flex items-start gap-2.5">
                          <CheckCircle2 className="text-[#7C6EFA] w-4 h-4 mt-0.5 flex-shrink-0" />
                          <span className="text-white/60 text-sm">{item}</span>
                        </div>
                      ))}
                    </div>
                  </Card>

                  <div className="flex flex-wrap gap-x-6 gap-y-2 mt-6">
                    {service.related.map((link) => (
                      <Link
                        key={link.href}
                        href={link.href}
                        className="inline-flex items-center gap-2 text-[#7C6EFA] hover:text-white font-semibold text-sm transition-colors"
                      >
                        {link.label}
                        <ArrowRight className="w-3 h-3" aria-hidden="true" />
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      })}

      {/* Processus */}
      <div className="border-t border-white/[0.06]">
        <div className="max-w-6xl mx-auto px-6 lg:px-8 py-24">
          <div className="grid grid-cols-1 lg:grid-cols-[260px_1fr] gap-16 lg:gap-24">
            <div>
              <Badge className="mb-4 bg-[#7C6EFA]/15 text-[#7C6EFA] border-[#7C6EFA]/30 hover:bg-[#7C6EFA]/15">
                Processus
              </Badge>
              <h2 className="text-3xl font-bold text-white leading-tight">
                Comment se déroule<br />votre projet IT ?
              </h2>
            </div>
            <ProcessTimeline />
          </div>
        </div>
      </div>

      {/* CTA */}
      <div className="border-t border-white/[0.06]">
        <div className="max-w-6xl mx-auto px-6 lg:px-8 py-24">
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-10">
            <div>
              <h2 className="text-4xl font-bold text-white mb-3">
                Besoin d&apos;un service sur mesure ?
              </h2>
              <p className="text-white/40">Chaque structure est unique. Parlons de vos besoins.</p>
            </div>
            <div className="flex flex-col sm:flex-row gap-4 flex-shrink-0">
              <Link
                href="/contact"
                className="bg-[#7C6EFA] hover:bg-[#5A4ED8] text-white px-8 py-4 rounded-full font-semibold transition-all duration-200 text-center inline-flex items-center gap-2 shadow-lg shadow-[#7C6EFA]/20"
              >
                Prendre contact <ArrowRight className="w-4 h-4" />
              </Link>
              <a
                href="mailto:hello@lea-numerique.fr"
                className="text-white/50 hover:text-white px-8 py-4 rounded-full font-semibold transition-colors text-center border border-white/10 hover:border-white/20"
              >
                hello@lea-numerique.fr
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
