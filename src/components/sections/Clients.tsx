"use client";

import { Landmark, School, Stethoscope, Briefcase, Factory, Scale } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { useScrollReveal } from "@/hooks/useScrollReveal";

const clients: { icon: LucideIcon; label: string }[] = [
  { icon: Landmark, label: "Mairies & Collectivités" },
  { icon: School, label: "Collèges & Lycées" },
  { icon: Stethoscope, label: "EHPAD & Santé" },
  { icon: Briefcase, label: "Entreprises PME/PMI" },
  { icon: Factory, label: "Industries" },
  { icon: Scale, label: "Notaires & Libéraux" },
];

export default function Clients() {
  const ref = useScrollReveal();

  return (
    <section ref={ref} className="bg-[#F5F4FF] py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <span className="text-[#7C6EFA] font-semibold text-sm uppercase tracking-widest">
            Ils nous font confiance
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold text-[#0D0D1A] mt-3 mb-4">
            Nous accompagnons tous types d&apos;organisations
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Collectivités, établissements de santé, entreprises, professions
            libérales — nos solutions s&apos;adaptent à chaque secteur.
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          {clients.map((client) => (
            <div
              key={client.label}
              className="bg-white rounded-2xl p-5 text-center shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-200 group"
            >
              <div className="w-12 h-12 rounded-xl bg-[#7C6EFA]/10 flex items-center justify-center mx-auto mb-3 group-hover:bg-[#7C6EFA] transition-colors duration-200">
                <client.icon className="text-[#7C6EFA] group-hover:text-white w-5 h-5 transition-colors duration-200" />
              </div>
              <p className="text-[#0D0D1A] font-medium text-sm leading-tight">
                {client.label}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
