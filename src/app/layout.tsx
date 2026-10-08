import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { JsonLd, siteJsonLd } from "@/components/seo/JsonLd";
import { site } from "@/lib/site";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-poppins",
});

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: "Prestataire informatique & télécom à Angers | Léa Numérique",
    template: `%s | ${site.name}`,
  },
  description: site.description,
  applicationName: site.name,
  // "./" se résout sur le chemin de chaque page (jamais "/" ici : tout pointerait vers l'accueil)
  alternates: { canonical: "./" },
  openGraph: {
    type: "website",
    locale: "fr_FR",
    siteName: site.name,
    url: "./",
    title: "Prestataire informatique & télécom à Angers | Léa Numérique",
    description: site.description,
  },
  twitter: { card: "summary_large_image" },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1 },
  },
  ...(process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION || process.env.NEXT_PUBLIC_BING_SITE_VERIFICATION
    ? {
        verification: {
          google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION,
          other: process.env.NEXT_PUBLIC_BING_SITE_VERIFICATION
            ? { "msvalidate.01": process.env.NEXT_PUBLIC_BING_SITE_VERIFICATION }
            : undefined,
        },
      }
    : {}),
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr" className={poppins.variable}>
      <body className="font-sans antialiased">
        <JsonLd data={siteJsonLd} />
        <Header />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
