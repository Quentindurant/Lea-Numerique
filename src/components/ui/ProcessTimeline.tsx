import type { ReactNode } from "react";
import { PhoneCall, ClipboardList, CheckCircle2, Rocket, HeartHandshake } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import type { ProcessStepKey } from "@/content/services";

const icons: Record<ProcessStepKey, LucideIcon> = {
  contact: PhoneCall,
  analyse: ClipboardList,
  proposition: CheckCircle2,
  realisation: Rocket,
  suivi: HeartHandshake,
};

export interface TimelineStep {
  key: ProcessStepKey;
  label: string;
  /** Texte déjà mis en forme (liens compris) par la page */
  description: ReactNode;
}

// Frise verticale du déroulé d'un projet. La dernière étape (le suivi) est mise en avant.
export default function ProcessTimeline({ steps }: { steps: TimelineStep[] }) {
  return (
    <ol className="space-y-0">
      {steps.map((step, i) => {
        const Icon = icons[step.key];
        const isLast = i === steps.length - 1;
        return (
          <li key={step.key} className="flex gap-4 sm:gap-5">
            {/* Colonne gauche : icône + trait */}
            <div className="flex flex-col items-center" aria-hidden="true">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
                  isLast
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
              className={`flex-1 min-w-0 mb-6 rounded-xl border p-4 sm:p-5 ${
                isLast ? "bg-[#7C6EFA]/10 border-[#7C6EFA]/40" : "bg-white/[0.03] border-white/[0.07]"
              }`}
            >
              <h3 className="text-white font-semibold text-base mb-1.5">{step.label}</h3>
              <p className="text-white/60 text-sm leading-relaxed">{step.description}</p>
            </div>
          </li>
        );
      })}
    </ol>
  );
}
