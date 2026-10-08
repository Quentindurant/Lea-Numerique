import Hero from "@/components/sections/Hero";
import About from "@/components/sections/About";
import ServiceCards from "@/components/sections/ServiceCards";
import Features from "@/components/sections/Features";
import Process from "@/components/sections/Process";
import Clients from "@/components/sections/Clients";
import ServiceArea from "@/components/sections/ServiceArea";
import ContactCTA from "@/components/sections/ContactCTA";
import { pageMetadata } from "@/lib/seo";
import { site } from "@/lib/site";

export const metadata = pageMetadata({
  title: "Prestataire informatique & télécom à Angers | Léa Numérique",
  description: site.description,
  path: "/",
  absoluteTitle: true,
});

export default function Home() {
  return (
    <>
      <Hero />
      <About />
      <ServiceCards />
      <Features />
      <Process />
      <Clients />
      <ServiceArea />
      <ContactCTA />
    </>
  );
}
