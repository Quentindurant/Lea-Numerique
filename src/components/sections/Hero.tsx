import Link from "next/link";
import Image from "next/image";

const partners = [
  { src: "/images/partenaire/3CX_blanc.png", alt: "3CX" },
  { src: "/images/partenaire/Forti.png", alt: "Fortinet", className: "scale-300" },
  { src: "/images/partenaire/Yealink-Logo-blanc.png", alt: "Yealink" },
  { src: "/images/partenaire/ubiquiti_blanc_1an.png", alt: "Ubiquiti" },
  { src: "/images/partenaire/sfr_logo_blanc.png", alt: "SFR" },
  { src: "/images/partenaire/tp_link_blanc.png", alt: "TP-Link" },
  { src: "/images/partenaire/hp_blancan.png", alt: "HP" },
  { src: "/images/partenaire/lenovo_blancan.png", alt: "Lenovo" },
  { src: "/images/partenaire/bouygue.png", alt: "Bouygues Telecom" },
  { src: "/images/partenaire/wazo_blanc.png", alt: "Wazo" },
  { src: "/images/partenaire/yeastar_blanc.png", alt: "Yeastar" },
  { src: "/images/partenaire/zyxel_blc.png", alt: "Zyxel" },
  { src: "/images/partenaire/hikvision_blancan.png", alt: "Hikvision" },
  { src: "/images/partenaire/UNYC_BLANCan.png", alt: "UNYC" },
];

export default function Hero() {
  return (
    <section className="relative min-h-screen bg-[#0D0D1A] flex flex-col justify-center overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 -left-32 w-96 h-96 bg-[#7C6EFA]/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 -right-32 w-96 h-96 bg-[#7C6EFA]/10 rounded-full blur-3xl" />
        {/* Decorative lines resembling the template */}
        <svg
          className="absolute top-0 right-0 w-1/2 h-full opacity-10"
          viewBox="0 0 400 600"
          fill="none"
        >
          <path
            d="M350 50 Q200 150 300 250 Q400 350 200 450 Q100 500 150 550"
            stroke="#7C6EFA"
            strokeWidth="2"
            fill="none"
          />
          <path
            d="M380 100 Q230 200 330 300 Q430 400 230 500"
            stroke="#7C6EFA"
            strokeWidth="1"
            fill="none"
            opacity="0.5"
          />
        </svg>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-20">
        <div className="flex flex-col lg:flex-row items-center gap-16">
          {/* Text content */}
          <div className="flex-1 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 bg-[#7C6EFA]/15 border border-[#7C6EFA]/30 rounded-full px-4 py-2 mb-6">
              <span className="w-2 h-2 rounded-full bg-[#7C6EFA] animate-pulse" />
              <span className="text-[#7C6EFA] text-sm font-medium">
                Solutions IT professionnelles
              </span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white leading-tight mb-6">
              <span className="block text-[#7C6EFA]">
                Votre partenaire incontournable
              </span>
              <span className="block text-white/80 text-3xl sm:text-4xl lg:text-5xl font-medium mt-2">
                en solutions IT.
              </span>
            </h1>

            <p className="text-white/70 text-lg leading-relaxed mb-8 max-w-xl lg:max-w-none">
              Léa Numérique, votre partenaire IT de confiance, allie expertise et innovation pour répondre à vos besoins numériques. Accédez à l'excellence technologique avec notre approche unique, complète et entièrement personnalisée.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <Link
                href="/contact"
                className="bg-[#7C6EFA] hover:bg-[#5A4ED8] text-white px-8 py-4 rounded-full font-semibold text-lg transition-all duration-200 shadow-lg shadow-[#7C6EFA]/25 hover:shadow-[#7C6EFA]/40"
              >
                Demander un devis gratuit
              </Link>
              <Link
                href="/solutions"
                className="border border-white/20 hover:border-[#7C6EFA] text-white px-8 py-4 rounded-full font-semibold text-lg transition-all duration-200 hover:text-[#7C6EFA]"
              >
                Découvrir nos solutions
              </Link>
            </div>
          </div>

          {/* Mascotte */}
          <div className="flex-shrink-0 lg:w-80">
            <div className="float-animation">
              <Image
                src="/images/mascotte.png"
                alt="Léa Numérique mascotte"
                width={320}
                height={320}
                className="w-full max-w-xs mx-auto drop-shadow-2xl"
              />
            </div>
          </div>
        </div>

        {/* Partners strip */}
        <div className="mt-20">
          <p className="text-white/40 text-sm text-center mb-6 uppercase tracking-widest">
            Nos partenaires technologiques
          </p>
          <div className="relative overflow-hidden">
            <div className="flex gap-12 partners-track">
              {[...partners, ...partners].map((p, i) => (
                <div
                  key={i}
                  className="flex-shrink-0 flex items-center justify-center w-[100px] h-10"
                >
                  <Image
                    src={p.src}
                    alt={p.alt}
                    width={100}
                    height={40}
                    className={`h-8 w-auto opacity-50 hover:opacity-100 transition-opacity grayscale hover:grayscale-0 ${p.className || ''}`}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
