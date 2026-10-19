import type { SolutionContent } from "./types";

export const materielInformatique: SolutionContent = {
  slug: "materiel-informatique",
  lastModified: "2026-10-19",

  seo: {
    title: "Matériel informatique professionnel à Angers",
    description:
      "Postes et portables HP, Lenovo ou Dell, serveurs, NAS et imprimantes : choix, migration Windows 11 et suivi du parc à Angers. Demandez un devis gratuit.",
  },

  hero: {
    eyebrow: "Matériel informatique",
    title: "Matériel informatique professionnel, du choix des postes au suivi du parc",
    intro:
      "Du portable d'un commercial au serveur de fichiers d'une mairie, nous choisissons le matériel HP, Lenovo ou Dell d'après l'usage réel, puis nous le déployons et le maintenons. [Intégrateur installé à Angers](/a-propos), nous intervenons dans tout le Maine-et-Loire.",
    image: {
      src: "/images/materiel-informatique-professionnel.webp",
      alt: "Illustration : trois techniciens informatiques travaillent devant des baies de serveurs, deux d'entre eux sur ordinateur portable",
    },
  },

  sections: [
    {
      title: "Pourquoi renouveler un parc informatique vieillissant",
      paragraphs: [
        "Un parc se constitue souvent au fil des achats : des postes d'âges et de marques différents, un serveur installé il y a des années. Les pannes se multiplient, et plus personne ne sait quels appareils sont encore garantis.",
      ],
      bullets: [
        "Mairie : des postes d'accueil lents, incompatibles avec Windows 11.",
        "EHPAD : des postes de soins partagés jour et nuit, à garder disponibles.",
        "Étude notariale : des multifonctions très sollicitées pour numériser les pièces des dossiers.",
        "PME : des salariés en télétravail sans portable, et un serveur en fin de garantie.",
      ],
    },
    {
      title: "Fin du support de Windows 10 : migrer vos postes vers Windows 11",
      paragraphs: [
        "Depuis le 14 octobre 2025, Windows 10 ne reçoit plus de mises à jour de sécurité, sauf sur les postes inscrits au programme payant de mises à jour étendues (ESU). Ce programme accorde un sursis aux organisations, trois ans au plus et à un prix qui double chaque année : il laisse le temps de migrer, sans en dispenser.",
        "Windows 11 exige notamment un processeur pris en charge, une puce TPM 2.0 et le démarrage sécurisé. Nous vérifions chaque poste : les compatibles sont mis à niveau, les autres remplacés en priorité, avec transfert des données et contrôle de vos logiciels métiers et périphériques.",
      ],
    },
    {
      title: "Nos critères pour choisir postes, serveurs, NAS et imprimantes",
      paragraphs: [
        "Nous privilégions les gammes professionnelles, aux garanties en général plus longues, et nos partenariats donnent accès à des tarifs préférentiels.",
      ],
      subsections: [
        {
          title: "Postes de travail et portables",
          paragraphs: [
            "Un portable avec station d'accueil convient à ceux qui se déplacent ou télétravaillent, avec un [accès VPN sécurisé](/solutions/reseaux-wifi) aux fichiers. Pour l'accueil ou un poste partagé, un poste fixe coûte en général moins cher à performances égales.",
          ],
        },
        {
          title: "Serveur, NAS et virtualisation",
          paragraphs: [
            "Un NAS suffit souvent pour partager des fichiers et recevoir des sauvegardes. Un serveur devient préférable pour un logiciel métier ou une base de données exigeant Windows Server, ou pour centraliser comptes et droits. La virtualisation fait tourner plusieurs serveurs virtuels sur une seule machine physique.",
          ],
        },
        {
          title: "Imprimantes et multifonctions",
          paragraphs: [
            "Le choix dépend du volume mensuel et des usages : couleur, numérisation vers un dossier ou par e-mail. Sur la durée, le coût par page pèse souvent plus que le prix d'achat. L'impression libérée par code évite qu'un document sensible reste dans le bac.",
          ],
        },
      ],
    },
    {
      title: "Comment se déroule un renouvellement de parc informatique",
      paragraphs: [
        "Le projet commence par un [audit du parc existant](/services#conseil) : inventaire, âge et garantie des postes, compatibilité Windows 11, usages. Vous recevez un devis clair, avec si besoin un remplacement étalé par vagues.",
        "Le [déploiement des postes](/services#installation) suit une configuration type (système, logiciels, sécurité), sur site en Anjou comme sur vos sites éloignés, avec transfert des données et prise en main par les utilisateurs. Un [contrat de maintenance informatique](/services#maintenance) peut ensuite prendre le relais, avec maintenance préventive et intervention sur site sous 4h.",
      ],
    },
  ],

  brands: {
    title: "Les constructeurs partenaires : HP, Lenovo et Dell",
    items: [
      {
        name: "HP",
        description:
          "Partenaire certifié : postes, portables et imprimantes chez un même constructeur, pour un suivi des garanties simplifié.",
      },
      {
        name: "Lenovo",
        description: "Portables et postes fixes professionnels, comparés à budget égal aux configurations HP et Dell.",
      },
      {
        name: "Dell",
        description:
          "Partenaire certifié : postes de travail et serveurs, de quoi équiper le serveur et les postes chez un seul constructeur.",
      },
    ],
  },

  example: {
    title: "Exemple de projet : passer les postes d'une mairie à Windows 11",
    context:
      "Exemple type de déroulé pour une mairie d'une quinzaine d'agents, avec des postes sous Windows 10, un serveur en fin de garantie et une multifonction partagée entre les services.",
    steps: [
      "Inventaire et test de compatibilité Windows 11.",
      "Postes fixes à l'accueil et à l'état civil, portables pour les agents en télétravail.",
      "Remplacement du serveur, dimensionné selon les logiciels métiers.",
      "Installation par petits groupes et transfert des données.",
      "Impression libérée par code et prise en main par les agents.",
    ],
    outcome:
      "Des postes sous un système maintenu, un parc inventorié avec ses garanties, et aucun document d'état civil oublié dans le bac.",
  },

  faq: {
    title: "Questions fréquentes sur le matériel informatique",
    items: [
      {
        question: "Comment savoir si un poste peut passer à Windows 11 ?",
        answer:
          "L'application Contrôle d'intégrité du PC, de Microsoft, l'indique. Si la puce TPM est seulement désactivée, elle s'active dans les réglages UEFI. Pour un poste éligible sous Windows 10, la mise à niveau est gratuite.",
      },
      {
        question: "Un NAS en RAID suffit-il pour sauvegarder nos données ?",
        answer:
          "Non. Le RAID protège d'une panne de disque, pas d'une suppression, d'un incendie ou d'un rançongiciel : il faut aussi une copie hors de vos locaux, comme une [sauvegarde externalisée chiffrée](/solutions/cybersecurite).",
      },
      {
        question: "La virtualisation a-t-elle un intérêt avec un seul serveur ?",
        answer:
          "Oui. Chaque rôle (fichiers, logiciel métier, annuaire) a sa machine virtuelle : une mise à jour de l'un ne perturbe pas les autres, et au remplacement du serveur, les machines virtuelles sont déplacées sans réinstallation.",
      },
    ],
  },

  cta: {
    title: "Des postes à renouveler ou à migrer vers Windows\u00a011 ?",
    text: "Envoyez-nous la liste de vos équipements, même approximative : un expert l'étudie et vous répond sous 24h ouvrées. Devis gratuit, sans engagement.",
    label: "Demander un devis gratuit",
  },
};
