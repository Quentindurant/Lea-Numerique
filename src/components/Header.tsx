"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { site } from "@/lib/site";

// Pages à fond clair : l'en-tête (logo et liens blancs) y garde toujours son fond sombre
const LIGHT_PAGES = ["/mentions-legales", "/politique-confidentialite"];

const focusRing = "focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#7C6EFA]";

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const pathname = usePathname();
  const solid = scrolled || LIGHT_PAGES.includes(pathname);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { href: "/", label: "Accueil" },
    { href: "/solutions", label: "Solutions" },
    { href: "/services", label: "Services" },
    { href: "/a-propos", label: "À propos" },
  ];

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        solid
          ? "bg-[#0D0D1A]/95 backdrop-blur-md shadow-lg"
          : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link href="/" className={`flex items-center gap-3 rounded-sm ${focusRing}`}>
            <Image
              src="/images/logo.png"
              alt="Léa Numérique, retour à l'accueil"
              width={150}
              height={45}
              preload
              className="h-10 w-auto brightness-0 invert"
            />
          </Link>

          {/* Desktop nav : à partir de 1280 px (en dessous, logo et menu se chevauchent ; menu burger) */}
          <nav className="hidden xl:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`text-white/80 hover:text-white font-medium transition-colors duration-200 hover:text-[#7C6EFA] rounded-sm ${focusRing}`}
              >
                {link.label}
              </Link>
            ))}
            <Link
              href="/contact"
              className={`bg-[#7C6EFA] hover:bg-[#5A4ED8] text-white px-5 py-2.5 rounded-full font-semibold transition-colors duration-200 ${focusRing}`}
            >
              Prendre contact
            </Link>
            <a
              href={`tel:${site.phone}`}
              className={`text-white/80 hover:text-white font-medium transition-colors duration-200 hover:text-[#7C6EFA] whitespace-nowrap rounded-sm ${focusRing}`}
            >
              {site.phoneDisplay}
            </a>
            
          </nav>

          {/* Mobile menu button */}
          <button
            className={`xl:hidden flex flex-col gap-1.5 p-2 rounded-md ${focusRing}`}
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label={menuOpen ? "Fermer le menu" : "Ouvrir le menu"}
            aria-expanded={menuOpen}
          >
            <span
              className={`block h-0.5 w-6 bg-white transition-all duration-300 ${menuOpen ? "rotate-45 translate-y-2" : ""}`}
            />
            <span
              className={`block h-0.5 w-6 bg-white transition-all duration-300 ${menuOpen ? "opacity-0" : ""}`}
            />
            <span
              className={`block h-0.5 w-6 bg-white transition-all duration-300 ${menuOpen ? "-rotate-45 -translate-y-2" : ""}`}
            />
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="xl:hidden bg-[#0D0D1A]/98 backdrop-blur-md border-t border-white/10">
          <nav className="flex flex-col px-6 py-6 gap-4">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`text-white/80 hover:text-[#7C6EFA] font-medium py-2 transition-colors rounded-sm ${focusRing}`}
                onClick={() => setMenuOpen(false)}
              >
                {link.label}
              </Link>
            ))}
            <Link
              href="/contact"
              className={`bg-[#7C6EFA] text-white px-5 py-3 rounded-full font-semibold text-center mt-2 ${focusRing}`}
              onClick={() => setMenuOpen(false)}
            >
              Prendre contact
            </Link>
            <a
              href={`tel:${site.phone}`}
              className={`bg-[#7C6EFA] text-white px-5 py-3 rounded-full font-semibold text-center mt-2 ${focusRing}`}
              onClick={() => setMenuOpen(false)}
            >
              {site.phoneDisplay}
            </a>
            
          </nav>
        </div>
      )}
    </header>
  );
}
