import { PhoneCall, ClipboardList, CheckCircle2, Rocket, HeartHandshake } from "lucide-react";
import type { LucideIcon } from "lucide-react";

const steps: { icon: LucideIcon; label: string; description: string; active?: boolean }[] = [
  { icon: PhoneCall,      label: "Prise de contact", description: "Vous nous exposez votre situation." },
  { icon: ClipboardList,  label: "Audit & analyse",  description: "Nous étudions votre infrastructure." },
  { icon: CheckCircle2,   label: "Proposition",       description: "Un devis clair, sans surprise." },
  { icon: Rocket,         label: "Mise en œuvre",    description: "Installation avec soin et méthode." },
  { icon: HeartHandshake, label: "Suivi continu",    description: "Accompagnement post-installation.", active: true },
];

export default function ProcessTimeline() {
  return (
    <div className="space-y-0">
      {steps.map((step, i) => {
        const Icon = step.icon;
        const isLast = i === steps.length - 1;
        return (
          <div key={step.label} className="flex gap-5">
            {/* Colonne gauche : icône + trait */}
            <div className="flex flex-col items-center">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
                  step.active
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
                step.active
                  ? "bg-[#7C6EFA]/10 border-[#7C6EFA]/40"
                  : "bg-white/[0.03] border-white/[0.07]"
              }`}
            >
              <p className="text-white font-semibold text-sm mb-1">{step.label}</p>
              <p className="text-white/50 text-sm leading-relaxed">{step.description}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
