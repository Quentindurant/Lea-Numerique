import type { Metadata } from "next";
import ContactForm from "@/components/ui/ContactForm";
import { Mail, Clock, MapPin, ShieldCheck } from "lucide-react";
import type { LucideIcon } from "lucide-react";

export const metadata: Metadata = {
  title: "Contact — Léa Numérique",
  description: "Contactez Léa Numérique pour vos projets IT. Devis gratuit sous 24h.",
};

const contactCards: { icon: LucideIcon; label: string; value: string; href: string | null; desc: string }[] = [
  {
    icon: Mail,
    label: "Email",
    value: "hello@lea-numerique.fr",
    href: "mailto:hello@lea-numerique.fr",
    desc: "Réponse sous 24h ouvrées",
  },
  {
    icon: Clock,
    label: "Disponibilité",
    value: "Lun – Ven, 9h – 17h30",
    href: null,
    desc: "Fermeture les week-ends",
  },
  {
    icon: MapPin,
    label: "Zone d'intervention",
    value: "France entière",
    href: null,
    desc: "Interventions sur site ou à distance",
  },
];

export default function Contact() {
  return (
    <div className="bg-[#0D0D1A] min-h-screen">

      {/* Hero */}
      <section className="relative pt-32 pb-0 overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#7C6EFA]/8 rounded-full blur-3xl" />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-16">
            <div className="inline-flex items-center gap-2 border border-[#7C6EFA]/40 rounded-full px-4 py-1.5 mb-8">
              <span className="w-1.5 h-1.5 rounded-full bg-[#7C6EFA] animate-pulse" />
              <span className="text-[#7C6EFA] text-sm">Prenons contact</span>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-end">
              <h1 className="text-5xl sm:text-6xl font-bold text-white leading-tight">
                Parlons de<br />
                <span className="text-[#7C6EFA]">votre projet</span>
              </h1>
              <p className="text-white/50 text-lg leading-relaxed">
                Remplissez le formulaire ou écrivez-nous directement.
                Nous vous répondons sous 24h avec une première analyse,
                sans engagement.
              </p>
            </div>
          </div>

          {/* Cards rapides */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {contactCards.map((card) => (
              <div
                key={card.label}
                className="bg-white/[0.03] border border-white/[0.07] rounded-2xl p-5 flex items-start gap-4"
              >
                <div className="w-10 h-10 rounded-xl bg-[#7C6EFA]/15 flex items-center justify-center flex-shrink-0">
                  <card.icon className="text-[#7C6EFA] w-4 h-4" />
                </div>
                <div>
                  <p className="text-white/40 text-xs uppercase tracking-wide mb-0.5">{card.label}</p>
                  {card.href ? (
                    <a href={card.href} className="text-white font-medium text-sm hover:text-[#7C6EFA] transition-colors">
                      {card.value}
                    </a>
                  ) : (
                    <p className="text-white font-medium text-sm">{card.value}</p>
                  )}
                  <p className="text-white/30 text-xs mt-0.5">{card.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Formulaire + étapes */}
      <section className="mt-12 py-16 border-t border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.6fr] gap-16 items-start">

            {/* Ce qui se passe après */}
            <div>
              <h2 className="text-2xl font-bold text-white mb-6">
                Ce qui se passe<br />après votre message
              </h2>
              <div className="space-y-6">
                {[
                  { num: "01", title: "On reçoit votre message", desc: "Vous recevez un accusé de réception automatique." },
                  { num: "02", title: "Analyse de votre besoin", desc: "Un expert étudie votre demande et prépare une réponse adaptée." },
                  { num: "03", title: "Prise de contact sous 24h", desc: "Nous vous rappelons ou répondons par email avec une première proposition." },
                  { num: "04", title: "Audit & devis gratuit", desc: "Si nécessaire, nous organisons une visite ou un appel de diagnostic." },
                ].map((step) => (
                  <div key={step.num} className="flex items-start gap-4">
                    <div className="w-9 h-9 rounded-full border border-[#7C6EFA]/40 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-[#7C6EFA] text-xs font-bold">{step.num}</span>
                    </div>
                    <div>
                      <p className="text-white font-medium text-sm mb-1">{step.title}</p>
                      <p className="text-white/45 text-sm leading-relaxed">{step.desc}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-10 bg-[#7C6EFA]/10 border border-[#7C6EFA]/20 rounded-2xl p-5">
                <div className="flex items-center gap-2 mb-2">
                  <ShieldCheck className="text-[#7C6EFA] w-4 h-4" />
                  <p className="text-white font-semibold text-sm">Devis 100% gratuit</p>
                </div>
                <p className="text-white/50 text-sm leading-relaxed">
                  Aucun engagement, aucun frais de diagnostic. Nous vous proposons
                  toujours une solution avant tout paiement.
                </p>
              </div>
            </div>

            {/* Formulaire */}
            <div className="bg-white/[0.03] border border-white/[0.07] rounded-3xl p-8 lg:p-10">
              <h3 className="text-white font-bold text-xl mb-7">Envoyer un message</h3>
              <ContactForm />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
