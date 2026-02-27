"use client";

import { Headset, ShieldCheck, Network, TrendingUp, Handshake, Settings } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { useScrollReveal } from "@/hooks/useScrollReveal";

const features: { icon: LucideIcon; title: string; description: string }[] = [
  {
    icon: Headset,
    title: "Support réactif",
    description: "Une équipe disponible pour répondre à vos besoins techniques rapidement.",
  },
  {
    icon: ShieldCheck,
    title: "Sécurité garantie",
    description: "Protection de vos infrastructures avec les meilleures solutions du marché.",
  },
  {
    icon: Network,
    title: "Infrastructure fiable",
    description: "Des réseaux robustes, dimensionnés et optimisés pour votre activité.",
  },
  {
    icon: TrendingUp,
    title: "Performance IT",
    description: "Améliorez la productivité de vos équipes grâce à des outils adaptés.",
  },
  {
    icon: Handshake,
    title: "Partenaires certifiés",
    description: "Accès aux meilleures marques technologiques avec des tarifs préférentiels.",
  },
  {
    icon: Settings,
    title: "Maintenance préventive",
    description: "Suivi proactif de vos équipements pour anticiper les pannes.",
  },
];

export default function Features() {
  const ref = useScrollReveal();

  return (
    <section ref={ref} className="bg-[#F5F4FF] py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <span className="text-[#7C6EFA] font-semibold text-sm uppercase tracking-widest">
            Pourquoi nous choisir ?
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold text-[#0D0D1A] mt-3 mb-4">
            Une expertise reconnue
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Nous mettons notre savoir-faire au service de votre transformation
            numérique avec une approche humaine et technique.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature) => (
            <div
              key={feature.title}
              className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-200 group"
            >
              <div className="w-12 h-12 rounded-xl bg-[#7C6EFA]/10 flex items-center justify-center mb-4 group-hover:bg-[#7C6EFA] transition-colors duration-200">
                <feature.icon className="text-[#7C6EFA] group-hover:text-white w-5 h-5 transition-colors duration-200" />
              </div>
              <h3 className="text-[#0D0D1A] font-semibold text-lg mb-2">
                {feature.title}
              </h3>
              <p className="text-gray-500 text-sm leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
