"use client";

import Image from "next/image";
import Link from "next/link";
import { PhoneCall, Network, Laptop, ShieldCheck, ArrowRight } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { useScrollReveal } from "@/hooks/useScrollReveal";

const solutions: { title: string; description: string; image: string; icon: LucideIcon; features: string[] }[] = [
  {
    title: "Téléphonie",
    description:
      "Terminaux fixes, sans fil et répondants aux exigences de mobilité ou télétravail.",
    image: "/images/téléphonie.jpg",
    icon: PhoneCall,
    features: ["Centralisation des appels", "Visioconférence", "Mobilité"],
  },
  {
    title: "Réseau",
    description:
      "Tous les équipements pour une connectivité optimale.",
    image: "/images/réseau.jpg",
    icon: Network,
    features: ["Wi-Fi professionnel", "VPN sécurisé", "Monitoring 24/7"],
  },
  {
    title: "Informatique",
    description:
      "Ordinateurs, périphériques, accessoires adaptés à vos besoins.",
    image: "/images/informatique.png",
    icon: Laptop,
    features: ["Matériel certifié", "Maintenance préventive", "Support technique"],
  },
  {
    title: "Cybersécurité",
    description:
      "Solutions avancées pour protéger votre entreprise.",
    image: "/images/cyber.jpg",
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
            Des solutions IT complètes
          </h2>
          <p className="text-white/70 max-w-2xl mx-auto">
            De la téléphonie à la cybersécurité, nous couvrons tous vos besoins
            en infrastructure numérique.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {solutions.map((solution) => (
            <div
              key={solution.title}
              className="group bg-[#1A1A2E] rounded-3xl overflow-hidden hover:shadow-2xl hover:shadow-[#7C6EFA]/10 transition-all duration-300"
            >
              <div className="relative h-48 overflow-hidden">
                <Image
                  src={solution.image}
                  alt={solution.title}
                  fill
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
                  href={`/solutions#${solution.title}`}
                  className="inline-flex items-center gap-2 text-[#7C6EFA] text-sm font-semibold hover:gap-3 transition-all"
                >
                  En savoir plus <ArrowRight className="w-3 h-3" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
