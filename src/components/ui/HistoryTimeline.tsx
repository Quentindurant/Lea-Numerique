import { Rocket, TrendingUp, Award, CheckCircle2 } from "lucide-react";
import type { LucideIcon } from "lucide-react";

const items: { icon: LucideIcon; label: string; description: string; active?: boolean }[] = [
  { icon: Rocket,       label: "Fondation",    description: "Création de Léa Numérique." },
  { icon: TrendingUp,   label: "Croissance",   description: "Extension du catalogue : téléphonie IP, réseaux, cybersécurité." },
  { icon: Award,        label: "Partenariats", description: "Certifications Fortinet, Ubiquiti, Yeastar, Dell et HP." },
  { icon: CheckCircle2, label: "Aujourd'hui",  description: "Plus de 800 clients nous font confiance, toujours avec la même exigence.", active: true },
];

export default function HistoryTimeline() {
  return (
    <div className="space-y-0">
      {items.map((item, i) => {
        const Icon = item.icon;
        const isLast = i === items.length - 1;
        return (
          <div key={item.label} className="flex gap-5">
            {/* Colonne gauche : icône + trait */}
            <div className="flex flex-col items-center">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 transition-all ${
                  item.active
                    ? "bg-[#7C6EFA] shadow-lg shadow-[#7C6EFA]/40"
                    : "bg-[#7C6EFA]/15 border border-[#7C6EFA]/30"
                }`}
              >
                <Icon className="w-4 h-4 text-white" />
              </div>
              {!isLast && (
                <div className="w-px flex-1 bg-gradient-to-b from-[#7C6EFA]/40 to-[#7C6EFA]/10 my-2" />
              )}
            </div>

            {/* Contenu */}
            <div
              className={`flex-1 mb-6 rounded-xl border p-4 ${
                item.active
                  ? "bg-[#7C6EFA]/10 border-[#7C6EFA]/40"
                  : "bg-white/[0.03] border-white/[0.07]"
              }`}
            >
              <p className="text-white font-semibold text-sm mb-1">{item.label}</p>
              <p className="text-white/50 text-sm leading-relaxed">{item.description}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
