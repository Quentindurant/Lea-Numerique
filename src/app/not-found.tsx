import type { Metadata } from "next";
import Link from "next/link";
import { SOLUTIONS } from "@/lib/solutions";

export const metadata: Metadata = {
  title: "Page introuvable",
  description: "Cette page n'existe pas ou a été déplacée. Retrouvez nos solutions télécom et IT à Angers.",
  robots: { index: false, follow: true },
  alternates: { canonical: null },
  openGraph: { title: "Page introuvable | Léa Numérique", description: "Cette page n'existe pas ou a été déplacée." },
  twitter: { card: "summary", title: "Page introuvable | Léa Numérique" },
};

const links = [
  { href: "/", label: "Accueil" },
  { href: "/solutions", label: "Nos solutions IT" },
  { href: "/services", label: "Nos services" },
  { href: "/contact", label: "Nous contacter" },
];

const focusRing = "focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#7C6EFA]";

export default function NotFound() {
  return (
    <section className="bg-[#0D0D1A] min-h-[70vh] pt-40 pb-24">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <p className="text-[#7C6EFA] font-semibold text-sm uppercase tracking-widest mb-4">Erreur 404</p>
        <h1 className="text-4xl sm:text-5xl font-bold text-white mb-6">Page introuvable</h1>
        <p className="text-white/70 leading-relaxed mb-10">
          La page que vous cherchez n&apos;existe pas ou a été déplacée.
        </p>
        <nav aria-label="Pages principales">
          <ul className="flex flex-wrap justify-center gap-4">
            {links.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className={`inline-block border border-white/20 hover:border-[#7C6EFA] text-white hover:text-[#7C6EFA] px-6 py-3 rounded-full font-semibold transition-colors ${focusRing}`}
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
          <p className="text-white/70 text-sm mt-12 mb-4">Ou directement l&apos;une de nos solutions :</p>
          <ul className="flex flex-wrap justify-center gap-x-6 gap-y-3">
            {SOLUTIONS.map((s) => (
              <li key={s.slug}>
                <Link
                  href={s.path}
                  className={`text-[#7C6EFA] hover:text-white font-medium underline decoration-[#7C6EFA]/50 underline-offset-4 transition-colors rounded-sm ${focusRing}`}
                >
                  {s.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </section>
  );
}
