import Image from "next/image";
import Link from "next/link";
import { ArrowRight, CheckCircle2, ClipboardList, Handshake, Phone, Plus } from "lucide-react";
import Breadcrumbs from "@/components/ui/Breadcrumbs";
import RichText, { RICH_TEXT_LINK_CLASS, frenchSpacing as fr } from "@/components/ui/RichText";
import type { SolutionContent } from "@/content/solutions/types";
import { SOLUTIONS, type SolutionEntry } from "@/lib/solutions";
import { site } from "@/lib/site";
import { SERVICES_LINK, SOLUTION_ICONS, brandLogo, headingIds, solutionBreadcrumb } from "./shared";

// Langage visuel des pages /solutions et /services : fond #0D0D1A, accent #7C6EFA, conteneur max-w-6xl
const container = "max-w-6xl mx-auto px-6 lg:px-8";
const focusRing = "focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#7C6EFA]";
const primaryButton = `inline-flex items-center justify-center gap-2 bg-[#7C6EFA] hover:bg-[#5A4ED8] text-white px-8 py-4 rounded-full font-semibold transition-all duration-200 shadow-lg shadow-[#7C6EFA]/20 ${focusRing}`;
const secondaryButton = `inline-flex items-center justify-center gap-2 border border-white/20 hover:border-[#7C6EFA]/60 text-white/80 hover:text-white px-8 py-4 rounded-full font-semibold transition-colors ${focusRing}`;
const eyebrow = "text-[#7C6EFA] font-semibold text-sm uppercase tracking-widest";
const sectionTitle = "text-2xl sm:text-3xl font-bold text-white leading-tight";

// Identifiants fixes des blocs de la page (les titres de sections H2 ne doivent pas les reprendre)
const IDS = {
  title: "titre",
  brands: "marques",
  example: "exemple",
  faq: "questions-frequentes",
  others: "autres-solutions",
  cta: "demande-de-devis",
};

function PhoneLink({ className }: { className: string }) {
  return (
    <a href={`tel:${site.phone}`} className={className}>
      <Phone className="h-4 w-4" aria-hidden="true" />
      <span className="sr-only">Appeler le </span>
      {fr(site.phoneDisplay)}
    </a>
  );
}

export default function SolutionPage({ entry, content }: { entry: SolutionEntry; content: SolutionContent }) {
  const Icon = SOLUTION_ICONS[entry.slug];
  const others = SOLUTIONS.filter((s) => s.slug !== entry.slug);
  const sectionIds = headingIds(
    content.sections.map((s) => s.title),
    Object.values(IDS),
  );

  return (
    <div className="bg-[#0D0D1A]">
      {/* Hero */}
      <section aria-labelledby={IDS.title} className="relative overflow-hidden pt-28 pb-16 sm:pt-32 lg:pt-36 lg:pb-24">
        <div className="pointer-events-none absolute inset-0" aria-hidden="true">
          <div className="absolute -top-24 right-0 h-[420px] w-[420px] rounded-full bg-[#7C6EFA]/10 blur-3xl sm:w-[600px]" />
        </div>
        <div className={`relative ${container}`}>
          <Breadcrumbs items={solutionBreadcrumb(entry)} className="mb-10 lg:mb-14" />
          <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-[minmax(0,7fr)_minmax(0,5fr)] lg:gap-16">
            <div className="min-w-0">
              <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-[#7C6EFA]/40 px-4 py-1.5">
                <span className="h-1.5 w-1.5 rounded-full bg-[#7C6EFA] motion-safe:animate-pulse" aria-hidden="true" />
                <span className="text-sm text-[#7C6EFA]">{fr(content.hero.eyebrow)}</span>
              </div>
              <h1 id={IDS.title} className="text-4xl font-bold leading-[1.1] text-white sm:text-5xl lg:text-[3.25rem]">
                {fr(content.hero.title)}
              </h1>
              <p className="mt-6 text-lg leading-relaxed text-white/70">
                <RichText text={content.hero.intro} />
              </p>
              <div className="mt-10 flex flex-col gap-4 sm:flex-row">
                <Link href="/contact" className={primaryButton}>
                  Demander un devis
                  <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </Link>
                <PhoneLink className={secondaryButton} />
              </div>
            </div>

            <div className="relative aspect-[4/3] overflow-hidden rounded-2xl">
              <Image
                src={content.hero.image.src}
                alt={content.hero.image.alt}
                fill
                preload
                sizes="(min-width: 1152px) 430px, (min-width: 1024px) 40vw, 100vw"
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0D0D1A]/60 via-transparent to-transparent" aria-hidden="true" />
              <div className="absolute bottom-5 left-5 flex items-center gap-3 rounded-xl border border-white/10 bg-[#0D0D1A]/80 px-4 py-3 backdrop-blur-sm">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#7C6EFA]">
                  <Icon className="h-4 w-4 text-white" aria-hidden="true" />
                </div>
                <span className="text-sm font-medium text-white">{entry.label}</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Corps de page : sections H2 */}
      {content.sections.map((section, i) => (
        <section key={sectionIds[i]} aria-labelledby={sectionIds[i]} className="border-t border-white/[0.06]">
          <div className={`${container} py-16 lg:py-24`}>
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,2fr)] lg:gap-16">
              <div className="lg:sticky lg:top-28 lg:self-start">
                <span className="font-mono text-sm text-white/50" aria-hidden="true">
                  {String(i + 1).padStart(2, "0")} /
                </span>
                <h2 id={sectionIds[i]} className={`mt-2 ${sectionTitle}`}>
                  {fr(section.title)}
                </h2>
              </div>

              <div className="min-w-0">
                <div className="space-y-5">
                  {section.paragraphs.map((paragraph, j) => (
                    <p key={j} className="leading-relaxed text-white/70">
                      <RichText text={paragraph} />
                    </p>
                  ))}
                </div>

                {section.bullets && section.bullets.length > 0 && (
                  <ul className="mt-8 space-y-3 rounded-2xl border border-white/[0.07] bg-white/[0.03] p-5 sm:p-6">
                    {section.bullets.map((bullet, j) => (
                      <li key={j} className="flex items-start gap-3">
                        <CheckCircle2 className="mt-1 h-4 w-4 flex-shrink-0 text-[#7C6EFA]" aria-hidden="true" />
                        <span className="leading-relaxed text-white/70">
                          <RichText text={bullet} />
                        </span>
                      </li>
                    ))}
                  </ul>
                )}

                {section.subsections && section.subsections.length > 0 && (
                  <div className="mt-10 space-y-8">
                    {section.subsections.map((sub, j) => (
                      <div key={j} className="border-l-2 border-[#7C6EFA]/50 pl-5 sm:pl-6">
                        <h3 className="text-lg font-semibold text-white">{fr(sub.title)}</h3>
                        <div className="mt-3 space-y-3">
                          {sub.paragraphs.map((paragraph, k) => (
                            <p key={k} className="leading-relaxed text-white/70">
                              <RichText text={paragraph} />
                            </p>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>
      ))}

      {/* Marques (section facultative) */}
      {content.brands?.items.length ? (
      <section aria-labelledby={IDS.brands} className="border-t border-white/[0.06]">
        <div className={`${container} py-16 lg:py-24`}>
          <div className="max-w-2xl">
            <p className={eyebrow}>Marques partenaires</p>
            <h2 id={IDS.brands} className={`mt-3 ${sectionTitle}`}>
              {fr(content.brands.title)}
            </h2>
          </div>
          <ul className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {content.brands.items.map((brand) => {
              const logo = brandLogo(brand.name);
              return (
                <li key={brand.name} className="flex flex-col rounded-2xl border border-white/[0.07] bg-white/[0.03] p-6">
                  {logo && (
                    <div className="mb-5 flex h-8 items-center">
                      <Image
                        src={logo.src}
                        alt=""
                        width={logo.width}
                        height={logo.height}
                        sizes="120px"
                        className="h-full w-auto max-w-[120px] object-contain object-left opacity-80"
                      />
                    </div>
                  )}
                  <h3 className="text-lg font-semibold text-white">{fr(brand.name)}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-white/70">
                    <RichText text={brand.description} />
                  </p>
                </li>
              );
            })}
          </ul>
        </div>
      </section>
      ) : null}

      {/* Exemple type de projet */}
      <section aria-labelledby={IDS.example} className="border-t border-white/[0.06]">
        <div className={`${container} py-16 lg:py-24`}>
          <div className="rounded-3xl border border-[#7C6EFA]/25 bg-gradient-to-br from-[#7C6EFA]/[0.09] to-white/[0.02] p-5 sm:p-10 lg:p-14">
            <div className="grid grid-cols-1 gap-10 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:gap-16">
              <div className="min-w-0">
                <span className="inline-flex items-center gap-2 rounded-full border border-[#7C6EFA]/40 px-4 py-1.5 text-sm text-[#7C6EFA]">
                  <ClipboardList className="h-4 w-4" aria-hidden="true" />
                  Exemple type
                </span>
                <h2 id={IDS.example} className={`mt-6 ${sectionTitle}`}>
                  {fr(content.example.title)}
                </h2>
                <p className="mt-5 leading-relaxed text-white/70">
                  <RichText text={content.example.context} />
                </p>
              </div>

              <div className="min-w-0">
                <ol>
                  {content.example.steps.map((step, j) => {
                    const isLast = j === content.example.steps.length - 1;
                    return (
                      <li key={j} className="flex gap-4">
                        <div className="flex flex-col items-center" aria-hidden="true">
                          <span className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full border border-[#7C6EFA]/40 bg-[#0D0D1A] text-xs font-bold text-[#7C6EFA]">
                            {String(j + 1).padStart(2, "0")}
                          </span>
                          {!isLast && <span className="my-1 w-px flex-1 bg-gradient-to-b from-[#7C6EFA]/40 to-[#7C6EFA]/10" />}
                        </div>
                        <p className={`pt-1.5 leading-relaxed text-white/80 ${isLast ? "" : "pb-6"}`}>{fr(step)}</p>
                      </li>
                    );
                  })}
                </ol>
                <div className="mt-8 rounded-2xl border border-white/[0.07] bg-[#0D0D1A]/60 p-4 sm:p-6">
                  <p className={eyebrow}>Résultat</p>
                  <p className="mt-2 leading-relaxed text-white/80">
                    <RichText text={content.example.outcome} />
                  </p>
                </div>
              </div>
            </div>
            <p className="mt-10 border-t border-white/[0.08] pt-6 text-sm text-white/60">
              Déroulé type donné à titre indicatif. Chaque projet est défini après l&apos;audit de votre installation existante.
            </p>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section aria-labelledby={IDS.faq} className="border-t border-white/[0.06]">
        <div className={`${container} py-16 lg:py-24`}>
          <div className="grid grid-cols-1 gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,2fr)] lg:gap-16">
            <div className="lg:sticky lg:top-28 lg:self-start">
              <p className={eyebrow}>FAQ</p>
              <h2 id={IDS.faq} className={`mt-3 ${sectionTitle}`}>
                {fr(content.faq.title)}
              </h2>
              <p className="mt-5 leading-relaxed text-white/70">
                {fr("Une autre question ? Appelez-nous au")}{" "}
                <a href={`tel:${site.phone}`} className={`whitespace-nowrap ${RICH_TEXT_LINK_CLASS}`}>
                  {fr(site.phoneDisplay)}
                </a>{" "}
                ou{" "}
                <Link href="/contact" className={RICH_TEXT_LINK_CLASS}>
                  écrivez-nous
                </Link>
                .
              </p>
            </div>

            <div className="min-w-0 space-y-3">
              {content.faq.items.map((item) => (
                <details
                  key={item.question}
                  className="group rounded-2xl border border-white/[0.07] bg-white/[0.03] transition-colors open:border-[#7C6EFA]/30 open:bg-[#7C6EFA]/[0.06]"
                >
                  <summary className="flex cursor-pointer list-none items-start justify-between gap-4 rounded-2xl p-5 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#7C6EFA] sm:p-6 [&::-webkit-details-marker]:hidden">
                    <h3 className="text-base font-semibold leading-snug text-white sm:text-lg">{fr(item.question)}</h3>
                    <Plus
                      className="mt-0.5 h-5 w-5 flex-shrink-0 text-[#7C6EFA] transition-transform group-open:rotate-45"
                      aria-hidden="true"
                    />
                  </summary>
                  <div className="px-5 pb-6 sm:px-6">
                    <p className="leading-relaxed text-white/70">
                      <RichText text={item.answer} />
                    </p>
                  </div>
                </details>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Nos autres solutions */}
      <section aria-labelledby={IDS.others} className="border-t border-white/[0.06]">
        <div className={`${container} py-16 lg:py-24`}>
          <h2 id={IDS.others} className={sectionTitle}>
            Nos autres solutions
          </h2>
          <ul className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {others.map((other) => {
              const OtherIcon = SOLUTION_ICONS[other.slug];
              return (
                <li key={other.slug}>
                  <Link
                    href={other.path}
                    className={`group flex h-full items-center gap-4 rounded-2xl border border-white/[0.07] bg-white/[0.03] p-5 transition-colors hover:border-[#7C6EFA]/40 hover:bg-[#7C6EFA]/10 sm:flex-col sm:items-start sm:gap-5 sm:p-6 ${focusRing}`}
                  >
                    <span className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-[#7C6EFA]/15">
                      <OtherIcon className="h-4 w-4 text-[#7C6EFA]" aria-hidden="true" />
                    </span>
                    <span className="font-semibold leading-snug text-white">{fr(other.anchor)}</span>
                    <ArrowRight
                      className="ml-auto h-4 w-4 flex-shrink-0 text-[#7C6EFA] transition-transform group-hover:translate-x-1 sm:ml-0 sm:mt-auto"
                      aria-hidden="true"
                    />
                  </Link>
                </li>
              );
            })}
            <li>
              <Link
                href={SERVICES_LINK.path}
                className={`group flex h-full items-center gap-4 rounded-2xl border border-[#7C6EFA]/25 bg-[#7C6EFA]/[0.07] p-5 transition-colors hover:border-[#7C6EFA]/50 hover:bg-[#7C6EFA]/15 sm:flex-col sm:items-start sm:gap-5 sm:p-6 ${focusRing}`}
              >
                <span className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-[#7C6EFA]">
                  <Handshake className="h-4 w-4 text-white" aria-hidden="true" />
                </span>
                <span className="font-semibold leading-snug text-white">{fr(SERVICES_LINK.anchor)}</span>
                <ArrowRight
                  className="ml-auto h-4 w-4 flex-shrink-0 text-[#7C6EFA] transition-transform group-hover:translate-x-1 sm:ml-0 sm:mt-auto"
                  aria-hidden="true"
                />
              </Link>
            </li>
          </ul>
        </div>
      </section>

      {/* Appel à l'action final */}
      <section aria-labelledby={IDS.cta} className="border-t border-white/[0.06]">
        <div className={`${container} py-20 lg:py-28`}>
          <div className="flex flex-col items-start justify-between gap-10 lg:flex-row lg:items-center">
            <div className="max-w-2xl">
              <h2 id={IDS.cta} className="text-3xl font-bold leading-tight text-white sm:text-4xl">
                {fr(content.cta.title)}
              </h2>
              <p className="mt-4 leading-relaxed text-white/70">{fr(content.cta.text)}</p>
            </div>
            <div className="flex w-full flex-shrink-0 flex-col gap-4 sm:w-auto sm:flex-row">
              <Link href="/contact" className={primaryButton}>
                {fr(content.cta.label)}
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Link>
              <PhoneLink className={secondaryButton} />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
