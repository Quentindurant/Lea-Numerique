import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Page introuvable",
  description: "Cette page n'existe pas ou a été déplacée. Retrouvez nos solutions et services IT à Angers.",
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

export default function NotFound() {
  return (
    <section className="bg-[#0D0D1A] min-h-[70vh] pt-40 pb-24">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <p className="text-[#7C6EFA] font-semibold text-sm uppercase tracking-widest mb-4">Erreur 404</p>
        <h1 className="text-4xl sm:text-5xl font-bold text-white mb-6">Page introuvable</h1>
        <p className="text-white/70 leading-relaxed mb-10">
          La page que vous cherchez n&apos;existe pas ou a été déplacée.
        </p>
        <nav aria-label="Pages principales" className="flex flex-wrap justify-center gap-4">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="border border-white/20 hover:border-[#7C6EFA] text-white hover:text-[#7C6EFA] px-6 py-3 rounded-full font-semibold transition-colors"
            >
              {link.label}
            </Link>
          ))}
        </nav>
      </div>
    </section>
  );
}
