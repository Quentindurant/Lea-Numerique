import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { PhoneCall, Network, Laptop, ShieldCheck, ArrowRight } from "lucide-react";
import type { LucideIcon } from "lucide-react";

export const metadata: Metadata = {
  title: "Solutions — Léa Numérique",
  description: "Nos solutions IT : téléphonie IP, réseaux & infrastructure, informatique et cybersécurité.",
};

const solutions: { id: string; title: string; subtitle: string; icon: LucideIcon; image: string; description: string; features: string[]; partners: string[] }[] = [
  {
    id: "01",
    title: "Téléphonie IP",
    subtitle: "Communiquez sans limites",
    icon: PhoneCall,
    image: "/images/téléphonie.jpg",
    description:
      "Modernisez votre communication d'entreprise avec des solutions VoIP et IPBX de dernière génération. Réduisez vos coûts tout en gagnant en flexibilité.",
    features: [
      "IPBX Yeastar & 3CX",
      "Téléphones IP Yealink",
      "Visioconférence intégrée",
      "Renvoi sur mobile",
      "Standard virtuel",
      "Messagerie vocale",
    ],
    partners: ["3CX", "Yeastar", "Yealink", "Wazo", "UNYC"],
  },
  {
    id: "02",
    title: "Réseaux & Infrastructure",
    subtitle: "Connectez, sécurisez, performez",
    icon: Network,
    image: "/images/réseau.jpg",
    description:
      "Conception, déploiement et supervision de vos infrastructures réseau. Du Wi-Fi professionnel au VPN en passant par la fibre et le câblage structuré.",
    features: [
      "Wi-Fi professionnel",
      "VPN sécurisé",
      "VLAN & QoS",
      "Câblage RJ45/fibre",
      "Monitoring réseau",
      "Routage avancé",
    ],
    partners: ["Ubiquiti", "TP-Link", "Zyxel", "Fortinet"],
  },
  {
    id: "03",
    title: "Informatique",
    subtitle: "Des outils fiables pour vos équipes",
    icon: Laptop,
    image: "/images/informatique.png",
    description:
      "Fournisseur de matériel informatique professionnel certifié. Postes de travail, serveurs, périphériques — avec maintenance et support inclus.",
    features: [
      "Postes de travail & laptops",
      "Serveurs & NAS",
      "Imprimantes pro",
      "Migration Windows",
      "Virtualisation",
      "Maintenance préventive",
    ],
    partners: ["HP", "Lenovo", "Dell"],
  },
  {
    id: "04",
    title: "Cybersécurité",
    subtitle: "Protégez ce qui compte vraiment",
    icon: ShieldCheck,
    image: "/images/cyber.jpg",
    description:
      "Face aux cybermenaces croissantes, nous déployons des solutions de sécurité éprouvées pour protéger vos données, vos réseaux et votre activité.",
    features: [
      "Pare-feu Fortinet",
      "Antivirus entreprise",
      "Sauvegarde externalisée",
      "Audit de sécurité",
      "Filtrage web",
      "Vidéosurveillance",
    ],
    partners: ["Fortinet", "Hikvision", "Zyxel"],
  },
];

export default function Solutions() {
  return (
    <div className="bg-[#0D0D1A]">

      {/* Hero */}
      <section className="pt-48 pb-32">
        <div className="max-w-6xl mx-auto px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-end">
            <div>
              <div className="inline-flex items-center gap-2 border border-[#7C6EFA]/40 rounded-full px-4 py-1.5 mb-10">
                <span className="w-1.5 h-1.5 rounded-full bg-[#7C6EFA] animate-pulse" />
                <span className="text-[#7C6EFA] text-sm">Nos domaines d&apos;expertise</span>
              </div>
              <h1 className="text-6xl sm:text-7xl font-bold text-white leading-none">
                Nos<br />
                <span className="text-[#7C6EFA]">solutions</span>
              </h1>
            </div>
            <p className="text-white/45 text-xl leading-relaxed pb-2">
              De la téléphonie à la cybersécurité, nous couvrons l&apos;intégralité de
              vos besoins numériques avec des partenaires technologiques de référence.
            </p>
          </div>
        </div>
      </section>

      {/* Solutions — sections aérées */}
      {solutions.map((solution, index) => (
        <div key={solution.id} className="border-t border-white/[0.06]">
          <div className="max-w-6xl mx-auto px-6 lg:px-8 py-24 lg:py-32">
            <div className={`grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center ${index % 2 !== 0 ? "lg:[&>*:first-child]:order-2" : ""}`}>

              {/* Image */}
              <div className="relative">
                <div className="relative rounded-2xl overflow-hidden aspect-[4/3]">
                  <Image
                    src={solution.image}
                    alt={solution.title}
                    fill
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0D0D1A]/60 via-transparent to-transparent" />
                  {/* Badge */}
                  <div className="absolute bottom-5 left-5 flex items-center gap-3 bg-[#0D0D1A]/80 backdrop-blur-sm border border-white/10 rounded-xl px-4 py-3">
                    <div className="w-8 h-8 rounded-lg bg-[#7C6EFA] flex items-center justify-center">
                      <solution.icon className="text-white w-4 h-4" />
                    </div>
                    <span className="text-white text-sm font-medium">{solution.title}</span>
                  </div>
                </div>
              </div>

              {/* Contenu */}
              <div className={index % 2 !== 0 ? "lg:col-start-1 lg:row-start-1" : ""}>
                <span className="text-white/20 font-mono text-sm">{solution.id} /</span>
                <h2 className="text-3xl sm:text-4xl font-bold text-white mt-2 mb-1">
                  {solution.title}
                </h2>
                <p className="text-[#7C6EFA] font-medium mb-6">{solution.subtitle}</p>
                <p className="text-white/45 leading-relaxed mb-10">{solution.description}</p>

                {/* Features — liste simple */}
                <div className="grid grid-cols-2 gap-x-8 gap-y-3 mb-10">
                  {solution.features.map((f) => (
                    <div key={f} className="flex items-center gap-3">
                      <span className="w-1 h-1 rounded-full bg-[#7C6EFA] flex-shrink-0" />
                      <span className="text-white/60 text-sm">{f}</span>
                    </div>
                  ))}
                </div>

                {/* Partenaires */}
                <div className="flex items-center gap-3 flex-wrap mb-8">
                  <span className="text-white/25 text-xs uppercase tracking-widest">Partenaires</span>
                  {solution.partners.map((p) => (
                    <span key={p} className="text-xs text-white/50 border border-white/10 px-3 py-1 rounded-full">
                      {p}
                    </span>
                  ))}
                </div>

                <Link
                  href="/contact"
                  className="inline-flex items-center gap-2 text-[#7C6EFA] hover:text-white font-semibold text-sm transition-colors group"
                >
                  Prendre contact
                  <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      ))}

      {/* CTA */}
      <div className="border-t border-white/[0.06]">
        <div className="max-w-6xl mx-auto px-6 lg:px-8 py-28">
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-10">
            <div>
              <h2 className="text-4xl font-bold text-white mb-3">
                Votre projet mérite la meilleure solution
              </h2>
              <p className="text-white/40">
                Nos experts analysent votre situation et proposent une réponse adaptée, sans engagement.
              </p>
            </div>
            <Link
              href="/contact"
              className="flex-shrink-0 bg-[#7C6EFA] hover:bg-[#5A4ED8] text-white px-8 py-4 rounded-full font-semibold transition-all duration-200 shadow-lg shadow-[#7C6EFA]/20"
            >
              Prendre contact
            </Link>
          </div>
        </div>
      </div>

    </div>
  );
}
