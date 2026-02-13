const steps = [
  {
    number: "01",
    title: "Analyse de vos besoins",
    description:
      "Nous échangeons avec vous pour comprendre votre activité, vos contraintes et vos objectifs IT.",
  },
  {
    number: "02",
    title: "Proposition sur mesure",
    description:
      "Nous élaborons une solution adaptée à votre budget et à vos exigences techniques.",
  },
  {
    number: "03",
    title: "Mise en œuvre",
    description:
      "Nos techniciens installent et configurent vos équipements avec soin et professionnalisme.",
  },
  {
    number: "04",
    title: "Suivi & maintenance",
    description:
      "Un accompagnement continu pour garantir la performance et la sécurité de vos systèmes.",
  },
];

export default function Process() {
  return (
    <section className="bg-[#0D0D1A] py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <span className="text-[#7C6EFA] font-semibold text-sm uppercase tracking-widest">
            Comment ça marche ?
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold text-white mt-3 mb-4">
            Notre processus en 4 étapes
          </h2>
          <p className="text-white/60 max-w-2xl mx-auto">
            Un accompagnement structuré de l&apos;analyse initiale jusqu&apos;au suivi
            post-installation.
          </p>
        </div>

        <div className="relative">
          {/* Connecting line */}
          <div className="hidden lg:block absolute top-16 left-[12.5%] right-[12.5%] h-0.5 bg-gradient-to-r from-[#7C6EFA]/20 via-[#7C6EFA] to-[#7C6EFA]/20" />

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {steps.map((step, index) => (
              <div key={step.number} className="relative flex flex-col items-center text-center">
                {/* Number circle */}
                <div className="relative z-10 w-14 h-14 rounded-full bg-[#7C6EFA] flex items-center justify-center text-white font-bold text-lg mb-6 shadow-lg shadow-[#7C6EFA]/30">
                  {step.number}
                </div>

                {/* Arrow between steps on mobile */}
                {index < steps.length - 1 && (
                  <div className="lg:hidden absolute -right-4 top-5 text-[#7C6EFA]/50">
                    {/* Hidden on desktop, shown on smaller screens */}
                  </div>
                )}

                <h3 className="text-white font-semibold text-lg mb-3">
                  {step.title}
                </h3>
                <p className="text-white/55 text-sm leading-relaxed">
                  {step.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
