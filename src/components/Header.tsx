"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

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
        scrolled
          ? "bg-[#0D0D1A]/95 backdrop-blur-md shadow-lg"
          : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3">
            <Image
              src="/images/logo.png"
              alt="Léa Numérique"
              width={150}
              height={45}
              className="h-10 w-auto brightness-0 invert"
            />
          </Link>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-white/80 hover:text-white font-medium transition-colors duration-200 hover:text-[#7C6EFA]"
              >
                {link.label}
              </Link>
            ))}
            <Link
              href="/contact"
              className="bg-[#7C6EFA] hover:bg-[#5A4ED8] text-white px-5 py-2.5 rounded-full font-semibold transition-colors duration-200"
            >
              Prendre contact
            </Link>
            <Link
              href="tel:0219230691"
              className="text-white/80 hover:text-white font-medium transition-colors duration-200 hover:text-[#7C6EFA]"
            >
              02 19 23 06 91
            </Link>
            
          </nav>

          {/* Mobile menu button */}
          <button
            className="md:hidden flex flex-col gap-1.5 p-2"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Menu"
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
        <div className="md:hidden bg-[#0D0D1A]/98 backdrop-blur-md border-t border-white/10">
          <nav className="flex flex-col px-6 py-6 gap-4">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-white/80 hover:text-[#7C6EFA] font-medium py-2 transition-colors"
                onClick={() => setMenuOpen(false)}
              >
                {link.label}
              </Link>
            ))}
            <Link
              href="/contact"
              className="bg-[#7C6EFA] text-white px-5 py-3 rounded-full font-semibold text-center mt-2"
              onClick={() => setMenuOpen(false)}
            >
              Prendre contact
            </Link>
            <Link
              href="tel:0219230691"
              className="bg-[#7C6EFA] text-white px-5 py-3 rounded-full font-semibold text-center mt-2"
              onClick={() => setMenuOpen(false)}
            >
              02 19 23 06 91
            </Link>
            
          </nav>
        </div>
      )}
    </header>
  );
}
