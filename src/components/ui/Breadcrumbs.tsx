import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

export type BreadcrumbItem = {
  /** Libellé affiché (repris tel quel dans le JSON-LD BreadcrumbList) */
  name: string;
  /** Chemin de la page, par exemple /solutions */
  path: string;
};

/** Fil d'Ariane visible ; le dernier élément est la page courante. Prévu pour les fonds sombres. */
export default function Breadcrumbs({ items, className }: { items: BreadcrumbItem[]; className?: string }) {
  return (
    <nav aria-label="Fil d'Ariane" className={cn("text-sm", className)}>
      <ol className="flex flex-wrap items-center gap-x-2 gap-y-1 text-white/70">
        {items.map((item, i) => {
          const isLast = i === items.length - 1;
          return (
            <li key={item.path} className="flex items-center gap-2">
              {i > 0 && <ChevronRight className="h-3.5 w-3.5 flex-shrink-0 text-white/50" aria-hidden="true" />}
              {isLast ? (
                <span aria-current="page" className="font-medium text-white">
                  {item.name}
                </span>
              ) : (
                <Link
                  href={item.path}
                  className="rounded-sm underline-offset-4 transition-colors hover:text-white hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#7C6EFA]"
                >
                  {item.name}
                </Link>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
