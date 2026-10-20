import { ArrowRight } from "lucide-react";
import { frenchSpacing } from "@/components/ui/RichText";

/**
 * Libellé de lien suivi d'une flèche, qui reste collée au dernier mot quand le libellé passe
 * sur deux lignes. À placer dans un lien `group` affiché en ligne (pas en flex).
 */
export default function ArrowLabel({ text: raw }: { text: string }) {
  const text = frenchSpacing(raw);
  const cut = text.lastIndexOf(" ");
  const head = cut === -1 ? "" : text.slice(0, cut + 1);
  const tail = cut === -1 ? text : text.slice(cut + 1);
  return (
    <>
      {head}
      <span className="whitespace-nowrap">
        {tail}
        <ArrowRight
          className="ml-2 inline-block h-4 w-4 align-[-0.15em] transition-transform group-hover:translate-x-1"
          aria-hidden="true"
        />
      </span>
    </>
  );
}
