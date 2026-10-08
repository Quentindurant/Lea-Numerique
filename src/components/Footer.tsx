import Link from "next/link";
import Image from "next/image";
import { MapPin, Phone, Mail } from "lucide-react";
import { site } from "@/lib/site";

export default function Footer() {
  return (
    <footer className="bg-[#0D0D1A] border-t border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-10">
          {/* Brand */}
          <div className="md:col-span-1">
            <Image
              src="/images/logo.png"
              alt="Léa Numérique, intégrateur IT à Angers"
              width={140}
              height={42}
              className="h-10 w-auto mb-4 brightness-0 invert"
            />
            <p className="text-white/70 text-sm leading-relaxed">
              Intégrateur IT : téléphonie IP, réseaux, informatique et
              cybersécurité pour les entreprises et collectivités du Maine-et-Loire.
            </p>
          </div>

          {/* Navigation */}
          <div>
            <p className="text-white font-semibold mb-4">Navigation</p>
            <ul className="space-y-2">
              {[
                { href: "/", label: "Accueil" },
                { href: "/solutions", label: "Solutions" },
                { href: "/services", label: "Services" },
                { href: "/a-propos", label: "À propos" },
                { href: "/contact", label: "Contact" },
              ].map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-white/70 hover:text-[#7C6EFA] text-sm transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Solutions */}
          <div>
            <p className="text-white font-semibold mb-4">Nos solutions</p>
            <ul className="space-y-2">
              {[
                { href: "/solutions#telephonie", label: "Téléphonie IP" },
                { href: "/solutions#reseaux", label: "Réseaux & Infrastructure" },
                { href: "/solutions#informatique", label: "Informatique" },
                { href: "/solutions#cybersecurite", label: "Cybersécurité" },
              ].map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-white/70 hover:text-[#7C6EFA] text-sm transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          {/* Services */}
          <div>
            <p className="text-white font-semibold mb-4">Nos services</p>
            <ul className="space-y-2">
              {[
                { href: "/services#conseil", label: "Conseil" },
                { href: "/services#installation", label: "Installation" },
                { href: "/services#maintenance", label: "Maintenance" },
                { href: "/services#securite", label: "Sécurité" },
              ].map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-white/70 hover:text-[#7C6EFA] text-sm transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <p className="text-white font-semibold mb-4">Contact</p>
            <address className="not-italic">
              <ul className="space-y-3 text-sm text-white/70">
                <li className="flex items-start gap-2">
                  <MapPin className="text-[#7C6EFA] w-4 h-4 mt-0.5 flex-shrink-0" aria-hidden="true" />
                  <span>
                    {site.name}
                    <br />
                    {site.address.street}
                    <br />
                    {site.address.postalCode} {site.address.city}
                  </span>
                </li>
                <li className="flex items-center gap-2">
                  <Phone className="text-[#7C6EFA] w-4 h-4 flex-shrink-0" aria-hidden="true" />
                  <a href={`tel:${site.phone}`} className="hover:text-white transition-colors">
                    {site.phoneDisplay}
                  </a>
                </li>
                <li className="flex items-center gap-2">
                  <Mail className="text-[#7C6EFA] w-4 h-4 flex-shrink-0" aria-hidden="true" />
                  <a href={`mailto:${site.email}`} className="hover:text-white transition-colors">
                    {site.email}
                  </a>
                </li>
              </ul>
            </address>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-12 pt-6 border-t border-white/10 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-white/40 text-sm">
            © {new Date().getFullYear()} Léa Numérique. Tous droits réservés.
          </p>
          <div className="flex gap-6 text-sm">
            <Link href="/mentions-legales" className="text-white/40 hover:text-white/70 transition-colors">
              Mentions légales
            </Link>
            <Link href="/politique-confidentialite" className="text-white/40 hover:text-white/70 transition-colors">
              Politique de confidentialité
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
