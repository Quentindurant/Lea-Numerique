import type { Metadata } from "next";
import { notFound } from "next/navigation";
import SolutionPage from "@/components/solutions/SolutionPage";
import { solutionBreadcrumb } from "@/components/solutions/shared";
import { JsonLd } from "@/components/seo/JsonLd";
import { getSolutionContent } from "@/content/solutions";
import { breadcrumbJsonLd, faqJsonLd, serviceJsonLd } from "@/lib/jsonld";
import { pageMetadata } from "@/lib/seo";
import { SOLUTIONS, findSolution } from "@/lib/solutions";

type Props = { params: Promise<{ slug: string }> };

// Seules les pages du registre (src/lib/solutions.ts) existent : tout autre slug renvoie une 404
export const dynamicParams = false;

export function generateStaticParams() {
  return SOLUTIONS.map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const entry = findSolution(slug);
  if (!entry) notFound();
  const { seo } = getSolutionContent(entry.slug);
  return pageMetadata({ title: seo.title, description: seo.description, path: entry.path });
}

export default async function Page({ params }: Props) {
  const { slug } = await params;
  const entry = findSolution(slug);
  if (!entry) notFound();
  const content = getSolutionContent(entry.slug);
  return (
    <>
      <JsonLd data={serviceJsonLd(content)} />
      <JsonLd data={breadcrumbJsonLd(solutionBreadcrumb(entry))} />
      <JsonLd data={faqJsonLd(content.faq.items)} />
      <SolutionPage entry={entry} content={content} />
    </>
  );
}
