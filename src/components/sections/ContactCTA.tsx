"use client";

import Link from "next/link";
import { Phone, Mail, Clock, MapPin } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { useScrollReveal } from "@/hooks/useScrollReveal";

export default function ContactCTA() {
  const ref = useScrollReveal();

  return (
    <section ref={ref} className="bg-white py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-br from-[#0D0D1A] to-[#1A1A2E] rounded-3xl p-12 lg:p-16 relative overflow-hidden">
          {/* Background decoration */}
          <div className="absolute top-0 right-0 w-80 h-80 bg-[#7C6EFA]/15 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
          <div className="absolute bottom-0 left-0 w-60 h-60 bg-[#7C6EFA]/10 rounded-full blur-2xl translate-y-1/2 -translate-x-1/2" />

          <div className="relative grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <span className="text-[#7C6EFA] font-semibold text-sm uppercase tracking-widest">
                Parlons de votre projet
              </span>
              <h2 className="text-3xl sm:text-4xl font-bold text-white mt-3 mb-5 leading-tight">
                Parlons de votre besoin dès aujourd&apos;hui.
              </h2>
              <p className="text-white/70 leading-relaxed mb-8">
                Que vous souhaitiez moderniser votre téléphonie, sécuriser votre
                réseau ou obtenir du matériel informatique, nous avons la solution
                adaptée à votre structure.
              </p>
              <div className="flex flex-col sm:flex-row gap-6">
                <Link
                  href="/contact"
                  className="bg-[#7C6EFA] hover:bg-[#5A4ED8] text-white px-8 py-4 rounded-full font-semibold transition-all duration-200 text-center shadow-lg shadow-[#7C6EFA]/25"
                >
                  Prendre contact
                </Link>
                <a
                  href="tel:02 19 23 06 91"
                  className="inline-flex items-center border border-white/10 hover:border-[#7C6EFA] text-white px-8 py-4 rounded-full font-semibold transition-all duration-200 text-center hover:text-[#7C6EFA]"
                >
                  <Phone className="w-5 h-5 mr-4" />Nous appeler
                </a>
              </div>
            </div>

            {/* Quick contact info */}
            <div className="space-y-4">
              {(
                [
                  {
                    icon: Mail,
                    label: "Email",
                    value: "hello@lea-numerique.fr",
                    href: "mailto:hello@lea-numerique.fr",
                  },
                  {
                    icon: Clock,
                    label: "Disponibilité",
                    value: "Lun–Ven, 9h–17h30",
                    href: null,
                  },
                  {
                    icon: MapPin,
                    label: "Zone d'intervention",
                    value: "France entière",
                    href: null,
                  },
                ] as { icon: LucideIcon; label: string; value: string; href: string | null }[]
              ).map((item) => (
                <div
                  key={item.label}
                  className="flex items-center gap-4 bg-white/5 backdrop-blur-sm rounded-2xl p-4"
                >
                  <div className="w-10 h-10 rounded-xl bg-[#7C6EFA]/20 flex items-center justify-center flex-shrink-0">
                    <item.icon className="text-[#7C6EFA] w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-white/50 text-xs uppercase tracking-wide">
                      {item.label}
                    </p>
                    {item.href ? (
                      <a
                        href={item.href}
                        className="text-white font-medium hover:text-[#7C6EFA] transition-colors"
                      >
                        {item.value}
                      </a>
                    ) : (
                      <p className="text-white font-medium">{item.value}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
