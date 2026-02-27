import Hero from "@/components/sections/Hero";
import About from "@/components/sections/About";
import ServiceCards from "@/components/sections/ServiceCards";
import Features from "@/components/sections/Features";
import Process from "@/components/sections/Process";
import Clients from "@/components/sections/Clients";
import ContactCTA from "@/components/sections/ContactCTA";

export default function Home() {
  return (
    <>
      <Hero />
      <About />
      <ServiceCards />
      <Features />
      <Process />
      <Clients />
      <ContactCTA />
    </>
  );
}
