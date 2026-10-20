import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";
import type { LucideIcon } from "lucide-react";
import {
  Wrench,
  Cpu,
  ShieldCheck,
  MessageSquare,
  ArrowRight,
  CheckCircle2,
  Timer,
  MapPin,
  FileCheck,
  CalendarClock,
  Landmark,
  HeartPulse,
  Scale,
  Factory,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import ProcessTimeline from "@/components/ui/ProcessTimeline";
import { pageMetadata } from "@/lib/seo";
import { site } from "@/lib/site";
import { servicesPage } from "@/content/services";
import type { CommitmentKey, ServiceSlug, UseCaseKey } from "@/content/services";

const { seo, hero, overview, summaryLabel, services, cases, process, commitments, cta } = servicesPage;

export const metadata = pageMetadata({
  title: seo.title,
  description: seo.description,
  path: "/services",
});

const serviceIcons: Record<ServiceSlug, LucideIcon> = {
  conseil: MessageSquare,
  installation: Wrench,
  maintenance: Cpu,
  securite: ShieldCheck,
};

const commitmentIcons: Record<CommitmentKey, LucideIcon> = {
  reponse: Timer,
  site: MapPin,
  devis: FileCheck,
  horaires: CalendarClock,
};

const caseIcons: Record<UseCaseKey, LucideIcon> = {
  mairie: Landmark,
  ehpad: HeartPulse,
  notaire: Scale,
  pme: Factory,
};

const shortLabels = Object.fromEntries(services.map((s) => [s.slug, s.shortLabel])) as Record<
  ServiceSlug,
  string
>;

const badgeClass = "mb-4 bg-[#7C6EFA]/15 text-[#7C6EFA] border-[#7C6EFA]/30 hover:bg-[#7C6EFA]/15";
const textLinkClass =
  "text-[#7C6EFA] underline decoration-[#7C6EFA]/40 underline-offset-4 hover:text-white hover:decoration-white/60 transition-colors";

// Typographie française : espace insécable avant « ; : ! ? » et à l'intérieur des guillemets
function fr(text: string): string {
  return text.replace(/ ([;:!?»])/g, "\u00a0$1").replace(/« /g, "«\u00a0");
}

// Texte enrichi minimal (voir RichText) : seuls les liens [libellé](cible) sont interprétés
const LINK_PATTERN = /\[([^\]]+)\]\(([^)\s]+)\)/g;

function rich(text: string): ReactNode[] {
  const nodes: ReactNode[] = [];
  let cursor = 0;
  for (const match of text.matchAll(LINK_PATTERN)) {
    const [raw, label, href] = match;
    const start = match.index ?? 0;
    if (start > cursor) nodes.push(fr(text.slice(cursor, start)));
    nodes.push(
      href.startsWith("/") ? (
        <Link key={start} href={href} className={textLinkClass}>
          {fr(label)}
        </Link>
      ) : (
        <a
          key={start}
          href={href}
          // Un numéro ou une adresse e-mail ne doit pas être coupé en fin de ligne
          className={/^(tel|mailto):/.test(href) ? `${textLinkClass} whitespace-nowrap` : textLinkClass}
        >
          {fr(label)}
        </a>
      ),
    );
    cursor = start + raw.length;
  }
  if (cursor < text.length) nodes.push(fr(text.slice(cursor)));
  return nodes;
}

export default function Services() {
  return (
    <div className="bg-[#0D0D1A]">

      {/* Hero */}
      <section className="pt-48 pb-24">
        <div className="max-w-6xl mx-auto px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-end">
            <div>
              <div className="inline-flex items-center gap-2 border border-[#7C6EFA]/40 rounded-full px-4 py-1.5 mb-10">
                <span className="w-1.5 h-1.5 rounded-full bg-[#7C6EFA] animate-pulse" />
                <span className="text-[#7C6EFA] text-sm">{hero.eyebrow}</span>
              </div>
              {/* Paliers mesurés : « maintenance » fait 335px à 48px et ne doit pas déborder sur les petits téléphones */}
              <h1 className="text-4xl min-[360px]:text-[2.75rem] min-[390px]:text-5xl sm:text-6xl font-bold text-white leading-none">
                {hero.title}{" "}
                <span className="block mt-3 text-[#7C6EFA] text-[1.75rem] min-[390px]:text-3xl sm:text-5xl leading-tight">{hero.highlight}</span>
              </h1>
            </div>
            <p className="text-white/70 text-xl leading-relaxed">{fr(hero.intro)}</p>
          </div>
        </div>
      </section>

      {/* Services et solutions : vue d'ensemble */}
      <section className="border-t border-white/[0.06]">
        <div className="max-w-6xl mx-auto px-6 lg:px-8 py-20">
          <div className="grid grid-cols-1 lg:grid-cols-[260px_1fr] gap-10 lg:gap-24">
            <div>
              <Badge className={badgeClass}>{overview.badge}</Badge>
              <h2 className="text-3xl font-bold text-white leading-tight">{fr(overview.title)}</h2>
            </div>
            <div>
              <div className="space-y-5">
                {overview.paragraphs.map((paragraph) => (
                  <p key={paragraph} className="text-white/70 leading-relaxed">
                    {rich(paragraph)}
                  </p>
                ))}
              </div>
              <nav aria-label={overview.navLabel} className="flex flex-wrap gap-3 mt-8">
                {services.map((service) => (
                  <a
                    key={service.slug}
                    href={`#${service.slug}`}
                    className="inline-flex items-center gap-2 rounded-full border border-white/10 hover:border-[#7C6EFA]/50 px-4 py-2 text-sm text-white/70 hover:text-white transition-colors"
                  >
                    <span className="font-mono text-xs text-[#7C6EFA]" aria-hidden="true">
                      {service.id}
                    </span>
                    {service.shortLabel}
                  </a>
                ))}
              </nav>
            </div>
          </div>
        </div>
      </section>

      {/* Prestations : image + contenu alternés */}
      {services.map((service, index) => {
        const Icon = serviceIcons[service.slug];
        const isEven = index % 2 === 0;
        return (
          <section
            key={service.slug}
            id={service.slug}
            aria-labelledby={`${service.slug}-titre`}
            className="border-t border-white/[0.06] scroll-mt-24"
          >
            <div className="max-w-6xl mx-auto px-6 lg:px-8 py-20 lg:py-28">
              <div
                className={`grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 lg:items-start ${
                  !isEven ? "lg:[&>*:first-child]:order-2" : ""
                }`}
              >
                {/* Image */}
                <div className="relative lg:sticky lg:top-28">
                  <div className="relative rounded-2xl overflow-hidden aspect-[4/3]">
                    <Image
                      src={service.image.src}
                      alt={service.image.alt}
                      fill
                      sizes="(min-width: 1024px) 50vw, 100vw"
                      className="object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0D0D1A]/70 to-transparent" />
                    <div className="absolute bottom-5 left-5 flex items-center gap-3 bg-[#0D0D1A]/80 backdrop-blur-sm border border-white/10 rounded-xl px-4 py-3">
                      <div className="w-9 h-9 rounded-lg bg-[#7C6EFA] flex items-center justify-center">
                        <Icon className="text-white w-4 h-4" aria-hidden="true" />
                      </div>
                      <span className="text-white text-sm font-medium">{service.label}</span>
                    </div>
                  </div>
                </div>

                {/* Contenu */}
                <div className={!isEven ? "lg:col-start-1 lg:row-start-1" : ""}>
                  <div className="flex items-center gap-3 mb-5">
                    <div className="w-10 h-10 rounded-xl bg-[#7C6EFA]/10 border border-[#7C6EFA]/20 flex items-center justify-center">
                      <Icon className="text-[#7C6EFA] w-5 h-5" aria-hidden="true" />
                    </div>
                    <span className="text-white/15 font-mono text-2xl font-bold" aria-hidden="true">
                      {service.id}
                    </span>
                  </div>
                  <h2 id={`${service.slug}-titre`} className="text-3xl font-bold text-white mb-2">
                    {fr(service.heading)}
                  </h2>
                  <p className="text-[#7C6EFA]/80 text-sm italic mb-6">{fr(`« ${service.tagline} »`)}</p>
                  <div className="space-y-4 mb-8">
                    {service.paragraphs.map((paragraph) => (
                      <p key={paragraph} className="text-white/70 leading-relaxed">
                        {rich(paragraph)}
                      </p>
                    ))}
                  </div>

                  <Card className="bg-white/[0.03] border-white/[0.07] p-5 gap-4">
                    <p className="text-white/60 text-xs uppercase tracking-widest">{summaryLabel}</p>
                    <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {service.items.map((item) => (
                        <li key={item} className="flex items-start gap-2.5">
                          <CheckCircle2 className="text-[#7C6EFA] w-4 h-4 mt-0.5 flex-shrink-0" aria-hidden="true" />
                          <span className="text-white/60 text-sm">{item}</span>
                        </li>
                      ))}
                    </ul>
                  </Card>

                  <div className="flex flex-wrap gap-x-6 gap-y-2 mt-6">
                    {service.links.map((link) => (
                      <Link
                        key={link.href}
                        href={link.href}
                        className="inline-flex items-center gap-2 text-[#7C6EFA] hover:text-white font-semibold text-sm transition-colors"
                      >
                        {link.label}
                        <ArrowRight className="w-3 h-3" aria-hidden="true" />
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </section>
        );
      })}

      {/* Cas concrets : situations types */}
      <section className="border-t border-white/[0.06]">
        <div className="max-w-6xl mx-auto px-6 lg:px-8 py-24">
          <div className="max-w-3xl mb-12">
            <Badge className={badgeClass}>{cases.badge}</Badge>
            <h2 className="text-3xl sm:text-4xl font-bold text-white leading-tight mb-5">{fr(cases.title)}</h2>
            <p className="text-white/60 leading-relaxed">{rich(cases.intro)}</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {cases.items.map((item) => {
              const Icon = caseIcons[item.key];
              return (
                <article
                  key={item.key}
                  className="flex flex-col rounded-2xl border border-white/[0.07] bg-white/[0.03] p-6 lg:p-8"
                >
                  <div className="flex items-center gap-3 mb-5">
                    <div className="w-10 h-10 rounded-xl bg-[#7C6EFA]/10 border border-[#7C6EFA]/20 flex items-center justify-center flex-shrink-0">
                      <Icon className="text-[#7C6EFA] w-5 h-5" aria-hidden="true" />
                    </div>
                    <span className="text-white/50 text-xs uppercase tracking-widest">{item.sector}</span>
                  </div>
                  <h3 className="text-xl font-semibold text-white leading-snug mb-5">{fr(item.title)}</h3>
                  <p className="text-white/60 text-xs uppercase tracking-widest mb-1.5">{cases.situationLabel}</p>
                  <p className="text-white/70 text-sm leading-relaxed mb-5">{rich(item.situation)}</p>
                  <p className="text-white/60 text-xs uppercase tracking-widest mb-1.5">{cases.interventionLabel}</p>
                  <p className="text-white/70 text-sm leading-relaxed mb-6">{rich(item.intervention)}</p>
                  <div className="mt-auto flex flex-wrap items-center gap-2 pt-5 border-t border-white/[0.06]">
                    <span className="basis-full text-white/60 text-xs mb-1">{cases.servicesLabel}</span>
                    {item.services.map((slug) => (
                      <a
                        key={slug}
                        href={`#${slug}`}
                        className="text-xs text-white/60 hover:text-white border border-white/10 hover:border-[#7C6EFA]/50 px-3 py-1 rounded-full transition-colors"
                      >
                        {shortLabels[slug]}
                      </a>
                    ))}
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      {/* Processus */}
      <section className="border-t border-white/[0.06]">
        <div className="max-w-6xl mx-auto px-6 lg:px-8 py-24">
          <div className="grid grid-cols-1 lg:grid-cols-[260px_1fr] gap-12 lg:gap-24">
            <div>
              <Badge className={badgeClass}>{process.badge}</Badge>
              <h2 className="text-3xl font-bold text-white leading-tight mb-5">{fr(process.title)}</h2>
              <p className="text-white/60 leading-relaxed">{rich(process.intro)}</p>
            </div>
            <ProcessTimeline
              steps={process.steps.map((step) => ({
                key: step.key,
                label: step.label,
                description: rich(step.description),
              }))}
            />
          </div>
        </div>
      </section>

      {/* Délais et engagements */}
      <section className="border-t border-white/[0.06]">
        <div className="max-w-6xl mx-auto px-6 lg:px-8 py-24">
          <div className="grid grid-cols-1 lg:grid-cols-[260px_1fr] gap-12 lg:gap-24">
            <div>
              <Badge className={badgeClass}>{commitments.badge}</Badge>
              <h2 className="text-3xl font-bold text-white leading-tight mb-5">{fr(commitments.title)}</h2>
              <p className="text-white/60 leading-relaxed">{rich(commitments.intro)}</p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {commitments.items.map((item) => {
                const Icon = commitmentIcons[item.key];
                return (
                  <div key={item.key} className="rounded-2xl border border-white/[0.07] bg-white/[0.03] p-6">
                    <div className="w-10 h-10 rounded-xl bg-[#7C6EFA]/10 border border-[#7C6EFA]/20 flex items-center justify-center mb-4">
                      <Icon className="text-[#7C6EFA] w-5 h-5" aria-hidden="true" />
                    </div>
                    <h3 className="text-white font-semibold mb-2">{fr(item.title)}</h3>
                    <p className="text-white/60 text-sm leading-relaxed">{rich(item.text)}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="border-t border-white/[0.06]">
        <div className="max-w-6xl mx-auto px-6 lg:px-8 py-24">
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-10">
            <div>
              <h2 className="text-4xl font-bold text-white mb-3">{fr(cta.title)}</h2>
              <p className="text-white/60 max-w-xl">{fr(cta.text)}</p>
            </div>
            <div className="flex flex-col sm:flex-row gap-4 flex-shrink-0">
              <Link
                href={cta.link.href}
                className="bg-[#7C6EFA] hover:bg-[#5A4ED8] text-white px-8 py-4 rounded-full font-semibold transition-all duration-200 text-center inline-flex items-center justify-center gap-2 shadow-lg shadow-[#7C6EFA]/20"
              >
                {cta.link.label} <ArrowRight className="w-4 h-4" aria-hidden="true" />
              </Link>
              <a
                href={`mailto:${site.email}`}
                className="text-white/50 hover:text-white px-8 py-4 rounded-full font-semibold transition-colors text-center border border-white/10 hover:border-white/20"
              >
                {site.email}
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
