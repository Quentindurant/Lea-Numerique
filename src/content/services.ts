import type { RichText } from "@/content/solutions/types";
import { solutionPath } from "@/lib/solutions";
import { site } from "@/lib/site";

/*
 * Textes de la page /services, réunis dans ce fichier pour la relecture.
 *
 * - Les liens s'écrivent au format [libellé](/chemin) du type RichText
 *   (voir src/content/solutions/types.ts) ; tel: et mailto: sont aussi acceptés.
 * - Les chemins des pages solutions passent par le registre src/lib/solutions.ts.
 * - Les slugs des prestations servent d'ancres (#conseil, #installation,
 *   #maintenance, #securite) : le footer et d'autres pages pointent dessus,
 *   ils ne doivent pas changer.
 * - Les exemples de projets sont des situations types, jamais des références clients.
 */

const telephonie = solutionPath("telephonie-ip");
const reseaux = solutionPath("reseaux-wifi");
const materiel = solutionPath("materiel-informatique");
const cyber = solutionPath("cybersecurite");
const operateur = solutionPath("operateur-telecom");
const alarme = solutionPath("alarme-videosurveillance");
const telephone = `[${site.phoneDisplay}](tel:${site.phone})`;
const email = `[${site.email}](mailto:${site.email})`;

export type ServiceSlug = "conseil" | "installation" | "maintenance" | "securite";

export interface PageLink {
  href: string;
  label: string;
}

export interface ServiceBlock {
  /** Numéro affiché à côté de l'icône */
  id: string;
  /** Ancre de la section (ne pas modifier) */
  slug: ServiceSlug;
  /** Nom court (navigation interne, pastilles des exemples) */
  shortLabel: string;
  /** Libellé du badge posé sur l'image */
  label: string;
  /** Titre H2 */
  heading: string;
  tagline: string;
  image: { src: string; alt: string };
  /** 2 ou 3 paragraphes : besoin, déroulé, ce que vous obtenez */
  paragraphs: RichText[];
  /** Résumé compact de la prestation */
  items: string[];
  links: PageLink[];
}

export type ProcessStepKey = "contact" | "analyse" | "proposition" | "realisation" | "suivi";

export interface ProcessStep {
  key: ProcessStepKey;
  label: string;
  description: RichText;
}

export type CommitmentKey = "reponse" | "site" | "devis" | "horaires";

export interface Commitment {
  key: CommitmentKey;
  title: string;
  text: RichText;
}

export type UseCaseKey = "mairie" | "ehpad" | "notaire" | "pme";

export interface UseCase {
  key: UseCaseKey;
  sector: string;
  /** Titre H3 */
  title: string;
  situation: RichText;
  intervention: RichText;
  /** Prestations mobilisées (renvoient vers les sections de la page) */
  services: ServiceSlug[];
}

export interface ServicesPageContent {
  seo: {
    /** Sans le suffixe " | Léa Numérique" ajouté automatiquement (titre complet : 50 à 60 caractères) */
    title: string;
    /** 140 à 155 caractères, avec un appel à l'action */
    description: string;
  };
  hero: { eyebrow: string; title: string; highlight: string; intro: string };
  overview: { badge: string; title: string; paragraphs: RichText[]; navLabel: string };
  summaryLabel: string;
  services: ServiceBlock[];
  cases: {
    badge: string;
    title: string;
    intro: RichText;
    situationLabel: string;
    interventionLabel: string;
    servicesLabel: string;
    items: UseCase[];
  };
  process: { badge: string; title: string; intro: RichText; steps: ProcessStep[] };
  commitments: { badge: string; title: string; intro: RichText; items: Commitment[] };
  cta: { title: string; text: string; link: PageLink };
}

export const servicesPage: ServicesPageContent = {
  seo: {
    title: "Maintenance informatique entreprise à Angers",
    description:
      "Maintenance informatique à Angers : audit, installation, contrat avec helpdesk dédié et intervention sur site sous 4h. Demandez votre devis gratuit.",
  },

  hero: {
    eyebrow: "Ce que nous faisons",
    title: "Services et maintenance informatique",
    highlight: "à Angers et en Anjou",
    intro:
      "De l'audit de départ au support au quotidien, Léa Numérique prend en charge l'informatique et la téléphonie des organisations d'Angers et du Maine-et-Loire. Vous gardez un seul interlocuteur, qui se déplace sur site quand c'est nécessaire et vous répond directement.",
  },

  overview: {
    badge: "Services et solutions",
    title: "Quatre prestations, un seul interlocuteur",
    paragraphs: [
      `Nos pages solutions présentent ce que nous installons : la [téléphonie IP et le standard d'entreprise](${telephonie}), les [réseaux, le Wi-Fi et le câblage](${reseaux}), le [matériel informatique professionnel](${materiel}) et la [cybersécurité, du pare-feu à la sauvegarde](${cyber}). Notre [offre d'opérateur télécom](${operateur}) couvre vos lignes, vos forfaits mobiles et votre accès fibre, et notre page [alarme et vidéosurveillance](${alarme}) la protection de vos locaux. Cette page décrit la façon dont nous travaillons sur ces sujets, en quatre prestations qui peuvent s'enchaîner sur un même projet : le conseil, l'installation, la maintenance et la sécurité.`,
      "[Installés place du Président Kennedy à Angers](/a-propos), nous intervenons dans l'agglomération, dans tout le Maine-et-Loire et en Pays de la Loire. Le reste de la France est couvert sur site ou à distance, en particulier pour les organisations multi-sites.",
    ],
    navLabel: "Accès direct aux quatre prestations",
  },

  summaryLabel: "La prestation en bref",

  services: [
    {
      id: "01",
      slug: "conseil",
      shortLabel: "Conseil",
      label: "Conseil & Accompagnement",
      heading: "Conseil et audit informatique",
      tagline: "Nous partons de votre existant avant de proposer quoi que ce soit.",
      image: {
        src: "/images/conseil-audit-informatique.webp",
        alt: "La mascotte Léa Numérique conseille deux utilisateurs face à un problème informatique",
      },
      paragraphs: [
        "Un standard téléphonique en fin de vie, un Wi-Fi qui décroche à l'étage, des postes de générations différentes, une sauvegarde dont personne ne sait si elle fonctionne : avant d'acheter du matériel, il faut savoir par où commencer. Le conseil sert à décider sur des bases claires, et à étaler les investissements quand tout ne peut pas être fait en même temps.",
        "La mission débute par un audit de votre infrastructure existante : téléphonie, réseau, postes de travail, serveurs et sécurité. Il fait la part entre ce qui peut être conservé et ce qui doit être remplacé. Vous recevez ensuite des préconisations personnalisées et, si nécessaire, un plan de transformation IT qui ordonne les chantiers par priorité.",
        "Pour le choix du matériel, nous nous appuyons sur une veille technologique et sur la relation avec 16 marques partenaires, qui vous donne accès à des tarifs préférentiels. Quand un changement touche vos équipes, comme un nouveau standard ou de nouveaux postes, nous l'accompagnons jusqu'à la formation des utilisateurs.",
      ],
      items: [
        "Audit de l'infrastructure existante",
        "Préconisations personnalisées",
        "Plan de transformation IT",
        "Accompagnement au changement",
        "Veille technologique",
        "Relation partenaires et constructeurs",
      ],
      links: [
        { href: "/solutions", label: "Toutes nos solutions télécom et IT" },
        { href: "/contact", label: "Demander un audit de votre installation" },
      ],
    },
    {
      id: "02",
      slug: "installation",
      shortLabel: "Installation",
      label: "Installation & Déploiement",
      heading: "Installation réseau, téléphonie et postes de travail",
      tagline: "Du câblage à la formation des utilisateurs.",
      image: {
        src: "/images/installation-deploiement-it.webp",
        alt: "La mascotte Léa Numérique, casque de chantier, intervient sur une armoire de câblage",
      },
      paragraphs: [
        "Un déménagement, un nouveau bâtiment, le remplacement d'un standard ou le renouvellement des postes : ces chantiers touchent plusieurs métiers à la fois, du câblage à la téléphonie. Nous prenons en charge l'ensemble, ce qui vous évite de coordonner plusieurs prestataires et de chercher qui est responsable quand quelque chose ne fonctionne pas.",
        `Selon le projet, l'installation comprend le câblage RJ45 et fibre optique, la configuration des équipements actifs (switchs, routeurs, bornes Wi-Fi, pare-feu), le déploiement des postes de travail et la mise en service de la téléphonie IP. Les équipements eux-mêmes sont présentés sur nos pages [réseaux, Wi-Fi et câblage](${reseaux}), [téléphonie IP et standard d'entreprise](${telephonie}) et [postes, serveurs et imprimantes](${materiel}).`,
        "Avant la remise de l'installation, nous réalisons les tests et la recette technique, c'est-à-dire la vérification point par point de ce qui était prévu : par exemple les prises réseau, la couverture Wi-Fi ou les appels entrants et sortants. La formation des utilisateurs termine l'intervention, pour que vos équipes prennent en main leurs nouveaux outils.",
      ],
      items: [
        "Câblage réseau RJ45 et fibre optique",
        "Configuration des équipements actifs",
        "Déploiement de postes de travail",
        "Mise en service téléphonie IP",
        "Tests et recette technique",
        "Formation des utilisateurs",
      ],
      links: [{ href: "/contact", label: "Demander un devis d'installation" }],
    },
    {
      id: "03",
      slug: "maintenance",
      shortLabel: "Maintenance",
      label: "Maintenance & Support",
      heading: "Maintenance informatique et support",
      tagline: "Un interlocuteur qui connaît votre installation.",
      image: {
        src: "/images/maintenance-support-informatique.webp",
        alt: "La mascotte Léa Numérique répond au téléphone devant un ordinateur portable",
      },
      paragraphs: [
        "Un poste qui ne démarre plus ou des appels qui n'arrivent plus au standard : en cas de panne, il faut savoir qui appeler. Le contrat de maintenance règle cette question à l'avance. Il est personnalisé selon votre structure et votre équipement, et vous donne accès à un helpdesk téléphonique dédié.",
        "Quand c'est possible, le technicien intervient en télémaintenance sécurisée : il prend la main à distance sur le poste concerné et corrige le problème sans déplacement. Si la situation demande une présence physique, l'intervention sur site a lieu sous 4h, comme le prévoit le contrat.",
        `Chaque mois, un rapport de suivi fait le point sur les interventions. La gestion du parc matériel tient à jour l'inventaire de vos équipements : elle permet d'anticiper les renouvellements et de planifier la [maintenance préventive de vos postes, serveurs et imprimantes](${materiel}) plutôt que de subir les pannes.`,
      ],
      items: [
        "Contrat de maintenance personnalisé",
        "Helpdesk téléphonique dédié",
        "Intervention sur site sous 4h",
        "Télémaintenance sécurisée",
        "Suivi et rapports mensuels",
        "Gestion du parc matériel",
      ],
      links: [{ href: "/contact", label: "Demander un contrat de maintenance" }],
    },
    {
      id: "04",
      slug: "securite",
      shortLabel: "Sécurité",
      label: "Sécurité & Protection",
      heading: "Sécurité informatique et sauvegarde",
      tagline: "Se protéger des attaques, et savoir redémarrer si l'une d'elles réussit.",
      image: {
        src: "/images/securite-informatique.webp",
        alt: "La mascotte Léa Numérique sécurise un poste de travail : bouclier d'alerte, clé et cadenas",
      },
      paragraphs: [
        "Un rançongiciel qui chiffre les dossiers partagés, une messagerie piratée après un e-mail d'hameçonnage, un serveur qui tombe sans sauvegarde récente : ces incidents peuvent bloquer l'activité d'une PME comme d'une collectivité. La prestation sécurité poursuit deux objectifs : réduire le risque d'incident, et en limiter les conséquences s'il se produit.",
        `Elle commence par un audit de sécurité complet, qui repère les points faibles et permet de prioriser les actions. Nous déployons ensuite les protections adaptées : pare-feu nouvelle génération Fortinet, antivirus et EDR sur les postes, filtrage web et DNS, sauvegarde externalisée chiffrée. L'EDR, par exemple, surveille le comportement des programmes et peut stopper un chiffrement massif de fichiers. Le rôle de chaque protection est détaillé sur notre page [cybersécurité, pare-feu et sauvegarde](${cyber}).`,
        `Pour les structures qui ne peuvent pas se permettre un arrêt prolongé, nous formalisons un plan de reprise d'activité (PRA) : il indique quels systèmes restaurer en premier et à partir de quelles sauvegardes, pour reprendre le travail au plus vite après un sinistre. Pour les locaux, [l'alarme, le contrôle d'accès et la vidéosurveillance](${alarme}) complètent le dispositif.`,
      ],
      items: [
        "Pare-feu nouvelle génération (Fortinet)",
        "Antivirus et EDR entreprise",
        "Sauvegarde externalisée chiffrée",
        "Audit de sécurité complet",
        "Filtrage web et DNS",
        "Plan de reprise d'activité (PRA)",
      ],
      links: [{ href: "/contact", label: "Demander un audit de sécurité" }],
    },
  ],

  cases: {
    badge: "Exemples types",
    title: "Quatre situations types",
    intro:
      "Ces exemples décrivent des situations types, construites à partir des besoins courants de chaque secteur. Ce ne sont pas des références clients : votre projet commence par l'analyse de votre propre installation.",
    situationLabel: "Situation",
    interventionLabel: "Intervention type",
    servicesLabel: "Prestations mobilisées",
    items: [
      {
        key: "mairie",
        sector: "Mairie et collectivité",
        title: "Une mairie qui modernise son accueil téléphonique",
        situation:
          "La mairie d'une commune du Maine-et-Loire utilise un standard vieillissant, et l'école comme les services techniques occupent d'autres bâtiments. L'accueil doit pouvoir transférer les appels vers les bons services, et les agents en déplacement doivent rester joignables.",
        intervention: `Après l'audit de l'existant, nous proposons un [standard téléphonique IP](${telephonie}) avec renvoi sur mobile et messagerie vocale. Les bâtiments sont reliés par VPN, et le réseau est configuré en [VLAN avec une QoS qui donne la priorité à la voix](${reseaux}). Les agents sont formés lors de la mise en service, puis un contrat de maintenance assure le suivi.`,
        services: ["conseil", "installation", "maintenance"],
      },
      {
        key: "ehpad",
        sector: "EHPAD et établissement de santé",
        title: "Un EHPAD où le personnel doit rester joignable",
        situation:
          "Dans un EHPAD, le personnel se déplace toute la journée entre les étages et doit pouvoir être appelé partout, y compris dans les chambres. Les dossiers des résidents contiennent des données de santé, dont la confidentialité est encadrée par la loi.",
        intervention: `Nous dimensionnons le [Wi-Fi professionnel](${reseaux}) selon la configuration du bâtiment et équipons les équipes de [téléphones IP sans fil Yealink](${telephonie}). Les postes et les données sont protégés par un [pare-feu Fortinet et un EDR](${cyber}), avec une sauvegarde externalisée chiffrée, confiée à un hébergeur certifié HDS puisqu'il s'agit de données de santé. Le [contrôle d'accès et la vidéosurveillance](${alarme}) sécurisent les entrées.`,
        services: ["conseil", "installation", "securite", "maintenance"],
      },
      {
        key: "notaire",
        sector: "Notaires et professions libérales",
        title: "Une étude de notaire qui protège ses dossiers",
        situation:
          "Une étude notariale conserve des actes et des dossiers clients confidentiels. Une partie de ses postes fonctionne encore sous Windows 10, dont le support par Microsoft a pris fin en octobre 2025, et plusieurs collaborateurs ont besoin de travailler à distance.",
        intervention: `Les postes trop anciens sont remplacés par des [postes HP, Lenovo ou Dell](${materiel}), les autres migrent vers Windows 11, et l'accès à distance passe par un [VPN sécurisé](${reseaux}). Une [sauvegarde externalisée chiffrée et un EDR sur chaque poste](${cyber}) protègent les dossiers, et un plan de reprise d'activité prévoit la marche à suivre en cas d'incident.`,
        services: ["conseil", "installation", "securite", "maintenance"],
      },
      {
        key: "pme",
        sector: "PME et industrie",
        title: "Une PME industrielle sans service informatique",
        situation:
          "Prenons une PME industrielle de l'agglomération angevine équipée au fil des embauches, avec des postes d'âges différents et un Wi-Fi d'atelier qui couvre mal. Les commerciaux en déplacement manquent des appels, et personne en interne n'est chargé de l'informatique.",
        intervention: `L'audit fait le point sur le parc. Nous renouvelons les [postes les plus anciens](${materiel}), reprenons la [couverture Wi-Fi de l'atelier](${reseaux}) et mettons en place un [standard IP avec renvoi sur mobile](${telephonie}). Un [contrat de maintenance](#maintenance) avec helpdesk dédié prend ensuite le relais.`,
        services: ["conseil", "installation", "maintenance"],
      },
    ],
  },

  process: {
    badge: "Processus",
    title: "Comment se déroule votre projet IT ?",
    intro:
      "Remplacement d'un standard, déménagement, renouvellement des postes ou remise à niveau de la sécurité : chaque projet suit ces cinq étapes. Le diagnostic et le devis ne vous engagent à rien.",
    steps: [
      {
        key: "contact",
        label: "Prise de contact",
        description: `Vous nous appelez au ${telephone} ou vous nous écrivez via le [formulaire de contact](/contact). Un accusé de réception automatique confirme l'envoi de votre message, puis un expert l'analyse et vous recontacte sous 24h ouvrées.`,
      },
      {
        key: "analyse",
        label: "Audit et analyse",
        description:
          "Si nécessaire, nous organisons une visite sur site ou un appel de diagnostic pour comprendre votre installation et vos contraintes. Ce diagnostic ne vous est pas facturé.",
      },
      {
        key: "proposition",
        label: "Proposition",
        description:
          "Vous recevez un devis clair, gratuit et sans engagement, qui reprend nos préconisations. Rien n'est commandé ni installé tant que vous ne l'avez pas accepté.",
      },
      {
        key: "realisation",
        label: "Mise en œuvre",
        description:
          "Installation et configuration à la date convenue avec vous, tests et recette technique, puis formation de vos utilisateurs.",
      },
      {
        key: "suivi",
        label: "Suivi continu",
        description:
          "Après la mise en service, nous restons votre interlocuteur. Avec un [contrat de maintenance](#maintenance), vous bénéficiez du helpdesk dédié, de la télémaintenance et d'un suivi mensuel.",
      },
    ],
  },

  commitments: {
    badge: "Engagements",
    title: "Délais et engagements",
    intro:
      "Ces engagements valent pour toute demande, sauf l'intervention sur site sous 4h, réservée aux contrats de maintenance.",
    items: [
      {
        key: "reponse",
        title: "Réponse sous 24h ouvrées",
        text: "Chaque demande envoyée par e-mail ou via le formulaire reçoit une réponse sous 24h ouvrées. Les jours ouvrés vont du lundi au vendredi : un message envoyé le samedi est pris en compte à partir du lundi.",
      },
      {
        key: "site",
        title: "Intervention sur site sous 4h",
        text: "Avec un contrat de maintenance, un technicien se déplace sous 4h quand l'incident ne peut pas être résolu à distance. Le périmètre couvert est précisé dans votre contrat.",
      },
      {
        key: "devis",
        title: "Devis gratuit, sans frais de diagnostic",
        text: "La visite ou l'appel de diagnostic et le devis ne vous sont pas facturés. Le devis est sans engagement : vous restez libre de ne pas y donner suite.",
      },
      {
        key: "horaires",
        title: "Du lundi au vendredi, de 9h à 17h30",
        text: `C'est sur ces horaires que nous répondons au téléphone, au ${telephone}, et aux messages envoyés à ${email}.`,
      },
    ],
  },

  cta: {
    title: "Besoin d'un service sur mesure ?",
    text: "Décrivez-nous votre situation : nous vous répondons sous 24h ouvrées, et le devis est gratuit et sans engagement.",
    link: { href: "/contact", label: "Prendre contact" },
  },
};
