import { Fragment } from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";

/**
 * Texte enrichi minimal (voir RichText dans src/content/solutions/types.ts) :
 * seuls les liens au format [libellé](href) sont interprétés, tout le reste est du texte.
 */
export type RichTextPart =
  | { type: "text"; text: string }
  | { type: "link"; text: string; href: string };

const LINK_PATTERN = /\[([^\]\n]+)\]\(([^)\s]+)\)/g;
// Protocoles jamais rendus en lien (le libellé reste affiché en texte)
const UNSAFE_HREF = /^\s*(javascript|data|vbscript):/i;

export function parseRichText(value: string): RichTextPart[] {
  const parts: RichTextPart[] = [];
  let last = 0;
  for (const match of value.matchAll(LINK_PATTERN)) {
    const index = match.index ?? 0;
    if (index > last) parts.push({ type: "text", text: value.slice(last, index) });
    const [, text, href] = match;
    parts.push(UNSAFE_HREF.test(href) ? { type: "text", text } : { type: "link", text, href });
    last = index + match[0].length;
  }
  if (last < value.length) parts.push({ type: "text", text: value.slice(last) });
  return parts;
}

const NBSP = "\u00A0";

/**
 * Espaces insécables de la typographie française : « ? », « ! », « : », « ; » et « » » ne passent
 * jamais seuls en début de ligne, et un numéro de téléphone (02 19 23 06 91) n'est jamais coupé.
 * Appliqué à tout le texte affiché par RichText et par les gabarits, et au texte brut du JSON-LD
 * pour qu'il reste identique au texte visible.
 */
export function frenchSpacing(value: string): string {
  return value
    .replace(/ ([?!:;»])/g, `${NBSP}$1`)
    .replace(/« /g, `«${NBSP}`)
    .replace(/\b(\d{2}) (\d{2}) (\d{2}) (\d{2}) (\d{2})\b/g, [1, 2, 3, 4, 5].map((n) => `$${n}`).join(NBSP));
}

/** Version texte brut : le libellé des liens est conservé, l'URL est retirée (JSON-LD, meta). */
export function richTextToPlainText(value: string): string {
  return frenchSpacing(
    parseRichText(value)
      .map((part) => part.text)
      .join(""),
  );
}

/** Chemin interne au site (/page, /page#ancre, #ancre), servi par next/link. */
export function isInternalHref(href: string): boolean {
  return (href.startsWith("/") && !href.startsWith("//")) || href.startsWith("#");
}

// Les liens restent soulignés : la couleur seule ne suffit pas à les distinguer du texte (WCAG 1.4.1).
// Style par défaut prévu pour les fonds sombres ; linkClassName permet de l'adapter (fonds clairs).
export const RICH_TEXT_LINK_CLASS =
  "font-medium text-[#7C6EFA] underline decoration-[#7C6EFA]/50 underline-offset-4 transition-colors hover:text-white hover:decoration-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#7C6EFA] rounded-sm";

export default function RichText({ text, linkClassName }: { text: string; linkClassName?: string }) {
  const className = cn(RICH_TEXT_LINK_CLASS, linkClassName);
  return (
    <>
      {parseRichText(text).map((part, i) => {
        const label = frenchSpacing(part.text);
        if (part.type === "text") return <Fragment key={i}>{label}</Fragment>;
        if (isInternalHref(part.href)) {
          return (
            <Link key={i} href={part.href} className={className}>
              {label}
            </Link>
          );
        }
        return (
          <a key={i} href={part.href} rel="noopener" className={className}>
            {label}
          </a>
        );
      })}
    </>
  );
}
