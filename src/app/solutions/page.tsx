import Image from "next/image";
import Link from "next/link";
import { PhoneCall, Network, Laptop, ShieldCheck, ArrowRight } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Téléphonie IP, Wi-Fi & cybersécurité Angers",
  description:
    "Standard téléphonique IP (3CX, Yeastar), Wi-Fi pro, postes HP/Lenovo/Dell et pare-feu Fortinet : nos solutions IT pour les pros d'Angers et de l'Anjou.",
  path: "/solutions",
});

const solutions: { id: string; slug: string; title: string; heading: string; subtitle: string; icon: LucideIcon; image: string; alt: string; description: string; features: string[]; partners: string[]; related: { href: string; label: string }; quote: string }[] = [
  {
    id: "01",
    slug: "telephonie",
    title: "Téléphonie IP",
    heading: "Téléphonie IP et standard d'entreprise",
    subtitle: "Communiquez sans limites",
    icon: PhoneCall,
    image: "/images/telephonie-ip-entreprise.webp",
    alt: "Illustration d'un standard téléphonique : opératrice avec casque, téléphone et messagerie",
    description:
      "Modernisez votre communication d'entreprise avec une téléphonie IP pensée pour vos équipes, au bureau comme en télétravail. Nous installons et configurons des IPBX Yeastar et 3CX, des téléphones IP Yealink fixes et sans fil, ainsi que les solutions Wazo et UNYC. Standard virtuel, renvoi sur mobile, messagerie vocale et visioconférence intégrée : vos appels sont centralisés et vos collaborateurs restent joignables. À Angers et en Maine-et-Loire, nous accompagnons aussi bien les PME que les mairies, les EHPAD ou les études notariales, de l'audit de votre installation à la formation des utilisateurs.",
    features: [
      "IPBX Yeastar & 3CX",
      "Téléphones IP Yealink",
      "Visioconférence intégrée",
      "Renvoi sur mobile",
      "Standard virtuel",
      "Messagerie vocale",
    ],
    partners: ["3CX", "Yeastar", "Yealink", "Wazo", "UNYC"],
    related: { href: "/services#installation", label: "Installation et mise en service de votre téléphonie IP" },
    quote: "Demander un devis de téléphonie IP",
  },
  {
    id: "02",
    slug: "reseaux",
    title: "Réseaux & Infrastructure",
    heading: "Réseaux, Wi-Fi et câblage professionnels",
    subtitle: "Connectez, sécurisez, performez",
    icon: Network,
    image: "/images/reseau-wifi-professionnel.webp",
    alt: "Illustration d'un réseau Wi-Fi professionnel reliant smartphones, tablettes et ordinateurs",
    description:
      "Un réseau fiable est la base de tous vos outils numériques. Nous concevons, déployons et supervisons votre infrastructure : câblage structuré RJ45 et fibre, Wi-Fi professionnel, VLAN et QoS pour prioriser la voix, VPN sécurisé pour relier vos sites et vos collaborateurs nomades, routage avancé et monitoring réseau. Nous travaillons avec Ubiquiti, TP-Link, Zyxel et Fortinet, et dimensionnons chaque installation selon vos locaux et votre activité.",
    features: [
      "Wi-Fi professionnel",
      "VPN sécurisé",
      "VLAN & QoS",
      "Câblage RJ45/fibre",
      "Monitoring réseau",
      "Routage avancé",
    ],
    partners: ["Ubiquiti", "TP-Link", "Zyxel", "Fortinet"],
    related: { href: "/services#installation", label: "Câblage et déploiement réseau" },
    quote: "Demander un devis réseau",
  },
  {
    id: "03",
    slug: "informatique",
    title: "Informatique",
    heading: "Matériel informatique professionnel",
    subtitle: "Des outils fiables pour vos équipes",
    icon: Laptop,
    image: "/images/materiel-informatique-professionnel.webp",
    alt: "Illustration : techniciens informatiques travaillant devant des baies de serveurs",
    description:
      "Postes de travail et portables, serveurs et NAS, imprimantes professionnelles : nous fournissons du matériel informatique professionnel HP, Lenovo et Dell, adapté à vos usages. Nous prenons en charge le déploiement des postes, la migration Windows et la virtualisation, puis la maintenance préventive de votre parc. Les organisations angevines bénéficient ainsi d'un seul interlocuteur, du choix du matériel au support au quotidien.",
    features: [
      "Postes de travail & laptops",
      "Serveurs & NAS",
      "Imprimantes pro",
      "Migration Windows",
      "Virtualisation",
      "Maintenance préventive",
    ],
    partners: ["HP", "Lenovo", "Dell"],
    related: { href: "/services#maintenance", label: "Contrats de maintenance informatique" },
    quote: "Demander un devis informatique",
  },
  {
    id: "04",
    slug: "cybersecurite",
    title: "Cybersécurité",
    heading: "Cybersécurité, pare-feu et vidéosurveillance",
    subtitle: "Protégez ce qui compte vraiment",
    icon: ShieldCheck,
    image: "/images/cybersecurite-entreprise.webp",
    alt: "Illustration de cybersécurité : bouclier à cadenas protégeant un ordinateur et le cloud",
    description:
      "Face aux cybermenaces croissantes, les PME et les collectivités doivent protéger leurs données et leur activité. Nous déployons des pare-feu Fortinet, des antivirus entreprise, le filtrage web et la sauvegarde externalisée. Un audit de sécurité permet d'identifier vos points faibles et de prioriser les actions. Pour la protection de vos locaux, nous proposons aussi la vidéosurveillance Hikvision.",
    features: [
      "Pare-feu Fortinet",
      "Antivirus entreprise",
      "Sauvegarde externalisée",
      "Audit de sécurité",
      "Filtrage web",
      "Vidéosurveillance",
    ],
    partners: ["Fortinet", "Hikvision", "Zyxel"],
    related: { href: "/services#securite", label: "Audit et protection de votre système d'information" },
    quote: "Demander un devis cybersécurité",
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
                Nos solutions IT<br />
                <span className="block mt-3 text-[#7C6EFA] text-4xl sm:text-5xl leading-tight">à Angers et en Anjou</span>
              </h1>
            </div>
            <p className="text-white/70 text-xl leading-relaxed pb-2">
              De la téléphonie IP à la cybersécurité, Léa Numérique équipe les entreprises,
              collectivités et établissements de santé d&apos;Angers et du Maine-et-Loire avec
              des partenaires technologiques de référence.
            </p>
          </div>
        </div>
      </section>

      {/* Solutions — sections aérées */}
      {solutions.map((solution, index) => (
        <div key={solution.id} id={solution.slug} className="border-t border-white/[0.06] scroll-mt-24">
          <div className="max-w-6xl mx-auto px-6 lg:px-8 py-24 lg:py-32">
            <div className={`grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center ${index % 2 !== 0 ? "lg:[&>*:first-child]:order-2" : ""}`}>

              {/* Image */}
              <div className="relative">
                <div className="relative rounded-2xl overflow-hidden aspect-[4/3]">
                  <Image
                    src={solution.image}
                    alt={solution.alt}
                    fill
                    sizes="(min-width: 1024px) 50vw, 100vw"
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
                  {solution.heading}
                </h2>
                <p className="text-[#7C6EFA] font-medium mb-6">{solution.subtitle}</p>
                <p className="text-white/70 leading-relaxed mb-10">{solution.description}</p>

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

                <div className="flex flex-col sm:flex-row sm:flex-wrap gap-x-8 gap-y-3">
                  <Link
                    href={solution.related.href}
                    className="inline-flex items-center gap-2 text-white/70 hover:text-white font-semibold text-sm transition-colors group"
                  >
                    {solution.related.label}
                    <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" aria-hidden="true" />
                  </Link>
                  <Link
                    href="/contact"
                    className="inline-flex items-center gap-2 text-[#7C6EFA] hover:text-white font-semibold text-sm transition-colors group"
                  >
                    {solution.quote}
                    <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" aria-hidden="true" />
                  </Link>
                </div>
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
