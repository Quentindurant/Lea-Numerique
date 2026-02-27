"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Users, Star } from "lucide-react";
import { useScrollReveal } from "@/hooks/useScrollReveal";

export default function About() {
  const ref = useScrollReveal();

  return (
    <section ref={ref} className="bg-[#F5F4FF] py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div>
            <span className="text-[#7C6EFA] font-semibold text-sm uppercase tracking-widest">
              Qui sommes-nous ?
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold text-[#0D0D1A] mt-3 mb-6 leading-tight">
              Notre expertise.
            </h2>
            <p className="text-gray-600 leading-relaxed mb-5">
              Léa Numérique se positionne en tant que distributeur spécialisé dans les solutions technologiques, avec une mission à double volet. D'une part, notre engagement est de répondre de manière proactive à vos besoins croissants en matière de réseau, informatique, cybersécurité et téléphonie.
            </p>
            <p className="text-gray-600 leading-relaxed mb-8">
              D'autre part, nous vous offrons un accès à des innovations de pointe. Cette approche unique garantit que notre partenariat vous place toujours à l'avant-garde de l'évolution numérique, tout en répondant efficacement à vos exigences en constante évolution.
            </p>
            <Link
              href="/a-propos"
              className="inline-flex items-center gap-2 text-[#7C6EFA] font-semibold hover:gap-3 transition-all duration-200"
            >
              En savoir plus sur nous
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="relative overflow-hidden lg:overflow-visible">
            <div className="relative rounded-3xl overflow-hidden shadow-2xl">
              <Image
                src="/images/informatique.png"
                alt="Solutions informatiques"
                width={600}
                height={500}
                className="w-full h-80 object-cover"
              />
            </div>
            {/* Floating stats cards */}
            <div className="absolute -bottom-6 left-0 lg:-left-6 bg-white rounded-2xl shadow-xl p-5 flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-[#7C6EFA]/10 flex items-center justify-center">
                <Users className="text-[#7C6EFA] w-5 h-5" />
              </div>
              <div>
                <p className="text-2xl font-bold text-[#0D0D1A]">800+</p>
                <p className="text-gray-500 text-sm">Clients nous font confiance</p>
              </div>
            </div>
            <div className="absolute -top-6 right-0 lg:-right-6 bg-white rounded-2xl shadow-xl p-5 flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-[#7C6EFA]/10 flex items-center justify-center">
                <Star className="text-[#7C6EFA] w-5 h-5" />
              </div>
              <div>
                <p className="text-2xl font-bold text-[#0D0D1A]">10+</p>
                <p className="text-gray-500 text-sm">Ans d&apos;expérience</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
