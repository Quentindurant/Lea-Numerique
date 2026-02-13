const team = [
  {
    name: "Direction",
    role: "Gérant & Fondateur",
    initials: "LN",
    color: "from-[#7C6EFA] to-[#5A4ED8]",
  },
  {
    name: "Expert Téléphonie",
    role: "Ingénieur VoIP & Télécom",
    initials: "ET",
    color: "from-[#5A4ED8] to-[#3B2FC0]",
  },
  {
    name: "Expert Réseau",
    role: "Architecte Réseau & Sécurité",
    initials: "ER",
    color: "from-[#9B8FFF] to-[#7C6EFA]",
  },
  {
    name: "Support Client",
    role: "Technicien & Support N1/N2",
    initials: "SC",
    color: "from-[#7C6EFA] to-[#9B8FFF]",
  },
];

export default function Team() {
  return (
    <section className="bg-[#0D0D1A] py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <span className="text-[#7C6EFA] font-semibold text-sm uppercase tracking-widest">
            L&apos;équipe
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold text-white mt-3 mb-4">
            Des experts à votre service
          </h2>
          <p className="text-white/60 max-w-2xl mx-auto">
            Une équipe passionnée et certifiée, dédiée à votre satisfaction et à
            la réussite de vos projets IT.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {team.map((member) => (
            <div
              key={member.name}
              className="bg-[#1A1A2E] rounded-3xl p-6 text-center hover:shadow-xl hover:shadow-[#7C6EFA]/10 transition-all duration-300 group"
            >
              {/* Avatar placeholder */}
              <div
                className={`w-24 h-24 rounded-full bg-gradient-to-br ${member.color} flex items-center justify-center text-white text-2xl font-bold mx-auto mb-4 group-hover:scale-105 transition-transform duration-300`}
              >
                {member.initials}
              </div>
              <h3 className="text-white font-semibold text-lg mb-1">
                {member.name}
              </h3>
              <p className="text-[#7C6EFA] text-sm font-medium">
                {member.role}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
