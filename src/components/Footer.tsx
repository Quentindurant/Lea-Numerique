import Link from "next/link";
import Image from "next/image";
import { MapPin, Phone, Mail } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-[#0D0D1A] border-t border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          {/* Brand */}
          <div className="md:col-span-1">
            <Image
              src="/images/logo.png"
              alt="Léa Numérique"
              width={140}
              height={42}
              className="h-10 w-auto mb-4 brightness-0 invert"
            />
            <p className="text-white/70 text-sm leading-relaxed">
              Votre partenaire incontournable des solutions IT pour entreprises
              et collectivités.
            </p>
          </div>

          {/* Navigation */}
          <div>
            <h3 className="text-white font-semibold mb-4">Navigation</h3>
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
            <h3 className="text-white font-semibold mb-4">Nos solutions</h3>
            <ul className="space-y-2">
              {["Téléphonie IP", "Réseaux & Infrastructure", "Informatique", "Cybersécurité"].map((item) => (
                <li key={item}>
                  <Link
                    href="/solutions"
                    className="text-white/70 hover:text-[#7C6EFA] text-sm transition-colors"
                  >
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-white font-semibold mb-4">Contact</h3>
            <ul className="space-y-3 text-sm text-white/70">
              <li className="flex items-start gap-2">
                <MapPin className="text-[#7C6EFA] w-4 h-4 mt-0.5 flex-shrink-0" />
                <span>Angers, France</span>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="text-[#7C6EFA] w-4 h-4 flex-shrink-0" />
                <a href="tel:02 19 23 06 91" className="hover:text-white transition-colors">
                  02 19 23 06 91
                </a>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="text-[#7C6EFA] w-4 h-4 flex-shrink-0" />
                <a href="mailto:hello@lea-numerique.fr" className="hover:text-white transition-colors">
                  hello@lea-numerique.fr
                </a>
              </li>
            </ul>
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
