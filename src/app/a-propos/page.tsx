import type { Metadata } from "next";
import Link from "next/link";
import { Handshake, Lightbulb, Users, Star } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import HistoryTimeline from "@/components/ui/HistoryTimeline";

export const metadata: Metadata = {
  title: "À propos — Léa Numérique",
  description: "Léa Numérique, votre partenaire IT de proximité.",
};

const values: { icon: LucideIcon; title: string; desc: string }[] = [
  { icon: Handshake, title: "Confiance", desc: "Des relations durables fondées sur la transparence et l'honnêteté." },
  { icon: Lightbulb, title: "Innovation", desc: "Toujours en veille pour vous proposer les meilleures solutions." },
  { icon: Users, title: "Collaboration", desc: "Nous travaillons en partenariat étroit avec chaque client." },
  { icon: Star, title: "Excellence", desc: "Chaque intervention est réalisée avec le plus grand soin." },
];

const stats = [
  { value: "800+", label: "Clients nous font confiance" },
  { value: "10+", label: "Ans d'expérience" },
  { value: "16", label: "Marques partenaires" },
  { value: "<4h", label: "Délai d'intervention" },
];

export default function APropos() {
  return (
    <div className="bg-[#0D0D1A]">

      {/* Hero — grand et immersif */}
      <section className="relative pt-40 pb-20 overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-[#7C6EFA]/8 rounded-full blur-3xl" />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 border border-[#7C6EFA]/40 rounded-full px-4 py-1.5 mb-8">
            <span className="w-1.5 h-1.5 rounded-full bg-[#7C6EFA] animate-pulse" />
            <span className="text-[#7C6EFA] text-sm">Notre histoire</span>
          </div>
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-white leading-tight mb-6">
            Une agence IT<br />
            <span className="text-[#7C6EFA]">de proximité</span>
          </h1>
          <p className="text-white/70 text-xl max-w-2xl mx-auto leading-relaxed">
           Léa Numérique accompagne entreprises et collectivités
            dans leur transformation numérique depuis plus de 10 ans.
          </p>
        </div>
      </section>

      {/* Stats */}
      <section className="border-t border-b border-white/5 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-0 divide-x divide-white/5">
            {stats.map((s) => (
              <div key={s.label} className="text-center py-6 px-4">
                <p className="text-4xl font-bold text-[#7C6EFA] mb-1">{s.value}</p>
                <p className="text-white/70 text-sm">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Histoire — deux colonnes */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-start">
            <div>
              <h2 className="text-3xl sm:text-4xl font-bold text-white mb-6 leading-tight">
                Pourquoi Léa Numérique existe
              </h2>
              <p className="text-white/70 leading-relaxed mb-5">
                Léa Numérique est née d&apos;un constat simple : les PME, les collectivités
                et les établissements de santé méritent d&apos;avoir accès aux meilleures
                technologies IT, avec un interlocuteur humain, disponible et expert.
              </p>
              <p className="text-white/70 leading-relaxed">
                D'autre part, nous vous offrons un accès à des innovations de pointe. Cette approche unique garantit que notre partenariat vous place toujours à l'avant-garde de l'évolution numérique, tout en répondant efficacement à vos exigences en constante évolution.
              </p>
            </div>

            {/* Timeline */}
            <HistoryTimeline />
          </div>
        </div>
      </section>

      {/* Valeurs */}
      <section className="py-24 border-t border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_2fr] gap-16 items-start">
            <div className="lg:sticky lg:top-28">
              <p className="text-[#7C6EFA] text-sm font-medium uppercase tracking-widest mb-3">Ce qui nous guide</p>
              <h2 className="text-3xl font-bold text-white leading-tight">
                Quatre valeurs,<br />une seule mission
              </h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {values.map((v, i) => (
                <Card
                  key={v.title}
                  className="group bg-white/[0.03] hover:bg-[#7C6EFA]/10 border-white/[0.07] hover:border-[#7C6EFA]/40 transition-all duration-300 gap-3"
                >
                  <CardHeader className="pb-0">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-[#7C6EFA]/15 group-hover:bg-[#7C6EFA]/25 flex items-center justify-center transition-colors flex-shrink-0">
                        <v.icon className="text-[#7C6EFA] w-4 h-4" />
                      </div>
                      <span className="text-white/20 font-mono text-sm">0{i + 1}</span>
                    </div>
                    <CardTitle className="text-white text-lg">{v.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-white/70 text-sm leading-relaxed">{v.desc}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="border-t border-white/5 py-24">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold text-white mb-4">Travaillons ensemble</h2>
          <p className="text-white/70 mb-8 text-lg">
            Vous avez un projet IT ? Prenons 30 minutes pour en parler.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/contact"
              className="bg-[#7C6EFA] hover:bg-[#5A4ED8] text-white px-8 py-4 rounded-full font-semibold transition-all duration-200 shadow-xl shadow-[#7C6EFA]/20"
            >
              Prendre contact
            </Link>
            <a
              href="mailto:hello@lea-numerique.fr"
              className="border border-white/20 hover:border-[#7C6EFA]/50 text-white/70 hover:text-white px-8 py-4 rounded-full font-semibold transition-all duration-200"
            >
              hello@lea-numerique.fr
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
