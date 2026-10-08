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
              Un intégrateur IT angevin, de l&apos;audit à la maintenance
            </h2>
            <p className="text-gray-600 leading-relaxed mb-5">
              Léa Numérique est un intégrateur de solutions technologiques. Nous répondons aux besoins des organisations en téléphonie IP, réseau, informatique et cybersécurité : audit de l&apos;existant, choix du matériel, installation, formation des utilisateurs, puis maintenance.
            </p>
            <p className="text-gray-600 leading-relaxed mb-8">
              Avec nos marques partenaires de référence, dont 3CX, Yeastar, Ubiquiti, HP et Lenovo, nous sélectionnons pour chaque projet les équipements adaptés à votre structure et à votre budget, avec un interlocuteur local qui connaît votre installation.
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
                src="/images/materiel-informatique-professionnel.webp"
                alt="Illustration : techniciens informatiques travaillant devant des baies de serveurs"
                width={600}
                height={400}
                sizes="(min-width: 1024px) 600px, 100vw"
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
