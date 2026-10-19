import type { SolutionContent } from "./types";

export const cybersecurite: SolutionContent = {
  slug: "cybersecurite",
  lastModified: "2026-10-19",

  seo: {
    title: "Cybersécurité PME et collectivités à Angers",
    description:
      "Pare-feu Fortinet, EDR, filtrage DNS, sauvegarde externalisée chiffrée et PRA pour PME et collectivités du Maine-et-Loire. Demandez votre devis gratuit.",
  },

  hero: {
    eyebrow: "Cybersécurité",
    title: "Cybersécurité des entreprises et des collectivités en Anjou",
    intro:
      "À partir d'un audit de sécurité, nous construisons une protection proportionnée à votre structure : pare-feu Fortinet, EDR, sauvegarde externalisée chiffrée et plan de reprise d'activité. Installés à Angers, nous la déployons sur site et la suivons dans la durée.",
    image: {
      src: "/images/cybersecurite-entreprise.webp",
      alt: "Illustration de cybersécurité : un bouclier à cadenas protège un ordinateur portable et le cloud",
    },
  },

  sections: [
    {
      title: "Ce que la sécurité informatique doit protéger, selon votre activité",
      paragraphs: [
        "Un incident part parfois d'une simple pièce jointe piégée, et le RGPD impose de sécuriser les données personnelles que vous traitez. Les priorités varient selon les structures :",
      ],
      bullets: [
        "PME : un rançongiciel qui chiffre le serveur et le disque de sauvegarde resté branché.",
        "Mairie : des comptes partagés et des accès distants protégés par un simple mot de passe.",
        "EHPAD : des données de santé, et un [Wi-Fi des familles à isoler du réseau des soins](/solutions/reseaux-wifi).",
        "Étude notariale : des actes confidentiels, et des e-mails usurpés qui demandent de changer un RIB.",
      ],
    },
    {
      title: "Pare-feu, EDR et filtrage : protéger le réseau et les postes",
      paragraphs: [
        "Un portable en télétravail ou une clé USB contaminée échappent au pare-feu : chaque poste doit donc être protégé aussi.",
      ],
      subsections: [
        {
          title: "Pare-feu nouvelle génération Fortinet",
          paragraphs: [
            "Placé entre votre [accès internet fibre](/solutions/operateur-telecom) et le réseau local, un FortiGate ne se contente pas de filtrer des ports : il identifie les applications, bloque les intrusions connues et gère les VPN de vos sites et de vos collaborateurs nomades. Ces protections reposent sur des abonnements FortiGuard à renouveler, qui tiennent les signatures à jour.",
          ],
        },
        {
          title: "Antivirus et EDR entreprise",
          paragraphs: [
            "Un antivirus classique compare les fichiers à des signatures de menaces connues. Un EDR analyse aussi les comportements : un programme qui chiffre des centaines de fichiers peut être stoppé, le poste isolé à distance, et l'historique aide à comprendre l'attaque.",
          ],
        },
        {
          title: "Filtrage web et DNS",
          paragraphs: [
            "Le filtrage DNS bloque la résolution des domaines malveillants pour tous les appareils du réseau, même ceux où l'on ne peut rien installer. Le filtrage web du pare-feu ajoute des règles par catégorie de sites, distinctes pour le personnel et le Wi-Fi invité.",
          ],
        },
      ],
    },
    {
      title: "Sauvegarde externalisée chiffrée et plan de reprise d'activité",
      paragraphs: [
        "Une sauvegarde fiable suit la règle 3-2-1 : trois copies, sur deux supports différents, dont une hors de vos locaux. La copie externalisée est chiffrée, et l'idéal est d'en garder une hors ligne ou non modifiable, hors d'atteinte d'un rançongiciel. Une sauvegarde ne vaut que si sa restauration a été testée.",
        "Le plan de reprise d'activité (PRA) fixe, pour chaque application, la perte de données acceptable (RPO) et la durée d'interruption tolérable (RTO), puis décrit qui redémarre quoi, et dans quel ordre : dans un EHPAD, le dossier de soins passe avant la comptabilité.",
      ],
    },
    {
      title: "Vidéosurveillance professionnelle Hikvision pour vos locaux",
      paragraphs: [
        "Nous installons des caméras IP Hikvision reliées à un enregistreur réseau, alimentées par le câble Ethernet (PoE) et placées sur un réseau séparé. Les images de personnes identifiables sont des données personnelles : les zones filmées et l'accès aux enregistrements se décident dès le projet.",
      ],
    },
    {
      title: "Audit de sécurité, mise en œuvre et suivi : notre méthode",
      paragraphs: [
        "L'[audit de sécurité](/services#securite) passe en revue le pare-feu et les accès distants, les comptes et leurs droits, les sauvegardes, le cloisonnement des réseaux et les mises à jour, dont les [postes encore sous Windows 10](/solutions/materiel-informatique). Vous recevez des actions classées par priorité et un devis clair.",
        "Après la mise en œuvre et la recette, nous formons vos utilisateurs ; un [contrat de maintenance](/services#maintenance) assure ensuite le suivi, avec télémaintenance sécurisée et rapports mensuels.",
      ],
    },
  ],

  brands: {
    title: "Fortinet, Hikvision et Zyxel : nos marques de sécurité",
    items: [
      {
        name: "Fortinet",
        description:
          "Partenaire certifié : les FortiGate réunissent filtrage, VPN et détection d'intrusion, gérés depuis une seule interface.",
      },
      {
        name: "Hikvision",
        description:
          "Caméras IP et enregistreurs réseau, choisis selon les zones à couvrir, l'éclairage nocturne et la durée d'enregistrement.",
      },
      {
        name: "Zyxel",
        description:
          "Pare-feu et commutateurs pour petites structures et sites secondaires, comme une agence reliée au siège par VPN.",
      },
    ],
  },

  example: {
    title: "Exemple de projet : sécuriser le réseau et les sauvegardes d'un EHPAD",
    context:
      "Cas type : un EHPAD d'une trentaine de postes, avec un serveur local, un Wi-Fi ouvert aux familles et des sauvegardes sur disque USB.",
    steps: [
      "Audit des accès, des comptes, des sauvegardes et du cloisonnement.",
      "Pare-feu FortiGate et isolement du Wi-Fi des familles.",
      "EDR sur tous les postes et sur le serveur.",
      "Sauvegarde externalisée chiffrée chez un hébergeur certifié HDS (données de santé), puis test de restauration.",
      "Rédaction du PRA : applications prioritaires, ordre de redémarrage, contacts.",
    ],
    outcome:
      "Un réseau des soins isolé du Wi-Fi des familles, des postes surveillés et un ordre de redémarrage connu de l'équipe.",
  },

  faq: {
    title: "Questions fréquentes sur la cybersécurité",
    items: [
      {
        question: "Un pare-feu ralentit-il la connexion internet ?",
        answer:
          "Pas s'il est bien dimensionné : nous choisissons le FortiGate d'après son débit publié avec les protections activées, et non son débit maximal. Il est aussi réglé pour préserver la qualité de votre [téléphonie IP](/solutions/telephonie-ip).",
      },
      {
        question: "À quelle fréquence sauvegarder, et combien de temps garder les copies ?",
        answer:
          "La fréquence découle de la perte de données acceptable : avec une sauvegarde chaque nuit, vous perdez au plus une journée de travail. La conservation doit couvrir un problème découvert tard, comme un fichier supprimé il y a trois semaines.",
      },
      {
        question: "Comment accéder aux caméras à distance de façon sécurisée ?",
        answer:
          "Par un VPN, plutôt qu'en ouvrant un port de la box vers l'enregistreur. Nous changeons aussi les identifiants par défaut et installons le dernier firmware.",
      },
    ],
  },

  cta: {
    title: "Faisons le point sur votre sécurité informatique",
    text: "Décrivez-nous votre organisation et vos outils : nous vous recontactons sous 24h ouvrées pour cadrer l'audit et établir un devis gratuit.",
    label: "Demander un audit de sécurité",
  },
};
