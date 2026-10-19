import type { Metadata } from "next";
import { site } from "@/lib/site";

// Un openGraph défini dans une page remplace celui du layout : on le reconstruit
// entièrement ici (image comprise) pour chaque page.
export function pageMetadata({
  title,
  description,
  path,
  absoluteTitle = false,
  noindex = false,
}: {
  title: string;
  description: string;
  path: string;
  // true : le titre est utilisé tel quel, sans le suffixe « | Léa Numérique » du template
  absoluteTitle?: boolean;
  // true : « noindex, follow » (page sans intérêt dans les résultats de recherche, liens toujours suivis).
  // Une page noindex doit aussi être retirée du sitemap (src/app/sitemap.ts).
  noindex?: boolean;
}): Metadata {
  const fullTitle = absoluteTitle ? title : `${title} | ${site.name}`;
  return {
    title: absoluteTitle ? { absolute: title } : title,
    description,
    alternates: { canonical: path },
    // Remplace entièrement le robots du layout (index, follow)
    ...(noindex ? { robots: { index: false, follow: true } } : {}),
    openGraph: {
      type: "website",
      locale: "fr_FR",
      siteName: site.name,
      url: path,
      title: fullTitle,
      description,
      images: [{ url: "/opengraph-image", width: 1200, height: 630, alt: site.name }],
    },
    twitter: {
      card: "summary_large_image",
      title: fullTitle,
      description,
      images: ["/opengraph-image"],
    },
  };
}
