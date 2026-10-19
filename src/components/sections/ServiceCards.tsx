"use client";

import Image from "next/image";
import Link from "next/link";
import { PhoneCall, Network, Laptop, ShieldCheck, RadioTower, ArrowRight } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { useScrollReveal } from "@/hooks/useScrollReveal";
import { solutionPath, type SolutionSlug } from "@/lib/solutions";

const solutions: { title: string; slug: SolutionSlug; description: string; image: string; alt: string; cta: string; icon: LucideIcon; features: string[] }[] = [
  {
    title: "Téléphonie IP d'entreprise",
    slug: "telephonie-ip",
    description:
      "Terminaux fixes, sans fil et répondant aux exigences de mobilité ou télétravail.",
    image: "/images/telephonie-ip-entreprise.webp",
    alt: "Illustration d'un standard téléphonique : opératrice avec casque, téléphone et messagerie",
    cta: "Découvrir la téléphonie IP",
    icon: PhoneCall,
    features: ["Centralisation des appels", "Visioconférence", "Mobilité"],
  },
  {
    title: "Réseaux et Wi-Fi professionnels",
    slug: "reseaux-wifi",
    description:
      "Tous les équipements pour une connectivité optimale.",
    image: "/images/reseau-wifi-professionnel.webp",
    alt: "Illustration d'un réseau Wi-Fi professionnel reliant smartphones, tablettes et ordinateurs",
    cta: "Découvrir nos solutions réseau",
    icon: Network,
    features: ["Wi-Fi professionnel", "VPN sécurisé", "Monitoring réseau"],
  },
  {
    title: "Matériel informatique professionnel",
    slug: "materiel-informatique",
    description:
      "Ordinateurs, périphériques, accessoires adaptés à vos besoins.",
    image: "/images/materiel-informatique-professionnel.webp",
    alt: "Illustration : techniciens informatiques travaillant devant des baies de serveurs",
    cta: "Découvrir notre offre informatique",
    icon: Laptop,
    features: ["Postes HP, Lenovo et Dell", "Maintenance préventive", "Support technique"],
  },
  {
    title: "Cybersécurité et protection des données",
    slug: "cybersecurite",
    description:
      "Solutions avancées pour protéger votre entreprise.",
    image: "/images/cybersecurite-entreprise.webp",
    alt: "Illustration de cybersécurité : bouclier à cadenas protégeant un ordinateur et le cloud",
    cta: "Découvrir nos solutions de cybersécurité",
    icon: ShieldCheck,
    features: ["Pare-feu Fortinet", "Audit de sécurité", "Sauvegarde sécurisée"],
  },
];

export default function ServiceCards() {
  const ref = useScrollReveal();

  return (
    <section ref={ref} className="bg-[#0D0D1A] py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <span className="text-[#7C6EFA] font-semibold text-sm uppercase tracking-widest">
            Nos domaines d&apos;expertise
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold text-white mt-3 mb-4">
            Télécoms, réseau, informatique et cybersécurité pour les professionnels
          </h2>
          <p className="text-white/70 max-w-2xl mx-auto">
            De vos lignes téléphoniques à la protection de vos données : chaque
            domaine a sa page détaillée.
          </p>
        </div>

        {/* Offre opérateur : abonnements télécoms (lignes, mobiles, fibre) */}
        <Link
          href={solutionPath("operateur-telecom")}
          className="group mb-8 flex flex-col sm:flex-row sm:items-center gap-5 rounded-3xl border border-[#7C6EFA]/25 bg-[#7C6EFA]/[0.07] p-6 sm:p-8 hover:border-[#7C6EFA]/50 hover:bg-[#7C6EFA]/15 transition-colors"
        >
          <span className="w-12 h-12 rounded-xl bg-[#7C6EFA] flex items-center justify-center flex-shrink-0">
            <RadioTower className="text-white w-5 h-5" aria-hidden="true" />
          </span>
          <span className="flex-1">
            <span className="block text-xl font-bold text-white mb-1">Opérateur télécom pour les entreprises</span>
            <span className="block text-white/70 text-sm leading-relaxed">
              Lignes fixes et trunks SIP, portabilité de vos numéros, forfaits mobiles et accès internet fibre pro,
              avec le même interlocuteur que pour votre standard.
            </span>
          </span>
          <span className="inline-flex items-center gap-2 text-[#7C6EFA] text-sm font-semibold group-hover:gap-3 transition-all flex-shrink-0">
            Découvrir notre offre opérateur <ArrowRight className="w-3 h-3" aria-hidden="true" />
          </span>
        </Link>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {solutions.map((solution) => (
            <div
              key={solution.title}
              className="group bg-[#1A1A2E] rounded-3xl overflow-hidden hover:shadow-2xl hover:shadow-[#7C6EFA]/10 transition-all duration-300"
            >
              <div className="relative h-48 overflow-hidden">
                <Image
                  src={solution.image}
                  alt={solution.alt}
                  fill
                  sizes="(min-width: 768px) 50vw, 100vw"
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#1A1A2E] to-transparent" />
                <div className="absolute top-4 left-4 w-12 h-12 rounded-xl bg-[#7C6EFA] flex items-center justify-center">
                  <solution.icon className="text-white w-5 h-5" />
                </div>
              </div>

              <div className="p-6">
                <h3 className="text-xl font-bold text-white mb-3">
                  {solution.title}
                </h3>
                <p className="text-white/70 text-sm leading-relaxed mb-4">
                  {solution.description}
                </p>
                <ul className="space-y-1.5 mb-6">
                  {solution.features.map((feature) => (
                    <li key={feature} className="flex items-center gap-2 text-sm">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#7C6EFA]" />
                      <span className="text-white/70">{feature}</span>
                    </li>
                  ))}
                </ul>
                <Link
                  href={solutionPath(solution.slug)}
                  className="inline-flex items-center gap-2 text-[#7C6EFA] text-sm font-semibold hover:gap-3 transition-all"
                >
                  {solution.cta} <ArrowRight className="w-3 h-3" aria-hidden="true" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
